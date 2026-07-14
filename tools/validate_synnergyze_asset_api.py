#!/usr/bin/env python3
"""Validate Synnergyze Asset Draft API contracts, fixtures and persistence invariants."""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_DIR = ROOT / "schemas"
EXAMPLE_DIR = ROOT / "examples" / "synnergyze"
OPENAPI_PATH = ROOT / "api" / "openapi" / "synnergyze-asset-draft-api-v0.1.json"

SCHEMAS = {
    "session": SCHEMA_DIR / "synnergyze-collaboration-session.schema.json",
    "operation": SCHEMA_DIR / "synnergyze-asset-operation.schema.json",
    "event": SCHEMA_DIR / "synnergyze-asset-event.schema.json",
    "snapshot": SCHEMA_DIR / "synnergyze-asset-snapshot.schema.json",
}

EXAMPLES = {
    "session": EXAMPLE_DIR / "collaboration-session.sample.json",
    "operation": EXAMPLE_DIR / "asset-operation.sample.json",
    "event": EXAMPLE_DIR / "asset-event.sample.json",
    "snapshot": EXAMPLE_DIR / "asset-snapshot.sample.json",
}

REQUIRED_PATHS = {
    "/asset-drafts",
    "/asset-drafts/{assetDraftId}",
    "/asset-drafts/{assetDraftId}/sessions",
    "/asset-drafts/{assetDraftId}/operations",
    "/asset-drafts/{assetDraftId}/events",
    "/asset-drafts/{assetDraftId}/snapshots/latest",
    "/asset-drafts/{assetDraftId}/release-requests",
}


class DuplicateKeyError(ValueError):
    """Raised when a JSON object repeats a key."""


def reject_duplicate_keys(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise DuplicateKeyError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def load_json(path: Path) -> dict[str, Any]:
    try:
        with path.open("r", encoding="utf-8") as handle:
            value = json.load(handle, object_pairs_hook=reject_duplicate_keys)
    except (OSError, json.JSONDecodeError, DuplicateKeyError) as exc:
        raise ValueError(f"{path.relative_to(ROOT)}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path.relative_to(ROOT)}: root value must be an object")
    return value


def canonical_bytes(value: Any) -> bytes:
    if isinstance(value, float):
        raise ValueError("CC-CJSON-0.1 rejects floating-point values")
    if isinstance(value, dict):
        for item in value.values():
            canonical_bytes(item)
    elif isinstance(value, list):
        for item in value:
            canonical_bytes(item)
    return json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
        allow_nan=False,
    ).encode("utf-8")


def validate_contracts() -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]]]:
    schemas: dict[str, dict[str, Any]] = {}
    examples: dict[str, dict[str, Any]] = {}
    format_checker = FormatChecker()

    for kind, path in SCHEMAS.items():
        schema = load_json(path)
        Draft202012Validator.check_schema(schema)
        schemas[kind] = schema

    for kind, path in EXAMPLES.items():
        example = load_json(path)
        errors = sorted(
            Draft202012Validator(schemas[kind], format_checker=format_checker).iter_errors(example),
            key=lambda error: list(error.absolute_path),
        )
        if errors:
            messages = []
            for error in errors:
                location = ".".join(str(part) for part in error.absolute_path) or "<root>"
                messages.append(f"{path.relative_to(ROOT)}:{location}: {error.message}")
            raise ValueError("\n".join(messages))
        examples[kind] = example

    return schemas, examples


def validate_linked_persistence(examples: dict[str, dict[str, Any]]) -> None:
    session = examples["session"]
    operation = examples["operation"]
    event = examples["event"]
    snapshot = examples["snapshot"]

    errors: list[str] = []
    asset_id = session["assetDraftId"]

    for label, record in examples.items():
        if record["assetDraftId"] != asset_id:
            errors.append(f"{label}: assetDraftId does not match collaboration session")

    if operation["sessionRef"] != session["sessionId"]:
        errors.append("operation: sessionRef does not resolve to collaboration session")
    if operation["actorId"] != session["actorId"]:
        errors.append("operation: actorId does not match collaboration session actor")
    if operation["baseRevision"] != session["baseRevision"]:
        errors.append("operation: baseRevision does not match session starting revision")
    if event.get("operationRef") != operation["operationId"]:
        errors.append("event: operationRef does not resolve to submitted operation")
    if event["idempotencyKey"] != operation["idempotencyKey"]:
        errors.append("event: idempotency key differs from operation")
    if event["baseRevision"] != operation["baseRevision"]:
        errors.append("event: baseRevision differs from operation")
    if operation.get("resultingRevision") != event["resultingRevision"]:
        errors.append("event: resultingRevision differs from accepted operation")
    if event["resultingRevision"] != event["baseRevision"] + 1:
        errors.append("event: accepted operation must advance revision exactly once")
    if event["sequence"] != 1 and not event.get("previousEventRef"):
        errors.append("event: non-initial event must reference the previous event")
    if snapshot["lastEventRef"] != event["eventId"]:
        errors.append("snapshot: lastEventRef does not match fixture event")
    if snapshot["revision"] != event["resultingRevision"]:
        errors.append("snapshot: revision does not match event resultingRevision")
    if snapshot["state"]["assetDraftId"] != asset_id:
        errors.append("snapshot: state assetDraftId does not match envelope")
    if snapshot["state"]["revision"] != snapshot["revision"]:
        errors.append("snapshot: embedded state revision does not match snapshot revision")

    actual_digest = hashlib.sha256(canonical_bytes(snapshot["state"])).hexdigest()
    if actual_digest != snapshot["stateDigest"]["value"]:
        errors.append(
            "snapshot: state digest mismatch; "
            f"expected {snapshot['stateDigest']['value']}, calculated {actual_digest}"
        )

    if session["presencePolicy"]["authorshipEffect"] != "none":
        errors.append("session: transient presence must not create authorship")
    if session["presencePolicy"].get("retainCursorData"):
        errors.append("session: conformance fixture must not retain cursor data")

    existing_asset = load_json(ROOT / "examples" / "asset-lab" / "asset-draft.material.sample.json")
    if existing_asset["assetDraftId"] != asset_id:
        errors.append("session: Asset Draft reference does not resolve to the linked fixture")

    existing_creator = load_json(ROOT / "examples" / "records" / "creator-passport.sample.json")
    if existing_creator["creatorId"] != session["actorId"]:
        errors.append("session: actorId does not resolve to the linked Creator Passport")

    existing_warden = load_json(ROOT / "examples" / "warden" / "policy-decision.sample.json")
    if existing_warden["decisionId"] != session.get("wardenDecisionRef"):
        errors.append("session: Warden decision reference does not resolve")

    if errors:
        raise ValueError("\n".join(errors))


