# Creators Common

**Canonical release:** CC-CANON-V0.2  
**Schema release:** CC-SCHEMAS-V0.2  
**Fixture release:** CC-FIXTURES-V0.2  
**Integrity architecture:** CC-SIGNED-ENVELOPES-V0.1  
**Evidence architecture:** CC-RIVEROS-EVIDENCE-CONTRACTS-V0.1  
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
- Under what conditions may it be reproduced, manufactured, modified, deployed or distributed?

Creators Common does **not** replace patent offices, copyright systems, universities, professional bodies, laboratories, standards organisations or regulatory authorities. It provides the operational provenance layer connecting creators, institutions, evidence, products, licences and authorised uses throughout the creation lifecycle.

## Institutional architecture

| Layer | Responsibility |
|---|---|
| **Believers Common** | Constitutional governance, ethics, custodianship, dispute resolution and public-interest safeguards |
| **Creators Common** | Creator identity, contribution records, creation registration, provenance, attribution, licensing instructions and economic participation |
| **DigitalMe** | Portable identity for creators, reviewers, operators and institutions |
| **Synnergyze** | Registry infrastructure, workflow orchestration, integrations, usage metering and royalty accounting |
| **RiverOS** | Evidence events, timestamps, artefact digests, event chains, retention and disposition records |
| **Warden** | Permission enforcement, safety gates, signer authority, restricted-use controls, suspension and exception handling |
| **EmpireOS** | Issuance and lifecycle control of governed licences and affiliations |
| **Virtual Silk Road** | Discovery, collaboration, controlled distribution, manufacturing access and commercial exchange |

## Core registry objects

### Creator Passport

A portable identity record for a person or institution, including verified capabilities, affiliations, registered contributions, reviewer roles, licences, training and a portfolio of evidence-backed work.

### Creation Passport

The controlled identity of a product, method, system, design, protocol, dataset, work or organisational model. It records creators, ownership, purpose, technical definition, evidence, maturity, version, licences, restrictions, economic allocations and derivative lineage.

### Contribution Record

A precise record of what each contributor did, when the work occurred, what evidence supports the contribution, and what attribution or economic rights were agreed.

### Licence Record

A machine-readable and human-readable statement of permitted users, territory, duration, field of use, volume limits, evidence obligations, royalties, derivative rights, suspension conditions and prohibited uses.

### Signed Record Envelope

A controlled envelope binding a governed record version to deterministic canonical bytes, a SHA-256 digest and one or more signature assertions.

### RiverOS Evidence Event

A timestamped record connecting an actor, governed subjects, evidence artefacts, policy decisions, retention duties and event-chain references.

### RiverOS Retention Policy

A governed policy defining evidence categories, retention triggers, review periods, legal holds and end-of-retention disposition.

## Machine-readable contracts

The JSON Schema Draft 2020-12 contracts under [`schemas/`](schemas/) now cover seven record families:

- [Creator Passport](schemas/creator-passport.schema.json)
- [Creation Passport](schemas/creation-passport.schema.json)
- [Contribution Record](schemas/contribution-record.schema.json)
- [Licence Record](schemas/licence-record.schema.json)
- [Signed Record Envelope](schemas/record-envelope.schema.json)
- [RiverOS Evidence Event](schemas/riveros-evidence-event.schema.json)
- [RiverOS Retention Policy](schemas/riveros-retention-policy.schema.json)
- [Schema architecture and implementation notes](schemas/README.md)

Schema conformance does not by itself establish authorship, ownership, scientific validity, safety, regulatory status, signature authority or legal enforceability.

## Integrity profile

The prototype signed-envelope flow uses `CC-CJSON-0.1`:

1. reject duplicate JSON keys and non-standard constants;
2. reject floating-point numbers in digest-bound payloads;
3. recursively sort object keys;
4. preserve array order;
5. serialize UTF-8 JSON without insignificant whitespace; and
6. calculate SHA-256 over the canonical bytes.

See [Signed Record Envelopes V0.1](docs/architecture/CC-SIGNED-ENVELOPES-V0.1.md).

The current signature fixture is synthetic and unverified. The repository does not claim that a production cryptographic signature has been created or verified.

## Conformance fixtures and validation

Synthetic, cross-linked fixtures are maintained under [`examples/`](examples/):

