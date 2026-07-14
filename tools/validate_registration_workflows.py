#!/usr/bin/env python3
"""Validate Creators Common Creator and Creation registration workflows."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_DIR = ROOT / "schemas"
EXAMPLE_DIR = ROOT / "api" / "examples" / "registration"
OPENAPI_PATH = ROOT / "api" / "openapi" / "creators-common-registration-api-v0.1.json"

SCHEMA_PATHS = {
    "creator_application": SCHEMA_DIR / "creator-registration-application.schema.json",
    "creation_application": SCHEMA_DIR / "creation-registration-application.schema.json",
    "review": SCHEMA_DIR / "registration-review.schema.json",
    "event": SCHEMA_DIR / "registration-event.schema.json",
    "creator_passport": SCHEMA_DIR / "creator-passport.schema.json",
    "creation_passport": SCHEMA_DIR / "creation-passport.schema.json",
}

REQUIRED_API_PATHS = {
    "/registrations/creators",
    "/registrations/creators/{applicationId}",
    "/registrations/creations",
    "/registrations/creations/{applicationId}",
    "/registrations/{applicationId}/evidence",
    "/registrations/{applicationId}/reviews",
    "/registrations/{applicationId}/events",
    "/registrations/{applicationId}/issue",
}

SENSITIVE_PUBLIC_FIELDS = {
    "contactRefs",
    "evidenceRefs",
    "ownershipClaimBasis",
    "reviewerNotes",
    "wardenDecision",
    "sensitiveAddress",
    "financials",
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


def validate_instance(
    instance: dict[str, Any],
    schema: dict[str, Any],
    source: str,
) -> None:
    errors = sorted(
        Draft202012Validator(schema, format_checker=FormatChecker()).iter_errors(instance),
        key=lambda error: list(error.absolute_path),
    )
    if not errors:
        return
    messages: list[str] = []
    for error in errors:
        location = ".".join(str(part) for part in error.absolute_path) or "<root>"
        messages.append(f"{source}:{location}: {error.message}")
    raise ValueError("\n".join(messages))


def load_and_validate() -> tuple[
    dict[str, dict[str, Any]],
    dict[str, Any],
]:
    schemas: dict[str, dict[str, Any]] = {}
    for kind, path in SCHEMA_PATHS.items():
        schema = load_json(path)
        Draft202012Validator.check_schema(schema)
        schemas[kind] = schema

    creator_application = load_json(EXAMPLE_DIR / "creator-registration-application.sample.json")
    creation_application = load_json(EXAMPLE_DIR / "creation-registration-application.sample.json")
    resulting_creation = load_json(EXAMPLE_DIR / "creation-passport.material-demo.sample.json")
    reviews_container = load_json(EXAMPLE_DIR / "registration-reviews.sample.json")
    creator_events_container = load_json(EXAMPLE_DIR / "creator-registration-events.sample.json")
    creation_events_container = load_json(EXAMPLE_DIR / "creation-registration-events.sample.json")

    validate_instance(
        creator_application,
        schemas["creator_application"],
        "creator-registration-application.sample.json",
    )
    validate_instance(
        creation_application,
        schemas["creation_application"],
        "creation-registration-application.sample.json",
    )
    validate_instance(
        resulting_creation,
        schemas["creation_passport"],
        "creation-passport.material-demo.sample.json",
    )

    reviews = reviews_container.get("reviews")
    if not isinstance(reviews, list) or not reviews:
        raise ValueError("registration-reviews.sample.json: reviews must be a non-empty array")
    for index, review in enumerate(reviews):
        if not isinstance(review, dict):
            raise ValueError(f"registration-reviews.sample.json: reviews[{index}] must be an object")
        validate_instance(review, schemas["review"], f"registration-reviews.sample.json:reviews[{index}]")

    creator_events = creator_events_container.get("events")
    creation_events = creation_events_container.get("events")
    for label, events in (
        ("creator-registration-events.sample.json", creator_events),
        ("creation-registration-events.sample.json", creation_events),
    ):
        if not isinstance(events, list) or not events:
            raise ValueError(f"{label}: events must be a non-empty array")
        for index, event in enumerate(events):
            if not isinstance(event, dict):
                raise ValueError(f"{label}: events[{index}] must be an object")
            validate_instance(event, schemas["event"], f"{label}:events[{index}]")

    existing_creator = load_json(ROOT / "examples" / "records" / "creator-passport.sample.json")
    validate_instance(existing_creator, schemas["creator_passport"], "examples/records/creator-passport.sample.json")
    existing_asset = load_json(ROOT / "examples" / "asset-lab" / "asset-draft.material.sample.json")

    return schemas, {
        "creator_application": creator_application,
        "creation_application": creation_application,
        "resulting_creation": resulting_creation,
        "reviews": reviews,
        "creator_events": creator_events,
        "creation_events": creation_events,
        "existing_creator": existing_creator,
        "existing_asset": existing_asset,
    }


def validate_consent(application: dict[str, Any], label: str) -> None:
    consent = application["consent"]
    required_true = (
        "termsAccepted",
        "identityProcessingConsent",
        "evidenceProcessingConsent",
    )
    for field in required_true:
        if consent.get(field) is not True:
            raise ValueError(f"{label}: {field} must be true for an accepted application")

    if application["requestedVisibility"] == "public" and consent.get("publicProfileConsent") is not True:
        raise ValueError(f"{label}: public visibility requires explicit public-profile consent")


def validate_creation_attestation(application: dict[str, Any]) -> None:
    attestation = application["attestation"]
    for field in ("accuracyAttested", "rightsDisclosureAttested", "evidenceUseConsent"):
        if attestation.get(field) is not True:
            raise ValueError(f"creation application: {field} must be true")
    if application["publicationRequest"] == "public" and attestation.get("publicProjectionConsent") is not True:
        raise ValueError("creation application: public projection requires explicit consent")
    if application["rightsDisclosure"].get("sponsorshipSeparatedFromAuthorship") is not True:
        raise ValueError("creation application: sponsorship must remain separate from authorship")


def validate_public_projection(record: dict[str, Any], label: str) -> None:
    projection = record.get("publicProjection", {})
    if not isinstance(projection, dict):
        raise ValueError(f"{label}: publicProjection must be an object")
    prohibited = SENSITIVE_PUBLIC_FIELDS.intersection(projection)
    if prohibited:
        raise ValueError(f"{label}: sensitive fields in public projection: {', '.join(sorted(prohibited))}")


def validate_review_links(data: dict[str, Any]) -> dict[str, dict[str, Any]]:
    creator_application = data["creator_application"]
    creation_application = data["creation_application"]
    applications = {
        creator_application["applicationId"]: ("creator", creator_application),
        creation_application["applicationId"]: ("creation", creation_application),
    }

    reviews_by_id: dict[str, dict[str, Any]] = {}
    for review in data["reviews"]:
        review_id = review["reviewId"]
        if review_id in reviews_by_id:
            raise ValueError(f"duplicate Registration Review identifier: {review_id}")
        reviews_by_id[review_id] = review

        application_entry = applications.get(review["applicationRef"])
        if application_entry is None:
            raise ValueError(f"review {review_id}: unresolved applicationRef")
        application_type, application = application_entry
        if review["applicationType"] != application_type:
            raise ValueError(f"review {review_id}: applicationType does not match application")
        if review["disposition"] in {"accepted", "rejected"}:
            if review["humanReviewed"] is not True:
                raise ValueError(f"review {review_id}: final disposition requires human review")
            if not review.get("wardenDecisionRef") or not review.get("riverosEvidenceEventRef"):
                raise ValueError(f"review {review_id}: final disposition requires Warden and RiverOS references")
        if review_id not in application.get("reviewRefs", []):
            raise ValueError(f"review {review_id}: application does not reference review")
        if review.get("wardenDecisionRef") != application.get("wardenDecisionRef"):
            raise ValueError(f"review {review_id}: Warden decision differs from application")

    return reviews_by_id


def validate_event_chain(
    events: list[dict[str, Any]],
    *,
    application: dict[str, Any],
    application_type: str,
    reviews_by_id: dict[str, dict[str, Any]],
) -> None:
    if not events:
        raise ValueError(f"{application_type} event chain is empty")

    expected_previous: str | None = None
    seen_ids: set[str] = set()
    passport_events = 0

    for expected_sequence, event in enumerate(events, start=1):
        event_id = event["eventId"]
        if event_id in seen_ids:
            raise ValueError(f"{application_type} event chain contains duplicate eventId {event_id}")
        seen_ids.add(event_id)

        if event["sequence"] != expected_sequence:
            raise ValueError(f"{application_type} event {event_id}: non-contiguous sequence")
        if event.get("previousEventRef") != expected_previous:
            raise ValueError(f"{application_type} event {event_id}: previousEventRef mismatch")
        if event["applicationRef"] != application["applicationId"]:
            raise ValueError(f"{application_type} event {event_id}: applicationRef mismatch")
        if event["applicationType"] != application_type:
            raise ValueError(f"{application_type} event {event_id}: applicationType mismatch")
        if event["status"] != "applied":
            raise ValueError(f"{application_type} event {event_id}: fixture events must be applied")
        if not event.get("riverosEvidenceEventRef"):
            raise ValueError(f"{application_type} event {event_id}: RiverOS evidence reference required")
        if event["publicProjectionEffect"] not in {"none", "prepare-eligible", "remove"}:
            raise ValueError(f"{application_type} event {event_id}: registration cannot directly publish to VSR")

        if event["eventType"] in {"accepted", "rejected", "passport-issued"}:
            review = reviews_by_id.get(event.get("reviewRef", ""))
            if review is None:
                raise ValueError(f"{application_type} event {event_id}: unresolved reviewRef")
            if review["disposition"] != "accepted" and event["eventType"] != "rejected":
                raise ValueError(f"{application_type} event {event_id}: issuance path requires accepted review")
            if event.get("wardenDecisionRef") != review.get("wardenDecisionRef"):
                raise ValueError(f"{application_type} event {event_id}: Warden decision differs from review")

        if event["eventType"] == "passport-issued":
            passport_events += 1
            expected_output = (
                application.get("resultingCreatorPassportRef")
                if application_type == "creator"
                else application.get("resultingCreationPassportRef")
            )
            if event.get("outputPassportRef") != expected_output:
                raise ValueError(f"{application_type} event {event_id}: output passport mismatch")
            if event["publicProjectionEffect"] != "prepare-eligible":
                raise ValueError(f"{application_type} event {event_id}: issuance only prepares eligibility")

        expected_previous = event_id

    if passport_events != 1:
        raise ValueError(f"{application_type} event chain must contain exactly one passport-issued event")


def validate_linked_records(data: dict[str, Any]) -> None:
    creator_application = data["creator_application"]
    creation_application = data["creation_application"]
    resulting_creation = data["resulting_creation"]
    existing_creator = data["existing_creator"]
    existing_asset = data["existing_asset"]

    validate_consent(creator_application, "creator application")
    validate_creation_attestation(creation_application)
    validate_public_projection(creator_application, "creator application")
    validate_public_projection(creation_application, "creation application")

    if creator_application["status"] != "accepted" or creation_application["status"] != "accepted":
        raise ValueError("registration fixtures must be accepted before issuance")
    if not creator_application.get("evidenceRefs") or not creation_application.get("evidenceRefs"):
        raise ValueError("accepted registration applications require evidence references")

    if creator_application.get("resultingCreatorPassportRef") != existing_creator["creatorId"]:
        raise ValueError("creator application does not resolve to the linked Creator Passport")
    if creation_application["applicantCreatorRef"] != existing_creator["creatorId"]:
        raise ValueError("creation applicant does not resolve to the linked Creator Passport")
    if creation_application.get("assetDraftRef") != existing_asset["assetDraftId"]:
        raise ValueError("creation application does not resolve to the linked Asset Draft")
    if creation_application.get("resultingCreationPassportRef") != resulting_creation["creationId"]:
        raise ValueError("creation application does not resolve to the issued Creation Passport")
    if resulting_creation["title"] != creation_application["proposedTitle"]:
        raise ValueError("issued Creation Passport title differs from accepted application")
    if resulting_creation["classification"] != creation_application["classification"]:
        raise ValueError("issued Creation Passport classification differs from accepted application")

    claimed_creators = {claim["creatorRef"] for claim in creation_application["creatorClaims"]}
    if creation_application["applicantCreatorRef"] not in claimed_creators:
        raise ValueError("creation applicant must be present in creatorClaims")
    issued_creators = {creator["creatorId"] for creator in resulting_creation["creators"]}
    if not claimed_creators.issubset(issued_creators):
        raise ValueError("issued Creation Passport omits an accepted creator claim")

    reviews_by_id = validate_review_links(data)
    validate_event_chain(
        data["creator_events"],
        application=creator_application,
        application_type="creator",
        reviews_by_id=reviews_by_id,
    )
    validate_event_chain(
        data["creation_events"],
        application=creation_application,
        application_type="creation",
        reviews_by_id=reviews_by_id,
    )


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
        raise ValueError("registration OpenAPI document must use 3.1.0")
    paths = spec.get("paths")
    if not isinstance(paths, dict):
        raise ValueError("registration OpenAPI paths must be an object")
    missing = REQUIRED_API_PATHS - set(paths)
    if missing:
        raise ValueError(f"registration OpenAPI missing paths: {', '.join(sorted(missing))}")

    operation_ids: set[str] = set()
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

            parameters = list(inherited_parameters) + list(operation.get("parameters", []))
            resolved = [dereference_parameter(spec, item) for item in parameters]
            names = {(item.get("name"), item.get("in")) for item in resolved}

            if "{applicationId}" in path_name and ("applicationId", "path") not in names:
                raise ValueError(f"OpenAPI {method.upper()} {path_name} lacks applicationId")
            if method in {"post", "put", "patch", "delete"} and ("Idempotency-Key", "header") not in names:
                raise ValueError(f"OpenAPI {method.upper()} {path_name} lacks Idempotency-Key")
            if path_name.endswith(("/reviews", "/issue")) and method == "post":
                if ("If-Match", "header") not in names:
                    raise ValueError(f"OpenAPI {method.upper()} {path_name} lacks If-Match")
                responses = operation.get("responses", {})
                if "409" not in responses or "412" not in responses:
                    raise ValueError(f"OpenAPI {method.upper()} {path_name} must define 409 and 412")

            if path_name.endswith("/issue") and method == "post":
                description = f"{operation.get('summary', '')} {operation.get('description', '')}".lower()
                if "virtual silk road" not in description or "does not" not in description:
                    raise ValueError("issue endpoint must state that it does not publish a VSR listing")

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
            raise ValueError(f"registration OpenAPI external reference does not resolve: {ref}")


def main() -> int:
    try:
        _, data = load_and_validate()
        validate_linked_records(data)
        validate_openapi()
    except ValueError as exc:
        print(f"Registration workflow validation failed:\n{exc}", file=sys.stderr)
        return 1

    print(
        "Validated 4 registration schemas, 2 accepted applications, 2 human reviews, "
        "6 append-only events, 2 linked passports and the OpenAPI 3.1 contract."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
