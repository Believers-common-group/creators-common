#!/usr/bin/env python3
"""Validate Creators Common schemas, examples, digests and governed references."""

from __future__ import annotations

import hashlib
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_DIR = ROOT / "schemas"
EXAMPLE_DIR = ROOT / "examples"

SCHEMA_FILES = {
    "creator": SCHEMA_DIR / "creator-passport.schema.json",
    "creation": SCHEMA_DIR / "creation-passport.schema.json",
    "contribution": SCHEMA_DIR / "contribution-record.schema.json",
    "licence": SCHEMA_DIR / "licence-record.schema.json",
    "envelope": SCHEMA_DIR / "record-envelope.schema.json",
    "evidence_event": SCHEMA_DIR / "riveros-evidence-event.schema.json",
    "retention_policy": SCHEMA_DIR / "riveros-retention-policy.schema.json",
    "asset_draft": SCHEMA_DIR / "asset-draft.schema.json",
    "asset_component": SCHEMA_DIR / "asset-component.schema.json",
    "material_specification": SCHEMA_DIR / "material-specification.schema.json",
    "process_recipe": SCHEMA_DIR / "process-recipe.schema.json",
    "asset_variant": SCHEMA_DIR / "asset-variant.schema.json",
    "validation_run": SCHEMA_DIR / "validation-run.schema.json",
    "creation_claim": SCHEMA_DIR / "creation-claim.schema.json",
    "release_gate": SCHEMA_DIR / "release-gate.schema.json",
    "warden_access_policy": SCHEMA_DIR / "warden-access-policy.schema.json",
    "warden_policy_decision": SCHEMA_DIR / "warden-policy-decision.schema.json",
    "empireos_licence_event": SCHEMA_DIR / "empireos-licence-event.schema.json",
}

RECORD_TYPE_TO_KIND = {
    "creator": "creator",
    "creation": "creation",
    "contribution": "contribution",
    "licence": "licence",
    "record-envelope": "envelope",
    "riveros-evidence-event": "evidence_event",
    "riveros-retention-policy": "retention_policy",
    "asset-draft": "asset_draft",
    "asset-component": "asset_component",
    "material-specification": "material_specification",
    "process-recipe": "process_recipe",
    "asset-variant": "asset_variant",
    "validation-run": "validation_run",
    "creation-claim": "creation_claim",
    "release-gate": "release_gate",
    "warden-access-policy": "warden_access_policy",
    "warden-policy-decision": "warden_policy_decision",
    "empireos-licence-event": "empireos_licence_event",
}


class DuplicateKeyError(ValueError):
    """Raised when a JSON object repeats a key."""


