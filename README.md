# Creators Common

**Canonical release:** CC-CANON-V0.2  
**Core schema release:** CC-SCHEMAS-V0.2  
**Asset Lab release:** CC-ASSET-LAB-V0.1  
**Governance schema release:** CC-GOVERNANCE-SCHEMAS-V0.1  
**Trust schema release:** CC-TRUST-SCHEMAS-V0.2  
**Fixture release:** CC-FIXTURES-V0.5  
**Integrity architecture:** CC-SIGNED-ENVELOPES-V0.1  
**Evidence architecture:** CC-RIVEROS-EVIDENCE-CONTRACTS-V0.1  
**Warden architecture:** CC-WARDEN-POLICY-CONTRACTS-V0.1  
**EmpireOS architecture:** CC-EMPIREOS-LICENCE-LIFECYCLE-V0.1  
**Trust architecture:** CC-TRUSTED-KEYS-AND-SIGNATURES-V0.1  
**Advanced trust architecture:** CC-HARDWARE-CUSTODY-AND-MULTI-ALGORITHM-SIGNATURES-V0.1  
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
| **DigitalMe** | Portable identity for creators, reviewers, operators and institutions |
| **Synnergyze** | Registry infrastructure, Asset Lab services, workflows, integrations, usage metering and royalty accounting |
| **RiverOS** | Evidence events, timestamps, artefact digests, event chains, retention and disposition |
| **Warden** | Contextual policy evaluation, field-level access, release gates, signer authority, key status and restricted-use controls |
| **EmpireOS** | Append-only issuance and lifecycle control of governed licences and affiliations |
| **Virtual Silk Road** | Discovery, collaboration, controlled distribution, manufacturing access and commercial exchange |

## Governed record families

### Core registry and evidence

- **Creator Passport (`CC-CR`)** — identity, capabilities, affiliations, contributions and portfolio.
- **Creation Passport (`CC-CP`)** — purpose, creators, ownership, evidence, maturity, restrictions, economics and lineage.
- **Contribution Record (`CC-CO`)** — contributor action, evidence, review, attribution and agreed rights.
- **Licence Record (`CC-LR`)** — parties, permitted use, territory, duration, obligations, economics and suspension controls.
- **Signed Record Envelope (`CC-EN`)** — deterministic payload digest, signature assertions and verification references.
- **RiverOS Evidence Event (`CC-RV-EV`)** — actors, governed subjects, evidence artefacts, decisions, timestamps and chain references.
- **RiverOS Retention Policy (`CC-RV-RP`)** — retention triggers, review periods, legal holds and disposition.

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

- **Warden Access Policy (`CC-WA`)** — field-level subject, resource, action, purpose, context and obligation rules.
- **Warden Policy Decision (`CC-WD`)** — one contextual permit, deny, conditional permit or indeterminate decision.
- **EmpireOS Licence Lifecycle Event (`CC-EO-LE`)** — append-only issue, amend, renew, suspend, resume, expire, terminate, revoke or supersede event.

### Trust, custody and signatures

- **Trusted Key (`CC-TK`)** — public verification key, fingerprint, owner, purpose, custody, validity and status.
- **Signer Authority (`CC-SA`)** — keys, record types, actions, scopes, purposes and environments a signer may use.
- **Key Lifecycle Event (`CC-KE`)** — registration, activation, rotation, suspension, revocation, expiry or retirement.
- **Signature Verification (`CC-SV`)** — cryptographic result, trust result and final disposition.
- **Key Custody Attestation (`CC-KA`)** — provider, device, boundary, fingerprint and non-exportability assertions.
- **Signing Operation (`CC-SO`)** — authority, attestation, signed-message digest, signature, context, result and verification linkage.

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
  -> Creation Passport
  -> Signed Record Envelope
  -> Trusted-key, custody and signer-authority verification
  -> EmpireOS licence lifecycle
  -> Virtual Silk Road projection
