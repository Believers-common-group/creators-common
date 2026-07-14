# Creators Common

**Canonical release:** CC-CANON-V0.2  
**Core schema release:** CC-SCHEMAS-V0.3  
**Asset Lab release:** CC-ASSET-LAB-V0.1  
**Governance schema release:** CC-GOVERNANCE-SCHEMAS-V0.1  
**Trust schema release:** CC-TRUST-SCHEMAS-V0.2  
**Synnergyze API release:** CC-SYNNERGYZE-ASSET-DRAFT-API-V0.1  
**Registration workflow release:** CC-CREATOR-AND-CREATION-REGISTRATION-V0.1  
**Fixture release:** CC-FIXTURES-V0.6  
**Repository status:** Controlled baseline for review  
**Institutional home:** Believers Common ecosystem

> **Creators Common is the governed home of creators and their creations.**
>
> It preserves identity, contribution, provenance, evidence, version history, licensing and economic participation from the first idea through validation, production, deployment, improvement and long-term preservation.

## Purpose

Creators Common ensures that a creation can answer:

- who conceived, designed, engineered, validated and improved it;
- what evidence supports its claims;
- which controlled version is being used;
- who owns, governs, licenses or preserves it;
- who is entitled to attribution and economic participation; and
- under what conditions it may be accessed, reproduced, manufactured, modified, deployed or distributed.

It does not replace patent offices, copyright systems, universities, professional bodies, laboratories, standards organisations or regulators. It provides the operational provenance and governance layer connecting creators, institutions, evidence, products, licences and authorised uses.

## Institutional architecture

| Layer | Responsibility |
|---|---|
| **Believers Common** | Constitutional governance, ethics, custodianship, dispute resolution and public-interest safeguards |
| **Creators Common** | Creator identity, contribution records, creation registration, provenance, attribution, licensing instructions and economic participation |
| **DigitalMe** | Portable identity, role intent, consent and delegated permissions for creators, reviewers, operators and institutions |
| **Synnergyze** | Registry infrastructure, Asset Lab services, workflow orchestration, collaboration, persistence and API integration |
| **RiverOS** | Evidence events, timestamps, artefact digests, event chains, retention and disposition |
| **Warden** | Contextual policy evaluation, field-level access, registration review, release gates, signer authority and restricted-use controls |
| **EmpireOS** | Append-only issuance and lifecycle control of governed licences and affiliations |
| **Virtual Silk Road** | Separate discovery, collaboration, controlled distribution, manufacturing access and commercial exchange projection |

## Governed record families

### Core registry and evidence

- **Creator Passport (`CC-CR`)**
- **Creation Passport (`CC-CP`)**
- **Contribution Record (`CC-CO`)**
- **Licence Record (`CC-LR`)**
- **Signed Record Envelope (`CC-EN`)**
- **RiverOS Evidence Event (`CC-RV-EV`)**
- **RiverOS Retention Policy (`CC-RV-RP`)**

### Asset Lab authoring

- **Asset Draft (`CC-AD`)**
- **Asset Component (`CC-AC`)**
- **Material Specification (`CC-MS`)**
- **Process Recipe (`CC-PR`)**
- **Asset Variant (`CC-AV`)**
- **Validation Run (`CC-VR`)**
- **Creation Claim (`CC-CL`)**
- **Release Gate (`CC-RG`)**

### Governance and licence lifecycle

- **Warden Access Policy (`CC-WA`)**
- **Warden Policy Decision (`CC-WD`)**
- **EmpireOS Licence Lifecycle Event (`CC-EO-LE`)**

### Trust, custody and signatures

- **Trusted Key (`CC-TK`)**
- **Signer Authority (`CC-SA`)**
- **Key Lifecycle Event (`CC-KE`)**
- **Signature Verification (`CC-SV`)**
- **Key Custody Attestation (`CC-KA`)**
- **Signing Operation (`CC-SO`)**

### Synnergyze collaboration and persistence

- **Collaboration Session (`CC-SY-CS`)**
- **Asset Operation (`CC-SY-OP`)**
- **Asset Event (`CC-SY-EV`)**
- **Asset Snapshot (`CC-SY-SN`)**

### Creator and Creation registration

- **Creator Registration Application (`CC-REG-CR`)**
- **Creation Registration Application (`CC-REG-CP`)**
- **Registration Review (`CC-REG-RV`)**
- **Registration Event (`CC-REG-EV`)**

## Creators Common Asset Lab

Asset Lab is the governed authoring interface for materials, physical products and research-use molecular assets. It takes interaction inspiration from material-exploration workbenches, including the referenced OpenAI Material Lab study, but is not represented as an OpenAI integration, endorsement or copied interface.

