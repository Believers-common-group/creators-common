#!/usr/bin/env python3
"""Validate Synnergyze Asset Draft API contracts and persistence invariants."""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_DIR = ROOT / "schemas"
FIXTURE_DIR = ROOT / "api" / "examples" / "synnergyze"
OPENAPI_PATH = ROOT / "api" / "openapi" / "synnergyze-asset-draft-api-v0.1.json"

SCHEMAS = {
    "session": SCHEMA_DIR / "synnergyze-collaboration-session.schema.json",
    "operation": SCHEMA_DIR / "synnergyze-asset-operation.schema.json",
    "event": SCHEMA_DIR / "synnergyze-asset-event.schema.json",
    "snapshot": SCHEMA_DIR / "synnergyze-asset-snapshot.schema.json",
}
FIXTURES = {
    "session": FIXTURE_DIR / "collaboration-session.sample.json",
    "operation": FIXTURE_DIR / "asset-operation.sample.json",
    "event": FIXTURE_DIR / "asset-event.sample.json",
    "snapshot": FIXTURE_DIR / "asset-snapshot.sample.json",
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
    pass


def _pairs(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise DuplicateKeyError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def load_json(path: Path) -> dict[str, Any]:
    try:
        with path.open("r", encoding="utf-8") as handle:
            value = json.load(handle, object_pairs_hook=_pairs)
    except (OSError, json.JSONDecodeError, DuplicateKeyError) as exc:
        raise ValueError(f"{path.relative_to(ROOT)}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path.relative_to(ROOT)}: root must be an object")
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
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False).encode("utf-8")


def validate_schemas_and_fixtures() -> dict[str, dict[str, Any]]:
    examples: dict[str, dict[str, Any]] = {}
    checker = FormatChecker()
    for kind, schema_path in SCHEMAS.items():
        schema = load_json(schema_path)
        Draft202012Validator.check_schema(schema)
        fixture = load_json(FIXTURES[kind])
        errors = sorted(
            Draft202012Validator(schema, format_checker=checker).iter_errors(fixture),
            key=lambda error: list(error.absolute_path),
        )
        if errors:
            details = []
            for error in errors:
                location = ".".join(str(part) for part in error.absolute_path) or "<root>"
                details.append(f"{FIXTURES[kind].relative_to(ROOT)}:{location}: {error.message}")
            raise ValueError("\n".join(details))
        examples[kind] = fixture
    return examples


def validate_persistence(examples: dict[str, dict[str, Any]]) -> None:
    session = examples["session"]
    operation = examples["operation"]
    event = examples["event"]
    snapshot = examples["snapshot"]
    errors: list[str] = []
    asset_id = session["assetDraftId"]

    if any(record["assetDraftId"] != asset_id for record in examples.values()):
        errors.append("linked records do not share one Asset Draft identifier")
    if operation["sessionRef"] != session["sessionId"]:
        errors.append("operation sessionRef does not resolve")
    if operation["actorId"] != session["actorId"]:
        errors.append("operation actor differs from session actor")
    if operation["baseRevision"] != session["baseRevision"]:
        errors.append("operation base revision differs from session")
    if event.get("operationRef") != operation["operationId"]:
        errors.append("event operationRef does not resolve")
    if event["idempotencyKey"] != operation["idempotencyKey"]:
        errors.append("event and operation idempotency keys differ")
    if event["baseRevision"] != operation["baseRevision"]:
        errors.append("event and operation base revisions differ")
    if event["resultingRevision"] != event["baseRevision"] + 1:
        errors.append("accepted operation must advance revision exactly once")
    if operation.get("resultingRevision") != event["resultingRevision"]:
        errors.append("accepted operation and event resulting revisions differ")
    if snapshot["lastEventRef"] != event["eventId"]:
        errors.append("snapshot lastEventRef does not resolve")
    if snapshot["revision"] != event["resultingRevision"]:
        errors.append("snapshot revision differs from stream revision")
    if snapshot["state"]["assetDraftId"] != asset_id or snapshot["state"]["revision"] != snapshot["revision"]:
        errors.append("snapshot state identity or revision mismatch")

    digest = hashlib.sha256(canonical_bytes(snapshot["state"])).hexdigest()
    if digest != snapshot["stateDigest"]["value"]:
        errors.append(f"snapshot state digest mismatch: calculated {digest}")
    if session["presencePolicy"]["authorshipEffect"] != "none" or session["presencePolicy"].get("retainCursorData"):
        errors.append("presence policy must remain ephemeral and non-authorial")

    linked = {
        "asset": load_json(ROOT / "examples" / "asset-lab" / "asset-draft.material.sample.json")["assetDraftId"],
        "actor": load_json(ROOT / "examples" / "records" / "creator-passport.sample.json")["creatorId"],
        "warden": load_json(ROOT / "examples" / "warden" / "policy-decision.sample.json")["decisionId"],
    }
    if linked["asset"] != asset_id:
        errors.append("Asset Draft reference does not resolve")
    if linked["actor"] != session["actorId"]:
        errors.append("Creator reference does not resolve")
    if linked["warden"] != session.get("wardenDecisionRef"):
        errors.append("Warden decision reference does not resolve")
    if errors:
        raise ValueError("\n".join(errors))


def resolve_parameter(spec: dict[str, Any], parameter: dict[str, Any]) -> dict[str, Any]:
    ref = parameter.get("$ref")
    if not ref:
        return parameter
    prefix = "#/components/parameters/"
    if not ref.startswith(prefix):
        raise ValueError(f"unsupported parameter reference: {ref}")
    try:
        return spec["components"]["parameters"][ref[len(prefix):]]
    except KeyError as exc:
        raise ValueError(f"unresolved parameter reference: {ref}") from exc


def validate_openapi() -> None:
    spec = load_json(OPENAPI_PATH)
    if spec.get("openapi") != "3.1.0":
        raise ValueError("OpenAPI document must use 3.1.0")
    paths = spec.get("paths")
    if not isinstance(paths, dict):
        raise ValueError("OpenAPI paths must be an object")
    missing = REQUIRED_PATHS - set(paths)
    if missing:
        raise ValueError(f"missing OpenAPI paths: {', '.join(sorted(missing))}")

    operation_ids: set[str] = set()
    for path_name, path_item in paths.items():
        inherited = path_item.get("parameters", [])
        for method in ("get", "post", "put", "patch", "delete"):
            operation = path_item.get(method)
            if not operation:
                continue
            operation_id = operation.get("operationId")
            if not operation_id or operation_id in operation_ids:
                raise ValueError(f"missing or duplicate operationId at {method.upper()} {path_name}")
            operation_ids.add(operation_id)
            parameters = [resolve_parameter(spec, item) for item in inherited + operation.get("parameters", [])]
            names = {(item.get("name"), item.get("in")) for item in parameters}
            if "{assetDraftId}" in path_name and ("assetDraftId", "path") not in names:
                raise ValueError(f"missing assetDraftId path parameter at {path_name}")
            if method in {"post", "put", "patch", "delete"} and ("Idempotency-Key", "header") not in names:
                raise ValueError(f"missing Idempotency-Key at {method.upper()} {path_name}")
            if path_name.endswith(("/operations", "/release-requests")) and method == "post":
                if ("If-Match", "header") not in names:
                    raise ValueError(f"missing If-Match at {method.upper()} {path_name}")
            if path_name.endswith("/operations") and method == "post":
                responses = operation.get("responses", {})
                if "409" not in responses or "412" not in responses:
                    raise ValueError("operation endpoint must expose 409 and 412")

    refs: list[str] = []
    def collect(value: Any) -> None:
        if isinstance(value, dict):
            for key, item in value.items():
                if key == "$ref" and isinstance(item, str) and not item.startswith("#"):
                    refs.append(item)
                else:
                    collect(item)
        elif isinstance(value, list):
            for item in value:
                collect(item)
    collect(spec)
    for ref in refs:
        target = (OPENAPI_PATH.parent / ref).resolve()
        if not target.is_relative_to(ROOT) or not target.is_file():
            raise ValueError(f"OpenAPI external reference does not resolve: {ref}")


def main() -> int:
    try:
        examples = validate_schemas_and_fixtures()
        validate_persistence(examples)
        validate_openapi()
    except ValueError as exc:
        print(f"Synnergyze validation failed:\n{exc}", file=sys.stderr)
        return 1
    print("Validated 4 Synnergyze schemas, 4 linked API fixtures and the OpenAPI 3.1 contract.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
