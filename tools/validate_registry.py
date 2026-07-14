#!/usr/bin/env python3
"""Validate Creators Common schemas, example records and local cross-references."""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_DIR = ROOT / "schemas"
EXAMPLE_DIR = ROOT / "examples" / "records"

SCHEMA_FILES = {
    "creator": SCHEMA_DIR / "creator-passport.schema.json",
    "creation": SCHEMA_DIR / "creation-passport.schema.json",
    "contribution": SCHEMA_DIR / "contribution-record.schema.json",
    "licence": SCHEMA_DIR / "licence-record.schema.json",
}


def load_json(path: Path) -> dict[str, Any]:
    try:
        with path.open("r", encoding="utf-8") as handle:
            value = json.load(handle)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"{path.relative_to(ROOT)}: {exc}") from exc

    if not isinstance(value, dict):
        raise ValueError(f"{path.relative_to(ROOT)}: root value must be a JSON object")
    return value


def record_kind(record: dict[str, Any]) -> str:
    if "creatorId" in record:
        return "creator"
    if "contributionId" in record:
        return "contribution"
    if "licenceId" in record:
        return "licence"
    if "creationId" in record and "passportVersion" in record:
        return "creation"
    raise ValueError("record type cannot be inferred from governed identifier fields")


def governed_id(kind: str, record: dict[str, Any]) -> str:
    key = {
        "creator": "creatorId",
        "creation": "creationId",
        "contribution": "contributionId",
        "licence": "licenceId",
    }[kind]
    value = record.get(key)
    if not isinstance(value, str):
        raise ValueError(f"{key} must be a string")
    return value


def validate_schemas() -> dict[str, dict[str, Any]]:
    schemas: dict[str, dict[str, Any]] = {}
    ids: list[str] = []

    for kind, path in SCHEMA_FILES.items():
        if not path.exists():
            raise ValueError(f"missing schema: {path.relative_to(ROOT)}")
        schema = load_json(path)
        Draft202012Validator.check_schema(schema)
        schema_id = schema.get("$id")
        if not isinstance(schema_id, str) or not schema_id:
            raise ValueError(f"{path.relative_to(ROOT)}: schema must declare a non-empty $id")
        ids.append(schema_id)
        schemas[kind] = schema

    duplicates = [schema_id for schema_id, count in Counter(ids).items() if count > 1]
    if duplicates:
        raise ValueError(f"duplicate schema $id values: {', '.join(sorted(duplicates))}")

    return schemas


def validate_examples(schemas: dict[str, dict[str, Any]]) -> list[tuple[Path, str, dict[str, Any]]]:
    if not EXAMPLE_DIR.exists():
        raise ValueError(f"missing example directory: {EXAMPLE_DIR.relative_to(ROOT)}")

    example_paths = sorted(EXAMPLE_DIR.glob("*.json"))
    if not example_paths:
        raise ValueError("no example registry records were found")

    validated: list[tuple[Path, str, dict[str, Any]]] = []
    seen_ids: set[str] = set()
    format_checker = FormatChecker()

    for path in example_paths:
        record = load_json(path)
        kind = record_kind(record)
        validator = Draft202012Validator(schemas[kind], format_checker=format_checker)
        errors = sorted(validator.iter_errors(record), key=lambda error: list(error.absolute_path))
        if errors:
            details = []
            for error in errors:
                location = ".".join(str(part) for part in error.absolute_path) or "<root>"
                details.append(f"{path.relative_to(ROOT)}:{location}: {error.message}")
            raise ValueError("\n".join(details))

        record_id = governed_id(kind, record)
        if record_id in seen_ids:
            raise ValueError(f"duplicate governed record identifier: {record_id}")
        seen_ids.add(record_id)
        validated.append((path, kind, record))

    return validated


def check_local_cross_references(records: list[tuple[Path, str, dict[str, Any]]]) -> None:
    by_kind: dict[str, set[str]] = {kind: set() for kind in SCHEMA_FILES}
    for _, kind, record in records:
        by_kind[kind].add(governed_id(kind, record))

    errors: list[str] = []

    def require_local(ref: str, expected_kind: str, source: str) -> None:
        if ref.startswith("CC-") and ref not in by_kind[expected_kind]:
            errors.append(f"{source}: unresolved local {expected_kind} reference {ref}")

    for path, kind, record in records:
        source = str(path.relative_to(ROOT))

        if kind == "creator":
            for ref in record.get("creationRefs", []):
                require_local(ref, "creation", source)
            for ref in record.get("contributionRefs", []):
                require_local(ref, "contribution", source)
            for ref in record.get("licenceRefs", []):
                require_local(ref, "licence", source)

        elif kind == "creation":
            for creator in record.get("creators", []):
                require_local(creator["creatorId"], "creator", source)
                contribution_ref = creator.get("contributionRef")
                if contribution_ref:
                    require_local(contribution_ref, "contribution", source)
            for ref in record.get("contributionRefs", []):
                require_local(ref, "contribution", source)
            for ref in record.get("licenceRefs", []):
                require_local(ref, "licence", source)

        elif kind == "contribution":
            require_local(record["creationId"], "creation", source)
            require_local(record["contributorId"], "creator", source)

        elif kind == "licence":
            require_local(record["creationId"], "creation", source)

    if errors:
        raise ValueError("\n".join(errors))


def main() -> int:
    try:
        schemas = validate_schemas()
        records = validate_examples(schemas)
        check_local_cross_references(records)
    except ValueError as exc:
        print(f"Registry validation failed:\n{exc}", file=sys.stderr)
        return 1

    counts = Counter(kind for _, kind, _ in records)
    summary = ", ".join(f"{kind}={counts[kind]}" for kind in sorted(counts))
    print(f"Validated {len(schemas)} schemas and {len(records)} example records ({summary}).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
