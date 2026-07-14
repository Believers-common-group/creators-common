# Creators Common Registry Schemas

**Schema release:** CC-SCHEMAS-V0.2  
**Status:** Draft controlled contracts for implementation and review  
**JSON Schema dialect:** Draft 2020-12

This directory converts the Creators Common Canon into machine-readable registry, integrity and evidence contracts.

## Schemas

| Schema | Registry object | Purpose |
|---|---|---|
| [`creator-passport.schema.json`](creator-passport.schema.json) | Creator Passport | Portable identity, capabilities, affiliations, verified roles and creation portfolio |
| [`creation-passport.schema.json`](creation-passport.schema.json) | Creation Passport | Controlled identity, maturity, evidence, ownership, custodianship, restrictions and lineage of a creation |
| [`contribution-record.schema.json`](contribution-record.schema.json) | Contribution Record | Precise contributor action, evidence, review, attribution and agreed rights |
| [`licence-record.schema.json`](licence-record.schema.json) | Licence Record | Permitted parties, actions, territory, field of use, obligations, economic terms and suspension controls |
| [`record-envelope.schema.json`](record-envelope.schema.json) | Signed Record Envelope | Binds a record version to deterministic bytes, a SHA-256 digest and signature assertions |
| [`riveros-evidence-event.schema.json`](riveros-evidence-event.schema.json) | RiverOS Evidence Event | Records actors, governed subjects, evidence artefacts, policy decisions, timestamps and event-chain references |
| [`riveros-retention-policy.schema.json`](riveros-retention-policy.schema.json) | RiverOS Retention Policy | Defines evidence categories, retention triggers, review periods, legal holds and disposition |

## Identifier families

- Creator Passport: `CC-CR-...`
- Creation Passport: `CC-CP-...`
- Contribution Record: `CC-CO-...`
- Licence Record: `CC-LR-...`
- Signed Record Envelope: `CC-EN-...`
- RiverOS Evidence Event: `CC-RV-EV-...`
- RiverOS Retention Policy: `CC-RV-RP-...`

Identifiers are permanent. A correction or substantive update creates a new controlled version; it does not silently overwrite historical evidence.

## Integrity profile

Signed-envelope examples use `CC-CJSON-0.1`, a restricted deterministic JSON profile:

- duplicate object keys are rejected;
- non-standard constants are rejected;
- floating-point values are rejected for digest-bound payloads;
- object keys are recursively sorted;
- array order is preserved;
- JSON is serialized as UTF-8 without insignificant whitespace;
- SHA-256 is calculated over the canonical bytes.

See [`CC-SIGNED-ENVELOPES-V0.1`](../docs/architecture/CC-SIGNED-ENVELOPES-V0.1.md).

## Design rules

1. Schema validation confirms structural conformance, not truth, ownership or regulatory approval.
2. Sensitive evidence may be represented by controlled references rather than embedded source material.
3. `additionalProperties` is disabled at the record boundary to prevent accidental, ungoverned fields.
4. Records carry issuer, provenance and timestamps so that registry actions can be audited.
5. Cross-record relationships use permanent identifiers and resolvable references.
6. Lifecycle stage, verification, validation and licensing remain separate concepts.
7. A licence does not substitute for legally required certification, accreditation, registration or authorisation.
8. A digest detects change but does not prove truth or lawful authority.
9. A signature assertion is not trusted until verified against an approved key and Warden policy.
10. Retention and deletion rules require jurisdiction-specific legal and data-protection review before activation.

## Automated validation

`tools/validate_registry.py` checks:

- all seven schemas against JSON Schema Draft 2020-12;
- unique schema `$id` values;
- all JSON fixtures under `examples/`;
- duplicate governed identifiers;
- local record cross-references;
- envelope subject-to-payload consistency;
- CC-CJSON-0.1 SHA-256 digests;
- local evidence artefact digests;
- prohibition on verified synthetic signatures;
- the requirement that an issued envelope has a verified signature.

## Implementation sequence

### Implemented

1. Core Creator, Creation, Contribution and Licence schemas.
2. Synthetic linked records and automated schema validation.
3. Signed record envelope and deterministic digest profile.
4. RiverOS evidence-event and retention-policy contracts.

### Next

5. Add trusted key, signer authority and signature verification contracts.
6. Define Warden policy decisions and restricted-field access.
7. Define EmpireOS licence issuance and lifecycle events.
8. Add positive and negative conformance vectors.
9. Add Synnergyze APIs and Virtual Silk Road discovery projections.

These schemas are an architecture baseline and are not legal advice, an intellectual-property registration, a regulated-product authorisation or a guarantee of scientific validity.