def _reject_duplicate_keys(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    value: dict[str, Any] = {}
    for key, item in pairs:
        if key in value:
            raise DuplicateKeyError(f"duplicate JSON object key: {key}")
        value[key] = item
    return value


def _reject_nonstandard_constant(value: str) -> None:
    raise ValueError(f"non-standard JSON numeric constant: {value}")


def load_json(path: Path) -> dict[str, Any]:
    try:
        with path.open("r", encoding="utf-8") as handle:
            value = json.load(
                handle,
                object_pairs_hook=_reject_duplicate_keys,
                parse_constant=_reject_nonstandard_constant,
            )
    except (OSError, json.JSONDecodeError, DuplicateKeyError, ValueError) as exc:
        try:
            display_path = path.relative_to(ROOT)
        except ValueError:
            display_path = path
        raise ValueError(f"{display_path}: {exc}") from exc

    if not isinstance(value, dict):
        raise ValueError(f"{path.relative_to(ROOT)}: root value must be a JSON object")
    return value


def canonical_bytes(value: Any, path: str = "<root>") -> bytes:
    """Return CC-CJSON-0.1 deterministic bytes."""

    if isinstance(value, float):
        raise ValueError(
            f"{path}: CC-CJSON-0.1 rejects floating-point numbers; "
            "use an integer or normalized decimal string"
        )
    if isinstance(value, dict):
        for key, item in value.items():
            canonical_bytes(item, f"{path}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            canonical_bytes(item, f"{path}[{index}]")

    try:
        encoded = json.dumps(
            value,
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
            allow_nan=False,
        )
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{path}: cannot canonicalize JSON value: {exc}") from exc
    return encoded.encode("utf-8")


def record_kind(record: dict[str, Any]) -> str:
    if "envelopeId" in record:
        return "envelope"
    if "decisionId" in record:
        return "warden_policy_decision"
    if "accessPolicyId" in record:
        return "warden_access_policy"
    if "licenceEventId" in record:
        return "empireos_licence_event"
    if "eventId" in record:
        return "evidence_event"
    if "policyId" in record:
        return "retention_policy"
    if "assetComponentId" in record:
        return "asset_component"
    if "materialSpecificationId" in record:
        return "material_specification"
    if "processRecipeId" in record:
        return "process_recipe"
    if "assetVariantId" in record:
        return "asset_variant"
    if "validationRunId" in record:
        return "validation_run"
    if "creationClaimId" in record:
        return "creation_claim"
    if "releaseGateId" in record:
        return "release_gate"
    if "assetDraftId" in record:
        return "asset_draft"
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
        "envelope": "envelopeId",
        "evidence_event": "eventId",
        "retention_policy": "policyId",
        "asset_draft": "assetDraftId",
        "asset_component": "assetComponentId",
        "material_specification": "materialSpecificationId",
        "process_recipe": "processRecipeId",
        "asset_variant": "assetVariantId",
        "validation_run": "validationRunId",
        "creation_claim": "creationClaimId",
        "release_gate": "releaseGateId",
        "warden_access_policy": "accessPolicyId",
        "warden_policy_decision": "decisionId",
        "empireos_licence_event": "licenceEventId",
    }[kind]
    value = record.get(key)
    if not isinstance(value, str):
        raise ValueError(f"{key} must be a string")
    return value


def resolve_local_ref(ref: str, source: str) -> Path:
    target = (ROOT / ref).resolve()
    if not target.is_relative_to(ROOT):
        raise ValueError(f"{source}: local reference escapes repository root: {ref}")
    if not target.is_file():
        raise ValueError(f"{source}: referenced local file does not exist: {ref}")
    return target


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


def validate_examples(
    schemas: dict[str, dict[str, Any]],
) -> list[tuple[Path, str, dict[str, Any]]]:
    if not EXAMPLE_DIR.exists():
        raise ValueError(f"missing example directory: {EXAMPLE_DIR.relative_to(ROOT)}")

    example_paths = sorted(EXAMPLE_DIR.rglob("*.json"))
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


def check_digest(
    *,
    target: Path,
    expected_algorithm: str,
    expected_value: str,
    source: str,
) -> None:
    if expected_algorithm != "sha-256":
        return
    target_record = load_json(target)
    actual = hashlib.sha256(canonical_bytes(target_record)).hexdigest()
    if actual != expected_value:
        raise ValueError(
            f"{source}: digest mismatch for {target.relative_to(ROOT)}; "
            f"expected {expected_value}, calculated {actual}"
        )


def check_local_cross_references(
    records: list[tuple[Path, str, dict[str, Any]]],
) -> None:
    by_kind: dict[str, set[str]] = {kind: set() for kind in SCHEMA_FILES}
    records_by_id: dict[str, tuple[str, dict[str, Any]]] = {}
    all_governed_ids: set[str] = set()

    for _, kind, record in records:
        record_id = governed_id(kind, record)
        by_kind[kind].add(record_id)
        all_governed_ids.add(record_id)
        records_by_id[record_id] = (kind, record)

    errors: list[str] = []

    def require_local(ref: str, expected_kind: str, source: str) -> None:
        if ref.startswith("CC-") and ref not in by_kind[expected_kind]:
            errors.append(f"{source}: unresolved local {expected_kind} reference {ref}")

    def require_any_governed(ref: str, source: str) -> None:
        if ref.startswith("CC-") and ref not in all_governed_ids:
            errors.append(f"{source}: unresolved governed reference {ref}")

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
                if creator.get("contributionRef"):
                    require_local(creator["contributionRef"], "contribution", source)
            for ref in record.get("contributionRefs", []):
                require_local(ref, "contribution", source)
            for ref in record.get("licenceRefs", []):
                require_local(ref, "licence", source)

        elif kind == "contribution":
            require_local(record["creationId"], "creation", source)
            require_local(record["contributorId"], "creator", source)

        elif kind == "licence":
            require_local(record["creationId"], "creation", source)

        elif kind == "asset_draft":
            require_local(record["ownerCreatorId"], "creator", source)
            for ref in record.get("collaboratorRefs", []):
                require_local(ref, "creator", source)
            for ref in record.get("componentRefs", []):
                require_local(ref, "asset_component", source)
            for ref in record.get("materialSpecificationRefs", []):
                require_local(ref, "material_specification", source)
            for ref in record.get("processRecipeRefs", []):
                require_local(ref, "process_recipe", source)
            for ref in record.get("variantRefs", []):
                require_local(ref, "asset_variant", source)
            for ref in record.get("validationRunRefs", []):
                require_local(ref, "validation_run", source)
            for ref in record.get("claimRefs", []):
                require_local(ref, "creation_claim", source)
            for ref in record.get("releaseGateRefs", []):
                require_local(ref, "release_gate", source)
            if record.get("creationPassportRef"):
                require_local(record["creationPassportRef"], "creation", source)

        elif kind == "asset_component":
            require_local(record["assetDraftId"], "asset_draft", source)
            if record.get("parentComponentRef"):
                require_local(record["parentComponentRef"], "asset_component", source)
            for ref in record.get("childComponentRefs", []):
                require_local(ref, "asset_component", source)
            for ref in record.get("materialSpecificationRefs", []):
                require_local(ref, "material_specification", source)
            for ref in record.get("processRecipeRefs", []):
                require_local(ref, "process_recipe", source)

        elif kind == "material_specification":
            if record.get("assetDraftId"):
                require_local(record["assetDraftId"], "asset_draft", source)

        elif kind == "process_recipe":
            require_local(record["assetDraftId"], "asset_draft", source)
            for ref in record.get("inputRefs", []):
                require_any_governed(ref, source)
            for ref in record.get("outputRefs", []):
                require_any_governed(ref, source)

        elif kind == "asset_variant":
            require_local(record["assetDraftId"], "asset_draft", source)
            if record.get("baseVariantRef"):
                require_local(record["baseVariantRef"], "asset_variant", source)
            for ref in record.get("componentRefs", []):
                require_local(ref, "asset_component", source)
            for ref in record.get("materialSpecificationRefs", []):
                require_local(ref, "material_specification", source)
            for ref in record.get("processRecipeRefs", []):
                require_local(ref, "process_recipe", source)
            for ref in record.get("validationRunRefs", []):
                require_local(ref, "validation_run", source)
            for ref in record.get("claimRefs", []):
                require_local(ref, "creation_claim", source)

        elif kind == "validation_run":
            require_local(record["assetDraftId"], "asset_draft", source)
            if record.get("assetVariantRef"):
                require_local(record["assetVariantRef"], "asset_variant", source)
            for ref in record.get("subjectRefs", []):
                require_any_governed(ref, source)
            for ref in record.get("executedBy", {}).get("operatorIds", []):
                require_local(ref, "creator", source)

        elif kind == "creation_claim":
            require_local(record["assetDraftId"], "asset_draft", source)
            require_local(record["ownerCreatorId"], "creator", source)
            for ref in record.get("subjectRefs", []):
                require_any_governed(ref, source)
            for ref in record.get("supportingValidationRefs", []):
                require_local(ref, "validation_run", source)

        elif kind == "release_gate":
            require_local(record["assetDraftId"], "asset_draft", source)
            if record.get("creationPassportRef"):
                require_local(record["creationPassportRef"], "creation", source)
            for check in record["checks"]:
                for ref in check.get("requiredRecordRefs", []):
                    require_any_governed(ref, source)
            for ref in record.get("requiredLicenceRefs", []):
                require_local(ref, "licence", source)
            if record.get("signedEnvelopeRef"):
                require_local(record["signedEnvelopeRef"], "envelope", source)
            if record.get("wardenDecisionRef"):
                require_local(record["wardenDecisionRef"], "warden_policy_decision", source)

        elif kind == "warden_access_policy":
            for ref in record.get("scope", {}).get("recordRefs", []):
                require_any_governed(ref, source)
            for ref in record.get("review", {}).get("reviewerRefs", []):
                require_any_governed(ref, source)
            for rule in record["rules"]:
                for ref in rule.get("subjectConditions", {}).get("subjectRefs", []):
                    require_any_governed(ref, source)
                for ref in rule.get("subjectConditions", {}).get("affiliationRefs", []):
                    require_any_governed(ref, source)
                for ref in rule.get("resourceConditions", {}).get("recordRefs", []):
                    require_any_governed(ref, source)
                for obligation in rule.get("obligations", []):
                    for ref in obligation.get("approvalRefs", []):
                        require_any_governed(ref, source)
                    destination = obligation.get("destinationRef")
                    if isinstance(destination, str) and destination.startswith("CC-"):
                        require_any_governed(destination, source)

        elif kind == "warden_policy_decision":
            require_local(record["policyRef"], "warden_access_policy", source)
            require_any_governed(record["subject"]["actorId"], source)
            for ref in record["subject"].get("affiliationRefs", []):
                require_any_governed(ref, source)
            require_any_governed(record["resource"]["recordRef"], source)
            if record.get("relatedEvidenceEventRef"):
                require_local(record["relatedEvidenceEventRef"], "evidence_event", source)
            if record.get("releaseGateRef"):
                require_local(record["releaseGateRef"], "release_gate", source)
            if record.get("licenceRef"):
                require_local(record["licenceRef"], "licence", source)
            for obligation in record["obligations"]:
                for ref in obligation.get("approvalRefs", []):
                    require_any_governed(ref, source)
                destination = obligation.get("destinationRef")
                if isinstance(destination, str) and destination.startswith("CC-"):
                    require_any_governed(destination, source)

            policy_entry = records_by_id.get(record["policyRef"])
            if policy_entry:
                _, policy = policy_entry
                rule_ids = {rule["ruleId"] for rule in policy["rules"]}
                missing_rules = set(record["matchedRuleRefs"]) - rule_ids
                if missing_rules:
                    errors.append(
                        f"{source}: matched Warden rule(s) not present in policy "
                        f"{record['policyRef']}: {', '.join(sorted(missing_rules))}"
                    )

        elif kind == "empireos_licence_event":
            require_local(record["licenceId"], "licence", source)
            for ref in record.get("requestedByRefs", []):
                require_any_governed(ref, source)
            for ref in record.get("approvedByRefs", []):
                require_any_governed(ref, source)
            for ref in record.get("decisionBasisRefs", []):
                require_any_governed(ref, source)
            if record.get("wardenDecisionRef"):
                require_local(record["wardenDecisionRef"], "warden_policy_decision", source)
            if record.get("riverosEvidenceEventRef"):
                require_local(record["riverosEvidenceEventRef"], "evidence_event", source)

            previous_ref = record.get("previousEventRef")
            if previous_ref:
                require_local(previous_ref, "empireos_licence_event", source)
                previous_entry = records_by_id.get(previous_ref)
                if previous_entry:
                    previous_kind, previous = previous_entry
                    if previous_kind != "empireos_licence_event":
                        errors.append(f"{source}: previous event is not an EmpireOS licence event")
                    else:
                        if previous["licenceId"] != record["licenceId"]:
                            errors.append(f"{source}: previous event belongs to another licence")
                        if previous["sequence"] + 1 != record["sequence"]:
                            errors.append(
                                f"{source}: sequence {record['sequence']} does not follow "
                                f"{previous_ref} sequence {previous['sequence']}"
                            )
            elif record["sequence"] != 1 or record["eventType"] != "issue":
                errors.append(f"{source}: only issuance sequence 1 may omit previousEventRef")

        elif kind == "envelope":
            subject = record["subject"]
            subject_kind = RECORD_TYPE_TO_KIND[subject["recordType"]]
            require_local(subject["recordId"], subject_kind, source)
            payload = record["payload"]
            try:
                target = resolve_local_ref(payload["ref"], source)
                target_record = load_json(target)
                target_kind = record_kind(target_record)
                target_id = governed_id(target_kind, target_record)
                if target_kind != subject_kind or target_id != subject["recordId"]:
                    errors.append(
                        f"{source}: envelope subject does not match payload target "
                        f"{target_kind}:{target_id}"
                    )
                check_digest(
                    target=target,
                    expected_algorithm=payload["digest"]["algorithm"],
                    expected_value=payload["digest"]["value"],
                    source=source,
                )
            except ValueError as exc:
                errors.append(str(exc))

            for signature in record["signatures"]:
                if (
                    signature["algorithm"] == "synthetic-test"
                    and signature["verificationStatus"] == "verified"
                ):
                    errors.append(
                        f"{source}: synthetic-test signature must not be marked verified"
                    )
            if record["status"] == "issued" and not any(
                signature["verificationStatus"] == "verified"
                for signature in record["signatures"]
            ):
                errors.append(
                    f"{source}: issued envelope requires at least one verified signature"
                )

        elif kind == "evidence_event":
            for subject in record["subjects"]:
                expected_kind = RECORD_TYPE_TO_KIND[subject["recordType"]]
                require_local(subject["recordId"], expected_kind, source)
            require_local(record["retentionPolicyRef"], "retention_policy", source)
            if record.get("envelopeRef"):
                require_local(record["envelopeRef"], "envelope", source)
            previous_event_ref = record.get("chain", {}).get("previousEventRef")
            if previous_event_ref:
                require_local(previous_event_ref, "evidence_event", source)

            for artifact in record["evidence"]["artifacts"]:
                if (
                    artifact.get("digestAlgorithm") == "sha-256"
                    and artifact.get("digestValue")
                    and not artifact["ref"].startswith(("http://", "https://"))
                ):
                    try:
                        target = resolve_local_ref(artifact["ref"], source)
                        check_digest(
                            target=target,
                            expected_algorithm=artifact["digestAlgorithm"],
                            expected_value=artifact["digestValue"],
                            source=source,
                        )
                    except ValueError as exc:
                        errors.append(str(exc))

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