```text
Creator identity
  -> Asset Draft
  -> Components, materials and processes
  -> Variants
  -> Validation Runs
  -> Creation Claims
  -> RiverOS evidence
  -> Contribution attribution
  -> Warden field-level access and release checks
  -> Release Gate
  -> Creation Registration Application
  -> Creation Passport
  -> Signed Record Envelope
  -> Trusted-key, custody and signer-authority verification
  -> EmpireOS licence lifecycle
  -> separate Virtual Silk Road projection
```

V0.1 creation modes are material and process development, physical-product assembly, and research-use qPCR assay development.

- [Open the Asset Lab prototype](app/asset-lab/index.html)
- [Read the Asset Lab PRD](docs/product/CC-ASSET-LAB-PRD-V0.1.md)
- [Read the Asset Lab UI contract](docs/architecture/CC-ASSET-LAB-UI-CONTRACT-V0.1.md)

The prototype does not store production data or issue real approvals.

## Synnergyze Asset Draft API

The first Synnergyze API contract provides governed collaboration and persistence for Asset Lab.

```text
DigitalMe actor
  -> Warden-bounded Collaboration Session
  -> idempotent Asset Operation
  -> optimistic revision check
  -> append-only Asset Event
  -> deterministic Asset Snapshot
  -> controlled release request
```

It requires stable idempotency keys, `If-Match` revision checks, explicit conflict outcomes and deterministic `CC-CJSON-0.1` snapshot digests. Transient cursor and typing presence are ephemeral and have no authorship effect.

- [Synnergyze Asset Draft API OpenAPI 3.1](api/openapi/synnergyze-asset-draft-api-v0.1.json)
- [Synnergyze Asset Draft API architecture](docs/integrations/synnergyze/CC-SYNNERGYZE-ASSET-DRAFT-API-V0.1.md)

## Creator and Creation registration

Registration begins with DigitalMe identity and explicit consent, not with public listing.

```text
DigitalMe identity + role intent + consent
  -> Creator Registration Application
  -> evidence and duplicate review
  -> Warden decision
  -> human Registration Review
  -> Creator Passport issuance event

Registered Creator Passport + Asset Draft
  -> Creation Registration Application
  -> authorship, rights, safety and evidence review
  -> Warden decision
  -> human Registration Review
  -> Creation Passport issuance event
```

The workflow enforces:

- no actor claim without a DigitalMe reference;
- no public projection without explicit consent;
- no accepted registration without sufficient evidence and human review;
- no verified status without a Warden decision;
- RiverOS evidence for every material status transition;
- separation of sponsorship, ownership and authorship; and
- no automatic Virtual Silk Road listing after passport issuance.

Registration Events may only set public projection to `none`, `prepare-eligible` or `remove`. VSR publication remains a separate governed workflow.

- [Creator and Creation Registration workflow](docs/workflows/CC-CREATOR-AND-CREATION-REGISTRATION-V0.1.md)
- [Registration API OpenAPI 3.1](api/openapi/creators-common-registration-api-v0.1.json)
- [API contract index](api/README.md)

## Warden and EmpireOS

Warden evaluates a specific subject, action, resource, field set and context. Conditional access may require RiverOS logging, approval, redaction, watermarking, purpose binding, expiry or no-export controls. A permit remains contextual and does not create authorship, ownership, validation, licensing or regulatory authority.

EmpireOS records append-only licence events:

```text
issue -> amend / renew -> suspend / resume -> expire / terminate / revoke / supersede
```

A `proposed` event does not change a licence.

- [Warden Policy Contracts V0.1](docs/integrations/warden/CC-WARDEN-POLICY-CONTRACTS-V0.1.md)
- [EmpireOS Licence Lifecycle V0.1](docs/integrations/empireos/CC-EMPIREOS-LICENCE-LIFECYCLE-V0.1.md)

## Integrity, custody and signature verification

### `CC-CJSON-0.1`

The canonical JSON profile rejects duplicate keys, non-standard constants and floating-point values in digest-bound payloads; recursively sorts object keys; preserves array order; serializes UTF-8 JSON without insignificant whitespace; and calculates SHA-256 over the canonical bytes.

### `CC-SIG-0.1`

The LF-delimited signed message binds the envelope identifier and version, subject record type and identity, canonicalization profile, digest algorithm and payload digest.

Implemented verification profiles:

- **Ed25519** — raw 32-byte public key;
- **ES256** — P-256, SHA-256 and 64-byte JOSE `r || s` signature;
- **RS256** — RSA key of at least 2048 bits, PKCS1-v1_5 padding and SHA-256.

Cryptographic validity and trust validity are evaluated separately. A mathematically valid signature fails overall verification when the key is revoked, expired, suspended or unauthorised.

- [Signed Record Envelopes V0.1](docs/architecture/CC-SIGNED-ENVELOPES-V0.1.md)
- [Trusted Keys and Signatures V0.1](docs/security/CC-TRUSTED-KEYS-AND-SIGNATURES-V0.1.md)
- [Hardware Custody and Multi-Algorithm Signatures V0.1](docs/security/CC-HARDWARE-CUSTODY-AND-MULTI-ALGORITHM-SIGNATURES-V0.1.md)

