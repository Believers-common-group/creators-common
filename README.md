# Creators Common

**Canonical release:** CC-CANON-V0.2  
**Core schema release:** CC-SCHEMAS-V0.2  
**Asset Lab release:** CC-ASSET-LAB-V0.1  
**Governance schema release:** CC-GOVERNANCE-SCHEMAS-V0.1  
**Fixture release:** CC-FIXTURES-V0.4  
**Integrity architecture:** CC-SIGNED-ENVELOPES-V0.1  
**Evidence architecture:** CC-RIVEROS-EVIDENCE-CONTRACTS-V0.1  
**Warden architecture:** CC-WARDEN-POLICY-CONTRACTS-V0.1  
**EmpireOS architecture:** CC-EMPIREOS-LICENCE-LIFECYCLE-V0.1  
**Repository status:** Controlled baseline for review  
**Institutional home:** Believers Common ecosystem

> **Creators Common is the governed home of creators and their creations.**
>
> It preserves identity, contribution, provenance, evidence, version history, licensing and economic participation from the first idea through validation, production, deployment, improvement and long-term preservation.

## Purpose

Creators Common exists to ensure that every meaningful creation can answer:

- Who conceived, designed, engineered, validated and improved it?
- What evidence supports the claims made for it?
- Which controlled version is being used?
- Who owns, governs, licenses or preserves it?
- Who is entitled to attribution, compensation and continuing participation?
- Under what conditions may it be accessed, reproduced, manufactured, modified, deployed or distributed?

Creators Common does **not** replace patent offices, copyright systems, universities, professional bodies, laboratories, standards organisations or regulatory authorities. It provides the operational provenance and governance layer connecting creators, institutions, evidence, products, licences and authorised uses throughout the creation lifecycle.

## Institutional architecture

| Layer | Responsibility |
|---|---|
| **Believers Common** | Constitutional governance, ethics, custodianship, dispute resolution and public-interest safeguards |
| **Creators Common** | Creator identity, contribution records, creation registration, provenance, attribution, licensing instructions and economic participation |
| **DigitalMe** | Portable identity for creators, reviewers, operators and institutions |
| **Synnergyze** | Registry infrastructure, Asset Lab services, workflow orchestration, integrations, usage metering and royalty accounting |
| **RiverOS** | Evidence events, timestamps, artefact digests, event chains, retention and disposition records |
| **Warden** | Contextual policy evaluation, field-level access decisions, safety gates, restricted-use controls and exceptions |
| **EmpireOS** | Append-only issuance and lifecycle control of governed licences and affiliations |
| **Virtual Silk Road** | Discovery, collaboration, controlled distribution, manufacturing access and commercial exchange |

## Governed registry objects

### Core records

- **Creator Passport** — identity, capabilities, affiliations, contributions, reviewer roles and portfolio.
- **Creation Passport** — controlled identity, purpose, creators, ownership, evidence, maturity, restrictions, economics and lineage.
- **Contribution Record** — precise contributor action, evidence, review, attribution and agreed rights.
- **Licence Record** — permitted users, territory, duration, field of use, obligations, royalties, derivative rights and suspension conditions.
- **Signed Record Envelope** — deterministic bytes, SHA-256 digest and signature assertions for a governed record version.
- **RiverOS Evidence Event** — actors, governed subjects, evidence artefacts, policy decisions, timestamps and chain references.
- **RiverOS Retention Policy** — retention triggers, review periods, legal holds and end-of-retention disposition.

### Asset Lab authoring records

- **Asset Draft (`CC-AD`)** — editable creation workspace before controlled release.
- **Asset Component (`CC-AC`)** — part, assembly, panel, layer, ingredient group or logical module.
- **Material Specification (`CC-MS`)** — composition, properties, circularity, hazards, standards and sourcing.
- **Process Recipe (`CC-PR`)** — ordered production, laboratory, assembly or computational process.
- **Asset Variant (`CC-AV`)** — controlled experimental or design alternative.
- **Validation Run (`CC-VR`)** — method, execution, measurements, acceptance criteria and disposition.
- **Creation Claim (`CC-CL`)** — bounded claim linked to evidence, validation, limitations and excluded uses.
- **Release Gate (`CC-RG`)** — controlled decision for lifecycle advancement.

