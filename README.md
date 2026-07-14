# Creators Common

**Canonical release:** CC-CANON-V0.2  
**Schema release:** CC-SCHEMAS-V0.1  
**Fixture release:** CC-FIXTURES-V0.1  
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

Creators Common does **not** replace patent offices, copyright systems, universities, professional bodies, laboratories, standards organisations or regulatory authorities. It provides the operational provenance layer that connects creators, institutions, evidence, products, licences and authorised uses throughout the creation lifecycle.

## Institutional architecture

| Layer | Responsibility |
|---|---|
| **Believers Common** | Constitutional governance, ethics, custodianship, dispute resolution and public-interest safeguards |
| **Creators Common** | Creator identity, contribution records, creation registration, provenance, attribution, licensing instructions and economic participation |
| **DigitalMe** | Portable identity for creators, reviewers, operators and institutions |
| **Synnergyze** | Registry infrastructure, workflow orchestration, integrations, usage metering and royalty accounting |
| **RiverOS** | Evidence capture, timestamps, test records, audit trails and change history |
| **Warden** | Permission enforcement, safety gates, restricted-use controls, suspension and exception handling |
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

## Machine-readable registry contracts

The first JSON Schema Draft 2020-12 contracts are included under [`schemas/`](schemas/):

- [Creator Passport schema](schemas/creator-passport.schema.json)
- [Creation Passport schema](schemas/creation-passport.schema.json)
- [Contribution Record schema](schemas/contribution-record.schema.json)
- [Licence Record schema](schemas/licence-record.schema.json)
- [Schema architecture and implementation notes](schemas/README.md)

These schemas establish structural contracts for registry services. Schema conformance does not by itself establish authorship, ownership, scientific validity, safety, regulatory status or legal enforceability.

## Conformance fixtures and validation

A synthetic, cross-linked record set is included under [`examples/records/`](examples/records/):

- [Creator Passport fixture](examples/records/creator-passport.sample.json)
- [qPCR Creation Passport fixture](examples/records/creation-passport.qpcr-programme.sample.json)
- [Contribution Record fixture](examples/records/contribution-record.sample.json)
- [Research Licence Record fixture](examples/records/licence-record.research.sample.json)
- [Fixture policy](examples/README.md)

The repository validator at [`tools/validate_registry.py`](tools/validate_registry.py):

1. validates every governed schema against JSON Schema Draft 2020-12;
2. checks schema `$id` uniqueness;
3. validates every example record with format checking enabled;
4. rejects duplicate governed record identifiers; and
5. verifies local cross-references between the linked Creator, Creation, Contribution and Licence records.

The root workflow at [`.github/workflows/validate-registry.yml`](.github/workflows/validate-registry.yml) is configured to execute these checks for relevant pull requests and branch updates. A successful workflow run is required before this baseline should be marked ready for merge.

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
- [Registry Schemas V0.1](schemas/README.md)
- [Registry Fixtures V0.1](examples/README.md)

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

## Release status

CC-CANON-V0.2, CC-SCHEMAS-V0.1 and CC-FIXTURES-V0.1 are initial controlled architecture baselines. They are suitable for repository design, data-model development, programme formation, governance review, schema-conformance testing and prototype implementation. They are not, by themselves, legal assignments, patent filings, copyright registrations, regulated-product authorisations, clinical approvals or diagnostic validations.

## Repository direction

### Implemented in the current baseline

- canonical governance architecture;
- creator and creation passport schemas;
- contribution and licence record schemas;
- first discipline programme for qPCR and molecular sciences;
- synthetic linked registry fixtures;
- automated schema, identifier and cross-reference validation;
- repository-level GitHub Actions workflow;
- public discovery landing page.

### Next implementation layers

- signed record envelopes and canonical content-hash rules;
- RiverOS evidence-event and retention contracts;
- Warden policy-decision and restricted-access contracts;
- EmpireOS licence issuance and lifecycle events;
- positive and negative conformance test suites;
- guild and programme templates;
- creator and creation registration workflows;
- Synnergyze registry APIs and Virtual Silk Road discovery projections.