## Machine-readable contracts

The JSON Schema Draft 2020-12 contracts under [`schemas/`](schemas/) cover **thirty-two record families**:

- seven core registry, integrity and RiverOS records;
- eight Asset Lab authoring records;
- three Warden and EmpireOS records;
- six trusted-key, custody and signature records;
- four Synnergyze collaboration and persistence records; and
- four Creator and Creation registration records.

See the [schema index and design rules](schemas/README.md).

## Conformance validation

The GitHub Actions workflow runs:

- `tools/validate_registry.py`;
- `tools/validate_advanced_trust.py`;
- `tools/validate_synnergyze_asset_api.py`; and
- `tools/validate_registration_workflows.py`.

Together they validate schemas, linked fixtures, governed references, digests, signature profiles, collaboration persistence, consent, human review, registration event chains, passport issuance and both OpenAPI 3.1 contracts.

No production private key is committed.

## Creation maturity lifecycle

| Stage | Meaning |
|---|---|
| **C0 — Idea registered** | Problem, opportunity and originator recorded |
| **C1 — Concept defined** | Purpose, preliminary design and contributors established |
| **C2 — Prototype created** | Initial working embodiment and limitations recorded |
| **C3 — Verified** | Technical function demonstrated against defined requirements |
| **C4 — Validated** | Fitness for intended use evaluated and bounded |
| **C5 — Production-ready** | Controlled specification and release package completed |
| **C6 — Licensed deployment** | Approved parties may manufacture, deploy or use the creation |
| **C7 — Network creation** | Interoperable use across affiliated nodes with common evidence rules |
| **C8 — Preserved creation** | Custodian, archive, continuity and knowledge-transfer controls completed |

## Current controlled documents

- [Creators Common Canon V0.2](docs/canon/CC-CANON-V0.2.md)
- [Asset Lab PRD V0.1](docs/product/CC-ASSET-LAB-PRD-V0.1.md)
- [qPCR Creator Programme V0.1](docs/programmes/molecular-sciences/CC-QPCR-CREATOR-PROGRAMME-V0.1.md)
- [RiverOS Evidence Contracts V0.1](docs/integrations/riveros/CC-RIVEROS-EVIDENCE-CONTRACTS-V0.1.md)
- [Warden Policy Contracts V0.1](docs/integrations/warden/CC-WARDEN-POLICY-CONTRACTS-V0.1.md)
- [EmpireOS Licence Lifecycle V0.1](docs/integrations/empireos/CC-EMPIREOS-LICENCE-LIFECYCLE-V0.1.md)
- [Trusted Keys and Signatures V0.1](docs/security/CC-TRUSTED-KEYS-AND-SIGNATURES-V0.1.md)
- [Hardware Custody and Multi-Algorithm Signatures V0.1](docs/security/CC-HARDWARE-CUSTODY-AND-MULTI-ALGORITHM-SIGNATURES-V0.1.md)
- [Synnergyze Asset Draft API V0.1](docs/integrations/synnergyze/CC-SYNNERGYZE-ASSET-DRAFT-API-V0.1.md)
- [Creator and Creation Registration V0.1](docs/workflows/CC-CREATOR-AND-CREATION-REGISTRATION-V0.1.md)
- [Registry Schemas](schemas/README.md)
- [API Contracts](api/README.md)

## Governance principles

1. Sponsorship does not automatically constitute authorship.
2. Company ownership does not erase individual contribution.
3. Derivative creations preserve lineage to source records.
4. Claims remain connected to evidence and limitations.
5. Warden decisions remain connected to policy, actor, action, resource and obligations.
6. Proposed EmpireOS events do not change licences.
7. Cryptographic validity does not equal current trust or legal authority.
8. Private keys are not registry records.
9. Collaboration presence does not create authorship or economic rights.
10. Consent is required before public identity or creation projection.
11. Human review, Warden decision and RiverOS evidence are required for accepted registration.
12. Passport issuance does not equal VSR publication.
13. Historical evidence, review and event records must not be silently overwritten.
14. Release gates, registrations, licences, signatures, attestations and policy decisions do not substitute for legal, safety or regulatory approval.

## Release status

The documents, schemas, fixtures, APIs and prototypes are controlled architecture baselines for review and conformance testing. They are not legal assignments, patent filings, copyright registrations, production trust certificates, hardware certifications, production databases, identity certifications, scientific validations, executed licences, regulated-product authorisations, clinical approvals or diagnostic validations.

## Next implementation layers

- Virtual Silk Road public and member discovery projections;
- production hardware-attestation chain verification and trusted time;
- Synnergyze multi-user conflict and offline replay conformance suites; and
- registration duplicate-detection, dispute and revocation workflows.
