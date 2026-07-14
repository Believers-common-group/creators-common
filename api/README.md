# Creators Common API contracts

## Synnergyze Asset Draft API V0.1

The first API contract is the governed collaboration and persistence layer behind Creators Common Asset Lab.

- OpenAPI 3.1 contract: [`openapi/synnergyze-asset-draft-api-v0.1.json`](openapi/synnergyze-asset-draft-api-v0.1.json)
- Linked conformance fixtures: [`examples/synnergyze/`](examples/synnergyze/)
- Architecture and operating rules: [`../docs/integrations/synnergyze/CC-SYNNERGYZE-ASSET-DRAFT-API-V0.1.md`](../docs/integrations/synnergyze/CC-SYNNERGYZE-ASSET-DRAFT-API-V0.1.md)
- Validator: [`../tools/validate_synnergyze_asset_api.py`](../tools/validate_synnergyze_asset_api.py)

The API covers:

- Asset Draft creation and retrieval;
- bounded collaboration sessions;
- idempotent operations;
- optimistic concurrency with `If-Match` revision ETags;
- append-only event streams;
- deterministic snapshots; and
- controlled release requests.

A release request does not itself advance lifecycle stage, issue a Creation Passport or grant a licence. Warden, RiverOS, Release Gate, signed-envelope and EmpireOS controls remain separate governed stages.