- [Creator Passport fixture](examples/records/creator-passport.sample.json)
- [qPCR Creation Passport fixture](examples/records/creation-passport.qpcr-programme.sample.json)
- [Contribution Record fixture](examples/records/contribution-record.sample.json)
- [Research Licence Record fixture](examples/records/licence-record.research.sample.json)
- [Signed Record Envelope fixture](examples/records/record-envelope.creation.sample.json)
- [RiverOS Evidence Event fixture](examples/riveros/evidence-event.sample.json)
- [RiverOS Retention Policy fixture](examples/riveros/evidence-retention-policy.sample.json)
- [Fixture policy](examples/README.md)

The validator at [`tools/validate_registry.py`](tools/validate_registry.py):

- validates all seven schemas;
- checks unique schema `$id` values;
- validates every JSON fixture with format checking;
- rejects duplicate governed identifiers;
- verifies local cross-record references;
- confirms envelope subject-to-payload consistency;
- recalculates CC-CJSON-0.1 SHA-256 digests;
- verifies local evidence artefact digests;
- rejects verified synthetic signatures; and
- requires an issued envelope to contain a verified signature.

The workflow at [`.github/workflows/validate-registry.yml`](.github/workflows/validate-registry.yml) is configured to run these checks for relevant pull requests and branch updates. A successful workflow run is required before this baseline should be marked ready for merge.

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

## What may be registered

Creators Common supports scientific, engineering, digital, design, cultural and organisational creations, including:

- assays, reagents, protocols, datasets and laboratory methods;
- machines, components, CAD, control systems and manufacturing processes;
- software, APIs, algorithms, AI models, schemas and digital workflows;
- product designs, apparel styles, artwork, media, architecture and publications;
- operating models, governance frameworks, standards, courses and community programmes.

A creation may contain registered sub-creations with different creators, owners, maturity levels and licence terms.

## Current controlled documents

- [Creators Common Canon V0.2](docs/canon/CC-CANON-V0.2.md)
- [qPCR Creator Programme V0.1](docs/programmes/molecular-sciences/CC-QPCR-CREATOR-PROGRAMME-V0.1.md)
- [Signed Record Envelopes V0.1](docs/architecture/CC-SIGNED-ENVELOPES-V0.1.md)
- [RiverOS Evidence Contracts V0.1](docs/integrations/riveros/CC-RIVEROS-EVIDENCE-CONTRACTS-V0.1.md)
- [Registry Schemas V0.2](schemas/README.md)
- [Registry Fixtures V0.2](examples/README.md)

## First programme: Molecular Sciences

The first discipline-level implementation is the **qPCR Creator Programme**, which applies the Creators Common model to assay design, primers, probes, reagents, extraction methods, instruments, laboratory processes, analysis software and validation evidence.

The programme is initially restricted to research-use and other lawfully permitted non-diagnostic applications unless a separate regulated pathway is completed.

## Governance principles

1. Sponsorship does not automatically constitute authorship.
2. Company ownership does not erase individual contribution.
3. A derivative creation must preserve lineage to its source records.
4. Scientific, technical and commercial claims must remain connected to evidence.
5. Sensitive source material may remain restricted while provenance and status remain discoverable.
6. A licence never substitutes for legally required approval, certification, accreditation or registration.
7. Creation records may be corrected through controlled change, but historical evidence must not be silently overwritten.
8. A digest demonstrates change detection, not factual truth.
9. A signature assertion is not trusted until verified against an approved key and policy.
10. Evidence deletion must remain connected to an authorised disposition record where required.

## Release status

CC-CANON-V0.2, CC-SCHEMAS-V0.2, CC-FIXTURES-V0.2, CC-SIGNED-ENVELOPES-V0.1 and CC-RIVEROS-EVIDENCE-CONTRACTS-V0.1 are controlled prototype baselines. They are suitable for repository design, data-model development, programme formation, governance review and conformance testing. They are not legal assignments, patent filings, copyright registrations, trusted digital certificates, regulated-product authorisations, clinical approvals or diagnostic validations.

## Repository direction

### Implemented in the current baseline

- canonical governance architecture;
- Creator, Creation, Contribution and Licence schemas;
- qPCR and Molecular Sciences programme baseline;
- synthetic linked registry fixtures;
- signed record envelope and canonical digest checks;
- RiverOS evidence-event and retention-policy contracts;
- automated schema, identifier, digest and cross-reference validation;
- repository-level GitHub Actions workflow;
- public discovery landing page.

### Next implementation layers

- trusted key and signer-authority registry;
- production signature verification and revocation;
- Warden policy-decision and restricted-access contracts;
- EmpireOS licence issuance and lifecycle events;
- positive and negative cryptographic conformance vectors;
- guild and programme templates;
- creator and creation registration workflows;
- Synnergyze registry APIs and Virtual Silk Road discovery projections.
