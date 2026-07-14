# Creators Common Registry Schemas

**Core schema release:** CC-SCHEMAS-V0.2  
**Asset Lab schema release:** CC-ASSET-LAB-SCHEMAS-V0.1  
**Governance schema release:** CC-GOVERNANCE-SCHEMAS-V0.1  
**Trust schema release:** CC-TRUST-SCHEMAS-V0.1  
**Status:** Draft controlled contracts for implementation and review  
**JSON Schema dialect:** Draft 2020-12

This directory converts the Creators Common Canon and its Asset Lab, RiverOS, Warden, EmpireOS and trust integrations into machine-readable contracts.

## Core registry, integrity and evidence schemas

| Schema | Registry object | Purpose |
|---|---|---|
| [`creator-passport.schema.json`](creator-passport.schema.json) | Creator Passport | Portable identity, capabilities, affiliations, verified roles and creation portfolio |
| [`creation-passport.schema.json`](creation-passport.schema.json) | Creation Passport | Controlled identity, maturity, evidence, ownership, custodianship, restrictions and lineage |
| [`contribution-record.schema.json`](contribution-record.schema.json) | Contribution Record | Contributor action, evidence, review, attribution and agreed rights |
| [`licence-record.schema.json`](licence-record.schema.json) | Licence Record | Parties, actions, territory, field of use, obligations, economics and suspension controls |
| [`record-envelope.schema.json`](record-envelope.schema.json) | Signed Record Envelope | Deterministic payload digest, signature assertions and verification references |
| [`riveros-evidence-event.schema.json`](riveros-evidence-event.schema.json) | RiverOS Evidence Event | Actors, subjects, evidence artefacts, decisions, timestamps and event chain |
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

## Warden and EmpireOS governance schemas

| Schema | Registry object | Purpose |
|---|---|---|
| [`warden-access-policy.schema.json`](warden-access-policy.schema.json) | Warden Access Policy | Field-level subject, resource, action, purpose, device-trust, obligation and conflict rules |
| [`warden-policy-decision.schema.json`](warden-policy-decision.schema.json) | Warden Policy Decision | One deterministic permit, deny or conditional decision for a governed request |
| [`empireos-licence-event.schema.json`](empireos-licence-event.schema.json) | EmpireOS Licence Lifecycle Event | Append-only issuance, amendment, renewal, suspension, expiry, termination, revocation and supersession events |

## Trusted-key and signature schemas

| Schema | Registry object | Purpose |
|---|---|---|
| [`trusted-key.schema.json`](trusted-key.schema.json) | Trusted Key | Public key, fingerprint, owner, purposes, custody assertions, validity and status |
| [`signer-authority.schema.json`](signer-authority.schema.json) | Signer Authority | Permitted keys, record types, signing actions, scopes, purposes and assurance conditions |
| [`key-lifecycle-event.schema.json`](key-lifecycle-event.schema.json) | Key Lifecycle Event | Append-only registration, activation, rotation, suspension, revocation, expiry and retirement |
| [`signature-verification.schema.json`](signature-verification.schema.json) | Signature Verification | Cryptographic result, trust result, overall disposition and conformance vector |

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
- Warden Access Policy: `CC-WA-...`
- Warden Policy Decision: `CC-WD-...`
- EmpireOS Licence Lifecycle Event: `CC-EO-LE-...`
- Trusted Key: `CC-TK-...`
- Signer Authority: `CC-SA-...`
- Key Lifecycle Event: `CC-KE-...`
- Signature Verification: `CC-SV-...`

Identifiers are permanent. Corrections and substantive changes create controlled versions or append-only events; they do not silently overwrite historical evidence.

## Integrity and signature profiles

Digest-bound records use `CC-CJSON-0.1`:

- duplicate object keys and non-standard constants are rejected;
- floating-point values are rejected in digest-bound payloads;
- object keys are recursively sorted and array order is preserved;
- JSON is serialised as UTF-8 without insignificant whitespace;
- SHA-256 is calculated over the canonical bytes.

Ed25519 envelope signatures use `CC-SIG-0.1`, a domain-separated LF-delimited message containing the envelope identifier, subject identity, canonicalisation profile and payload digest. See:

- [`CC-SIGNED-ENVELOPES-V0.1`](../docs/architecture/CC-SIGNED-ENVELOPES-V0.1.md)
- [`CC-TRUSTED-KEYS-AND-SIGNATURES-V0.1`](../docs/security/CC-TRUSTED-KEYS-AND-SIGNATURES-V0.1.md)

## Design rules

1. Schema validation confirms structural conformance, not truth, ownership or regulatory approval.
2. Asset Drafts are editable; released Creation Passports are governed and version-controlled.
3. Sensitive evidence may be represented by controlled references rather than embedded source material.
4. `additionalProperties` is disabled at each governed record boundary.
5. Cross-record relationships use permanent identifiers and resolvable references.
6. Lifecycle stage, validation, claim status, release, access, licence and signature trust remain separate concepts.
7. A digest detects change but does not prove factual truth or lawful authority.
8. Cryptographic validity and trust-policy validity must be evaluated separately.
9. A cryptographically valid signature made with a revoked, expired or unauthorised key fails overall verification.
10. Private keys are not registry records and must not be committed to the repository.
11. A Warden permit is contextual and does not create broader rights.
12. A proposed EmpireOS event does not change a Licence Record until separately authorised and effective.
13. A licence, policy decision, signature or release gate does not substitute for legally required approval, certification, accreditation or authorisation.

## Automated validation

`tools/validate_registry.py` checks:

- all twenty-two schemas against JSON Schema Draft 2020-12;
- unique schema `$id` values and governed identifiers;
- every JSON fixture under `examples/`;
- Asset Lab, Warden, EmpireOS, RiverOS and core registry references;
- envelope subject-to-payload consistency and CC-CJSON-0.1 digests;
- trusted-key public-key length and SHA-256 fingerprints;
- applied key registration, rotation and revocation event continuity;
- signer-authority key, record-type, action, purpose, environment and scope permissions;
- Ed25519 signature verification under `CC-SIG-0.1`;
- positive, tampered-message and revoked-key conformance vectors;
- prohibition on verified synthetic signatures;
- the requirement that an issued envelope has a matching successful verification record.

## Controlled implementation sequence

### Implemented

1. Core Creator, Creation, Contribution and Licence schemas.
2. Signed record envelope and deterministic digest profile.
3. RiverOS evidence-event and retention-policy contracts.
4. Asset Lab governed authoring schemas and linked material fixture.
5. Warden field-level access policy and policy-decision contracts.
6. EmpireOS append-only licence lifecycle events.
7. Trusted Key, Signer Authority and Key Lifecycle Event contracts.
8. Ed25519 verification with positive and negative conformance vectors.

### Next

9. Hardware-backed production key custody and attestation contracts.
10. ES256 and RS256 verification profiles.
11. Synnergyze Asset Draft APIs and collaborative persistence.
12. Creator and Creation registration workflows.
13. Virtual Silk Road discovery projections.

These schemas are an architecture baseline and are not legal advice, intellectual-property registration, scientific validation, identity certification, safety approval or regulated-product authorisation.
