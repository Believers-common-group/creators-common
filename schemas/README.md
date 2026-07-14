# Creators Common Registry Schemas

**Core schema release:** CC-SCHEMAS-V0.3  
**Asset Lab schema release:** CC-ASSET-LAB-SCHEMAS-V0.1  
**Governance schema release:** CC-GOVERNANCE-SCHEMAS-V0.1  
**Trust schema release:** CC-TRUST-SCHEMAS-V0.2  
**Synnergyze schema release:** CC-SYNNERGYZE-SCHEMAS-V0.1  
**Registration schema release:** CC-REGISTRATION-SCHEMAS-V0.1  
**Status:** Draft controlled contracts for implementation and review  
**JSON Schema dialect:** Draft 2020-12

This directory converts the Creators Common Canon and its Asset Lab, RiverOS, Warden, EmpireOS, trust, Synnergyze and registration integrations into machine-readable contracts.

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

## Trusted-key, custody and signature schemas

| Schema | Registry object | Purpose |
|---|---|---|
| [`trusted-key.schema.json`](trusted-key.schema.json) | Trusted Key | Public key, fingerprint, owner, purposes, custody assertions, validity and status |
| [`signer-authority.schema.json`](signer-authority.schema.json) | Signer Authority | Permitted keys, record types, signing actions, scopes, purposes and assurance conditions |
| [`key-lifecycle-event.schema.json`](key-lifecycle-event.schema.json) | Key Lifecycle Event | Append-only registration, activation, rotation, suspension, revocation, expiry and retirement |
| [`signature-verification.schema.json`](signature-verification.schema.json) | Signature Verification | Cryptographic result, trust result, overall disposition and conformance vector |
| [`key-custody-attestation.schema.json`](key-custody-attestation.schema.json) | Key Custody Attestation | Security-boundary, provider, device, fingerprint and non-exportability assertions |
| [`signing-operation.schema.json`](signing-operation.schema.json) | Signing Operation | Signing request, authority, custody evidence, message digest, signature and verification linkage |

## Synnergyze collaboration and persistence schemas

| Schema | Registry object | Purpose |
|---|---|---|
| [`synnergyze-collaboration-session.schema.json`](synnergyze-collaboration-session.schema.json) | Collaboration Session | DigitalMe actor, Warden context, capabilities, base revision and ephemeral presence policy |
| [`synnergyze-asset-operation.schema.json`](synnergyze-asset-operation.schema.json) | Asset Operation | Idempotent client operation, base revision, patch set and acceptance result |
| [`synnergyze-asset-event.schema.json`](synnergyze-asset-event.schema.json) | Asset Event | Append-only operation, conflict, review and release-request history |
| [`synnergyze-asset-snapshot.schema.json`](synnergyze-asset-snapshot.schema.json) | Asset Snapshot | Deterministic materialized state, revision, last-event reference and digest |

## Creator and Creation registration schemas

| Schema | Registry object | Purpose |
|---|---|---|
| [`creator-registration-application.schema.json`](creator-registration-application.schema.json) | Creator Registration Application | DigitalMe identity reference, role intent, consent, evidence, visibility and requested Creator Passport |
| [`creation-registration-application.schema.json`](creation-registration-application.schema.json) | Creation Registration Application | Creator claims, rights disclosure, safety status, evidence and requested Creation Passport |
| [`registration-review.schema.json`](registration-review.schema.json) | Registration Review | Human review, evidence sufficiency, permission check, visibility disposition and Warden/RiverOS references |
| [`registration-event.schema.json`](registration-event.schema.json) | Registration Event | Append-only submission, review, acceptance, rejection, withdrawal and passport-issuance history |

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
- Key Custody Attestation: `CC-KA-...`
- Signing Operation: `CC-SO-...`
- Collaboration Session: `CC-SY-CS-...`
- Asset Operation: `CC-SY-OP-...`
- Asset Event: `CC-SY-EV-...`
- Asset Snapshot: `CC-SY-SN-...`
- Creator Registration Application: `CC-REG-CR-...`
- Creation Registration Application: `CC-REG-CP-...`
- Registration Review: `CC-REG-RV-...`
- Registration Event: `CC-REG-EV-...`

Identifiers are permanent. Corrections and substantive changes create controlled versions or append-only events; they do not silently overwrite historical evidence.

## Integrity and signature profiles

Digest-bound records use `CC-CJSON-0.1`: duplicate keys, non-standard constants and floating-point values are rejected; object keys are recursively sorted; array order is preserved; JSON is serialized as UTF-8 without insignificant whitespace; and SHA-256 is calculated over the canonical bytes.

Envelope signatures use `CC-SIG-0.1`, a domain-separated LF-delimited message containing the envelope identifier, subject identity, canonicalization profile and payload digest.

Implemented verification profiles:

- Ed25519 with raw 32-byte public keys;
- ES256 with P-256, SHA-256 and 64-byte JOSE `r || s` signatures;
- RS256 with RSA keys of at least 2048 bits, PKCS1-v1_5 padding and SHA-256.

For ES256 and RS256, public-key fingerprints are `SHA-256(DER SubjectPublicKeyInfo)`.

## Design rules

1. Schema validation confirms structural conformance, not truth, ownership or regulatory approval.
2. Asset Drafts are editable; released Creation Passports are governed and version-controlled.
3. Sensitive evidence may be represented by controlled references rather than embedded source material.
4. `additionalProperties` is disabled at each governed record boundary.
5. Cross-record relationships use permanent identifiers and resolvable references.
6. Lifecycle stage, validation, claim status, release, access, licence and signature trust remain separate concepts.
7. Cryptographic validity and trust-policy validity must be evaluated separately.
8. A mathematically valid signature made with a revoked, expired or unauthorized key fails overall verification.
9. Synthetic custody attestations are restricted to named conformance purposes and environments.
10. Private keys are not registry records and must not be committed to the repository.
11. Collaboration presence does not create authorship, ownership or economic rights.
12. A registration acceptance requires explicit consent, sufficient evidence, human review, Warden decision and RiverOS evidence.
13. Passport issuance does not create a Virtual Silk Road listing.
14. A licence, policy decision, signature, attestation, registration or release gate does not substitute for legally required approval, certification, accreditation or authorization.

## Automated validation

The GitHub Actions workflow runs four validator suites:

- `tools/validate_registry.py` — original registry, Asset Lab, RiverOS, Warden, EmpireOS and Ed25519 contracts;
- `tools/validate_advanced_trust.py` — custody, ES256 and RS256 contracts and vectors;
- `tools/validate_synnergyze_asset_api.py` — collaboration schemas, persistence invariants and Asset Draft OpenAPI contract; and
- `tools/validate_registration_workflows.py` — registration applications, human reviews, event chains, linked passports, consent boundaries and Registration OpenAPI contract.

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
9. Key Custody Attestation and Signing Operation contracts.
10. ES256 and RS256 verification with positive and negative vectors.
11. Synnergyze Asset Draft API and collaborative persistence contracts.
12. Creator and Creation registration workflows.

### Next

13. Virtual Silk Road public and member discovery projections.
14. Production hardware attestation-chain verification and trusted-time integration.
15. Multi-user conflict and offline replay conformance suites.

These schemas are an architecture baseline and are not legal advice, intellectual-property registration, scientific validation, identity certification, hardware certification, safety approval or regulated-product authorization.
