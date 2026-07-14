# Creators Common API contracts

## Synnergyze Asset Draft API V0.1

The governed collaboration and persistence layer behind Creators Common Asset Lab.

- OpenAPI 3.1 contract: [`openapi/synnergyze-asset-draft-api-v0.1.json`](openapi/synnergyze-asset-draft-api-v0.1.json)
- Linked conformance fixtures: [`examples/synnergyze/`](examples/synnergyze/)
- Architecture and operating rules: [`../docs/integrations/synnergyze/CC-SYNNERGYZE-ASSET-DRAFT-API-V0.1.md`](../docs/integrations/synnergyze/CC-SYNNERGYZE-ASSET-DRAFT-API-V0.1.md)
- Validator: [`../tools/validate_synnergyze_asset_api.py`](../tools/validate_synnergyze_asset_api.py)

The API covers Asset Draft creation and retrieval, bounded collaboration sessions, idempotent operations, optimistic concurrency, append-only events, deterministic snapshots and controlled release requests.

A release request does not itself advance lifecycle stage, issue a Creation Passport or grant a licence.

## Creator and Creation Registration API V0.1

The controlled intake, review, evidence and passport-issuance layer for Creator and Creation registration.

- OpenAPI 3.1 contract: [`openapi/creators-common-registration-api-v0.1.json`](openapi/creators-common-registration-api-v0.1.json)
- Linked conformance fixtures: [`examples/registration/`](examples/registration/)
- Workflow architecture: [`../docs/workflows/CC-CREATOR-AND-CREATION-REGISTRATION-V0.1.md`](../docs/workflows/CC-CREATOR-AND-CREATION-REGISTRATION-V0.1.md)
- Validator: [`../tools/validate_registration_workflows.py`](../tools/validate_registration_workflows.py)

The API covers:

- DigitalMe-referenced Creator registration;
- Creation registration from an Asset Draft or external creation definition;
- explicit consent and public-projection controls;
- evidence attachment routed to RiverOS;
- human registration reviews;
- Warden-gated acceptance and rejection;
- append-only registration events; and
- controlled Creator or Creation Passport issuance.

Registration can prepare a passport for a later member or public projection. It does not create a Virtual Silk Road listing. VSR publication remains a separate governed workflow requiring current passport status, evidence, Warden approval and visibility consent.