```

V0.1 creation modes are material and process development, physical-product assembly, and research-use qPCR assay development.

- [Open the Asset Lab prototype](app/asset-lab/index.html)
- [Read the Asset Lab PRD](docs/product/CC-ASSET-LAB-PRD-V0.1.md)
- [Read the Asset Lab UI contract](docs/architecture/CC-ASSET-LAB-UI-CONTRACT-V0.1.md)

The prototype does not store production data or issue real approvals.

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

For ES256 and RS256, the key fingerprint is `SHA-256(DER SubjectPublicKeyInfo)`.

Cryptographic validity and trust validity are evaluated separately. A mathematically valid signature fails overall verification when the key is revoked, expired, suspended or unauthorised.

Key Custody Attestations and Signing Operations record boundary and execution evidence without publishing private-key material. Synthetic attestations are confined to the named conformance purpose and environment and cannot be represented as production hardware verification.

- [Signed Record Envelopes V0.1](docs/architecture/CC-SIGNED-ENVELOPES-V0.1.md)
- [Trusted Keys and Signatures V0.1](docs/security/CC-TRUSTED-KEYS-AND-SIGNATURES-V0.1.md)
- [Hardware Custody and Multi-Algorithm Signatures V0.1](docs/security/CC-HARDWARE-CUSTODY-AND-MULTI-ALGORITHM-SIGNATURES-V0.1.md)

## Machine-readable contracts

The JSON Schema Draft 2020-12 contracts under [`schemas/`](schemas/) cover **twenty-four record families**:

- seven core registry, integrity and RiverOS records;
- eight Asset Lab authoring records;
- two Warden policy records;
- one EmpireOS lifecycle record; and
- six trusted-key, custody and signature records.

See the [schema index and design rules](schemas/README.md).

Schema conformance does not establish authorship, ownership, scientific validity, safety, regulatory status, identity assurance, hardware certification, signature authority, policy correctness or legal enforceability.

## Conformance validation

`tools/validate_registry.py` validates the original twenty-two schemas and linked Core, Asset Lab, RiverOS, Warden, EmpireOS and Ed25519 fixtures.

`tools/validate_advanced_trust.py` validates:

- the Key Custody Attestation and Signing Operation schemas;
- P-256 and RSA key-type and size requirements;
- DER SubjectPublicKeyInfo fingerprints;
- valid and tampered ES256 vectors;
- valid and tampered RS256 vectors;
- synthetic non-exportable custody assertions; and
- hardware-bound signing-operation evidence.

The GitHub Actions workflow runs both validators. No production private key is committed.

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
- [Registry Schemas](schemas/README.md)
- [Registry Fixtures](examples/README.md)

## Governance principles

1. Sponsorship does not automatically constitute authorship.
2. Company ownership does not erase individual contribution.
3. Derivative creations preserve lineage to source records.
4. Claims remain connected to evidence and limitations.
5. Warden decisions remain connected to policy, actor, action, resource and obligations.
6. Proposed EmpireOS events do not change licences.
7. Cryptographic validity does not equal current trust or legal authority.
8. Revoked, expired or unauthorised keys fail overall verification.
9. Private keys are not registry records.
10. Synthetic hardware attestations cannot be promoted to production truth.
11. Release gates, licences, signatures, attestations and policy decisions do not substitute for legal, safety or regulatory approval.
12. Historical evidence, event history and key lifecycle records must not be silently overwritten.

## Release status

The documents, schemas, fixtures and prototypes are controlled architecture baselines for review and conformance testing. They are not legal assignments, patent filings, copyright registrations, production trust certificates, hardware certifications, production CAD or LIMS systems, scientific validations, executed licences, regulated-product authorisations, clinical approvals or diagnostic validations.

## Next implementation layers

- Synnergyze Asset Draft APIs and collaborative persistence;
- creator and creation registration workflows;
- Virtual Silk Road public and member discovery projections;
- production hardware-attestation chain verification, trusted time and dual-control signing.
