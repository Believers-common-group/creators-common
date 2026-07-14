# Creators Common Registry Schemas

**Core schema release:** CC-SCHEMAS-V0.2  
**Asset Lab schema release:** CC-ASSET-LAB-SCHEMAS-V0.1  
**Status:** Draft controlled contracts for implementation and review  
**JSON Schema dialect:** Draft 2020-12

This directory converts the Creators Common Canon and Asset Lab product baseline into machine-readable registry, integrity, evidence and authoring contracts.

## Core registry, integrity and evidence schemas

| Schema | Registry object | Purpose |
|---|---|---|
| [`creator-passport.schema.json`](creator-passport.schema.json) | Creator Passport | Portable identity, capabilities, affiliations, verified roles and creation portfolio |
| [`creation-passport.schema.json`](creation-passport.schema.json) | Creation Passport | Controlled identity, maturity, evidence, ownership, custodianship, restrictions and lineage |
| [`contribution-record.schema.json`](contribution-record.schema.json) | Contribution Record | Contributor action, evidence, review, attribution and agreed rights |
| [`licence-record.schema.json`](licence-record.schema.json) | Licence Record | Parties, actions, territory, field of use, obligations, economics and suspension controls |
| [`record-envelope.schema.json`](record-envelope.schema.json) | Signed Record Envelope | Deterministic payload digest and signature assertions |
| [`riveros-evidence-event.schema.json`](riveros-evidence-event.schema.json) | RiverOS Evidence Event | Actors, subjects, evidence artefacts, policy decisions, timestamps and event chain |
| [`riveros-retention-policy.schema.json`](riveros-retention-policy.schema.json) | RiverOS Retention Policy | Retention triggers, review, legal hold and disposition |

## Asset Lab authoring schemas

| Schema | Registry object | Purpose |
|---|---|---|
| [`asset-draft.schema.json`](asset-draft.schema.json) | Asset Draft | Editable governed workspace before Creation Passport conversion |
| [`asset-component.schema.json`](asset-component.schema.json) | Asset Component | Part, assembly, panel, layer, ingredient group or logical module |
| [`material-specification.schema.json`](material-specification.schema.json) | Material Specification | Composition, properties, circularity, hazards, standards and sourcing |
| [`process-recipe.schema.json`](process-recipe.schema.json) | Process Recipe | Ordered production, laboratory, assembly or computational process |
| [`asset-variant.schema.json`](asset-variant.schema.json) | Asset Variant | Controlled experimental or design alternative and explicit change set |
| [`validation-run.schema.json`](validation-run.schema.json) | Validation Run | Method, execution, measurements, acceptance criteria and disposition |
| [`creation-claim.schema.json`](creation-claim.schema.json) | Creation Claim | Bounded claim linked to evidence, validation, limitations and excluded uses |
| [`release-gate.schema.json`](release-gate.schema.json) | Release Gate | Lifecycle-stage check set and controlled release decision |

## Identifier families

- Creator Passport: `CC-CR-...`
- Creation Passport: `CC-CP-...`
- Contribution Record: `CC-CO-...`
- Licence Record: `CC-LR-...`
- Signed Record Envelope: `CC-EN-...`
- RiverOS Evidence Event: `CC-RV-EV-...`
- RiverOS Retention Policy: `CC-RV-RP-...`
- Asset Draft: `CC-AD-...`
- Asset Component: `CC-AC-...`
- Material Specification: `CC-MS-...`
- Process Recipe: `CC-PR-...`
- Asset Variant: `CC-AV-...`
- Validation Run: `CC-VR-...`
- Creation Claim: `CC-CL-...`
- Release Gate: `CC-RG-...`

Identifiers are permanent. A correction or substantive update creates a new controlled version; it does not silently overwrite historical evidence.

## Integrity profile

Signed-envelope and digest-bound examples use `CC-CJSON-0.1`:

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
2. Asset Drafts are editable; released Creation Passports are governed and version-controlled.
3. Sensitive evidence may be represented by controlled references rather than embedded source material.
4. `additionalProperties` is disabled at each governed record boundary.
5. Records carry issuer, provenance and timestamps so registry actions can be audited.
6. Cross-record relationships use permanent identifiers and resolvable references.
7. Lifecycle stage, validation, claim status, release decision and licensing remain separate concepts.
8. Decimal measurements in digest-bound fixtures use normalized strings under `CC-CJSON-0.1`.
9. A digest detects change but does not prove truth or lawful authority.
10. A signature assertion is not trusted until verified against an approved key and Warden policy.
11. A licence or release gate does not substitute for legally required approval, certification, accreditation or authorisation.

## Automated validation

`tools/validate_registry.py` checks:

- all fifteen schemas against JSON Schema Draft 2020-12;
- unique schema `$id` values;
- all JSON fixtures under `examples/`;
- duplicate governed identifiers;
- local record cross-references;
- Asset Lab draft, component, material, process, variant, validation, claim and release links;
- envelope subject-to-payload consistency;
- CC-CJSON-0.1 SHA-256 digests;
- local evidence artefact digests;
- prohibition on verified synthetic signatures;
- the requirement that an issued envelope has a verified signature.

## Controlled implementation sequence

### Implemented

1. Core Creator, Creation, Contribution and Licence schemas.
2. Synthetic linked records and automated schema validation.
3. Signed record envelope and deterministic digest profile.
4. RiverOS evidence-event and retention-policy contracts.
5. Asset Lab governed authoring schemas and linked material fixture.

### Next

6. Add trusted key, signer authority and production signature verification contracts.
7. Define Warden policy decisions and restricted-field access.
8. Define EmpireOS licence issuance and lifecycle events.
9. Add positive and negative conformance vectors.
10. Add Synnergyze Asset Draft APIs and Virtual Silk Road discovery projections.

These schemas are an architecture baseline and are not legal advice, intellectual-property registration, scientific validation, safety approval or regulated-product authorisation.