def dereference_parameter(spec: dict[str, Any], parameter: dict[str, Any]) -> dict[str, Any]:
    ref = parameter.get("$ref")
    if not ref:
        return parameter
    prefix = "#/components/parameters/"
    if not ref.startswith(prefix):
        raise ValueError(f"unsupported parameter reference: {ref}")
    name = ref[len(prefix):]
    try:
        resolved = spec["components"]["parameters"][name]
    except KeyError as exc:
        raise ValueError(f"unresolved OpenAPI parameter reference: {ref}") from exc
    if not isinstance(resolved, dict):
        raise ValueError(f"OpenAPI parameter {name} must be an object")
    return resolved


def validate_openapi() -> None:
    spec = load_json(OPENAPI_PATH)
    if spec.get("openapi") != "3.1.0":
        raise ValueError("OpenAPI document must use version 3.1.0")

    paths = spec.get("paths")
    if not isinstance(paths, dict):
        raise ValueError("OpenAPI paths must be an object")

    missing = REQUIRED_PATHS - set(paths)
    if missing:
        raise ValueError(f"OpenAPI missing required paths: {', '.join(sorted(missing))}")

    operation_ids: set[str] = set()
    mutating_operations = 0
    for path_name, path_item in paths.items():
        if not isinstance(path_item, dict):
            raise ValueError(f"OpenAPI path {path_name} must be an object")
        inherited_parameters = path_item.get("parameters", [])
        for method in ("get", "post", "put", "patch", "delete"):
            operation = path_item.get(method)
            if operation is None:
                continue
            if not isinstance(operation, dict):
                raise ValueError(f"OpenAPI {method.upper()} {path_name} must be an object")
            operation_id = operation.get("operationId")
            if not isinstance(operation_id, str) or not operation_id:
                raise ValueError(f"OpenAPI {method.upper()} {path_name} lacks operationId")
            if operation_id in operation_ids:
                raise ValueError(f"duplicate OpenAPI operationId: {operation_id}")
            operation_ids.add(operation_id)

            all_parameters = list(inherited_parameters) + list(operation.get("parameters", []))
            resolved = [dereference_parameter(spec, item) for item in all_parameters]
            names = {(item.get("name"), item.get("in")) for item in resolved}

            if "{assetDraftId}" in path_name and ("assetDraftId", "path") not in names:
                raise ValueError(f"OpenAPI {method.upper()} {path_name} lacks assetDraftId path parameter")

            if method in {"post", "put", "patch", "delete"}:
                mutating_operations += 1
                if ("Idempotency-Key", "header") not in names:
                    raise ValueError(
                        f"OpenAPI {method.upper()} {path_name} lacks required Idempotency-Key header"
                    )

            if path_name.endswith("/operations") and method == "post":
                if ("If-Match", "header") not in names:
                    raise ValueError("operation submission must require If-Match")
                responses = operation.get("responses", {})
                if "409" not in responses or "412" not in responses:
                    raise ValueError("operation submission must define 409 and 412 responses")

            if path_name.endswith("/release-requests") and method == "post":
                if ("If-Match", "header") not in names:
                    raise ValueError("release request must require If-Match")

    if mutating_operations < 4:
        raise ValueError("OpenAPI must define the expected mutating operations")

    external_refs: list[str] = []

    def collect_refs(value: Any) -> None:
        if isinstance(value, dict):
            for key, item in value.items():
                if key == "$ref" and isinstance(item, str) and not item.startswith("#"):
                    external_refs.append(item)
                else:
                    collect_refs(item)
        elif isinstance(value, list):
            for item in value:
                collect_refs(item)

    collect_refs(spec)
    for ref in external_refs:
        target = (OPENAPI_PATH.parent / ref).resolve()
        if not target.is_relative_to(ROOT) or not target.is_file():
            raise ValueError(f"OpenAPI external reference does not resolve: {ref}")


def main() -> int:
    try:
        _, examples = validate_contracts()
        validate_linked_persistence(examples)
        validate_openapi()
    except ValueError as exc:
        print(f"Synnergyze validation failed:\n{exc}", file=sys.stderr)
        return 1

    print("Validated 4 Synnergyze schemas, 4 linked fixtures and the OpenAPI 3.1 contract.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