### Governance records

- **Warden Access Policy (`CC-WA`)** — field-level rules for subject, resource, action, purpose, context, obligations and conflict resolution.
- **Warden Policy Decision (`CC-WD`)** — one contextual permit, deny, conditional permit or indeterminate decision.
- **EmpireOS Licence Lifecycle Event (`CC-EO-LE`)** — append-only issuance, amendment, renewal, suspension, expiry, termination, revocation or supersession event.

## Creators Common Asset Lab

Asset Lab is the governed authoring interface for creating assets. It takes interaction inspiration from material-exploration and composition workbenches, including the referenced OpenAI Material Lab study, but is not represented as an OpenAI product integration, endorsement or copied interface.

Its distinguishing function is the Creators Common governance chain:

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
  -> EmpireOS licence lifecycle
  -> Virtual Silk Road projection
```

### V0.1 creation modes

1. Material specification and process development;
2. Physical product and assembly development;
3. Research-use qPCR assay and molecular workflow development.

### Dashboard prototype

- [Open the Asset Lab prototype](app/asset-lab/index.html)
- [Read the Asset Lab PRD](docs/product/CC-ASSET-LAB-PRD-V0.1.md)
- [Read the Asset Lab UI contract](docs/architecture/CC-ASSET-LAB-UI-CONTRACT-V0.1.md)

The prototype demonstrates the five-region workspace: Asset Header, Asset Tree, Creation Canvas, Property Inspector and Evidence Dock. It does not store production data or issue real approvals.

## Warden policy layer

Warden evaluates a specific subject, action, governed resource, field set and context against a referenced access policy.

A decision may be:

- `permit`;
- `deny`;
- `permit-with-conditions`;
- `not-applicable`; or
- `indeterminate`.

Conditional access may require RiverOS logging, human approval, redaction, watermarking, purpose binding, expiry or no-export controls. A permit is limited to the recorded context and does not create authorship, ownership, validation, licensing or regulatory authority.

- [Warden Policy Contracts V0.1](docs/integrations/warden/CC-WARDEN-POLICY-CONTRACTS-V0.1.md)
- [Warden Access Policy schema](schemas/warden-access-policy.schema.json)
- [Warden Policy Decision schema](schemas/warden-policy-decision.schema.json)

## EmpireOS licence lifecycle

The Licence Record defines the permission and terms. EmpireOS records append-only events that govern its operational lifecycle:

```text
issue -> amend / renew -> suspend / resume -> expire / terminate / revoke / supersede
```

Every post-issuance event carries the previous event identifier, a monotonically increasing sequence, the same Licence Record identifier, field-level changes, reasons, decision bases and occurrence/effective timestamps.

A `proposed` event does not change a licence. Authorised or effective events require separate approval and effective-time evidence.

- [EmpireOS Licence Lifecycle V0.1](docs/integrations/empireos/CC-EMPIREOS-LICENCE-LIFECYCLE-V0.1.md)
- [EmpireOS Licence Event schema](schemas/empireos-licence-event.schema.json)

## Machine-readable contracts

The JSON Schema Draft 2020-12 contracts under [`schemas/`](schemas/) cover eighteen record families:

- seven core registry, integrity and RiverOS records;
- eight Asset Lab authoring records;
- two Warden policy records; and
- one EmpireOS licence lifecycle event record.

See the [schema index and design rules](schemas/README.md).

Schema conformance does not by itself establish authorship, ownership, scientific validity, safety, regulatory status, signature authority, policy correctness or legal enforceability.

## Integrity profile

The signed-envelope flow uses `CC-CJSON-0.1`:

1. reject duplicate JSON keys and non-standard constants;
2. reject floating-point values in digest-bound payloads;
3. recursively sort object keys;
4. preserve array order;
5. serialize UTF-8 JSON without insignificant whitespace; and
6. calculate SHA-256 over the canonical bytes.

See [Signed Record Envelopes V0.1](docs/architecture/CC-SIGNED-ENVELOPES-V0.1.md).

The current signature fixture is synthetic and unverified. The repository does not claim that a production cryptographic signature has been created or verified.

## Conformance fixtures and validation

Synthetic, cross-linked fixtures are maintained under [`examples/`](examples/):

- core Creator, Creation, Contribution, Licence and Envelope records;
- RiverOS Evidence Event and Retention Policy records;
- an eight-record Asset Lab material-authoring chain;
- a Warden access policy and contextual decision;
- a four-event EmpireOS licence lifecycle chain;
- [fixture policy and chain description](examples/README.md).

The validator at [`tools/validate_registry.py`](tools/validate_registry.py):

- validates all eighteen schemas;
- checks unique schema `$id` values;
- validates every JSON fixture with format checking;
- rejects duplicate governed identifiers;
- verifies local cross-record references;
- validates Asset Lab authoring links;
- checks Warden policy references and matched rule identifiers;
- checks EmpireOS same-licence event continuity and sequence order;
- confirms envelope subject-to-payload consistency;
- recalculates CC-CJSON-0.1 SHA-256 digests;
- verifies local evidence artefact digests;
- rejects verified synthetic signatures; and
- requires an issued envelope to contain a verified signature.

The workflow at [`.github/workflows/validate-registry.yml`](.github/workflows/validate-registry.yml) runs these checks for relevant pull requests and branch updates. A successful workflow run is required before the baseline is ready for merge.

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
- [Asset Lab UI Contract V0.1](docs/architecture/CC-ASSET-LAB-UI-CONTRACT-V0.1.md)
- [qPCR Creator Programme V0.1](docs/programmes/molecular-sciences/CC-QPCR-CREATOR-PROGRAMME-V0.1.md)
- [Signed Record Envelopes V0.1](docs/architecture/CC-SIGNED-ENVELOPES-V0.1.md)
- [RiverOS Evidence Contracts V0.1](docs/integrations/riveros/CC-RIVEROS-EVIDENCE-CONTRACTS-V0.1.md)
- [Warden Policy Contracts V0.1](docs/integrations/warden/CC-WARDEN-POLICY-CONTRACTS-V0.1.md)
- [EmpireOS Licence Lifecycle V0.1](docs/integrations/empireos/CC-EMPIREOS-LICENCE-LIFECYCLE-V0.1.md)
- [Registry Schemas](schemas/README.md)
- [Registry Fixtures](examples/README.md)

## Governance principles

1. Sponsorship does not automatically constitute authorship.
2. Company ownership does not erase individual contribution.
3. A derivative creation must preserve lineage to its source records.
4. Claims must remain connected to evidence and limitations.
5. Sensitive source material may remain restricted while provenance and status remain discoverable.
6. A Warden decision is contextual and must remain connected to policy, actor, action, resource and obligations.
7. A proposed EmpireOS event does not change a licence.
8. A release gate does not substitute for legal, safety or regulatory approval.
9. A licence never substitutes for legally required certification, accreditation or registration.
10. Historical evidence and event history must not be silently overwritten.
11. A digest demonstrates change detection, not factual truth.
12. A signature assertion is not trusted until verified against approved authority and policy.

## Release status

The current documents, schemas, fixtures and prototype are controlled architecture baselines for review and conformance testing. They are not legal assignments, patent filings, copyright registrations, trusted digital certificates, production CAD or LIMS systems, scientific validations, access-control certifications, executed licences, regulated-product authorisations, clinical approvals or diagnostic validations.

## Next implementation layers

- trusted key and signer-authority registry;
- production signature verification, rotation and revocation;
- positive and negative schema and cryptographic conformance vectors;
- Synnergyze Asset Draft APIs and collaborative persistence;
- creator and creation registration workflows;
- Virtual Silk Road public and member discovery projections.
