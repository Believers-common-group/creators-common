# Creators Common Asset Lab

**Document ID:** CC-ASSET-LAB-PRD-001  
**Release:** V0.1-R0  
**Status:** Controlled product baseline for review  
**Parent authority:** CC-CANON-V0.2

## 1. Product definition

Creators Common Asset Lab is the governed authoring workspace through which creators define, assemble, compare, test and prepare assets for registration as controlled Creation Passports.

The workspace takes interaction inspiration from material-exploration and composition workbenches, including the referenced OpenAI Material Lab study, but it is not represented as an OpenAI product integration, endorsement or pixel-identical reproduction. Its distinguishing function is the Creators Common governance chain: Creator Passport, Contribution Record, RiverOS evidence, Warden decision, EmpireOS licence and Virtual Silk Road publication.

## 2. Product objective

Asset Lab must allow a creator to move from an editable brief to a governed release without collapsing design, evidence, authorship, ownership, safety and permission into one undifferentiated record.

The product shall answer:

- What is being created?
- Which components, materials, processes and variants define it?
- Who performed each contribution?
- Which claims are supported, rejected or still provisional?
- Which evidence supports each decision?
- Which safety, regulatory, rights and licence gates remain open?
- Which controlled version may be released?

## 3. Institutional chain

| Layer | Asset Lab responsibility |
|---|---|
| Creators Common | Creation identity, contribution, provenance and rights registry |
| DigitalMe | Creator, reviewer, operator and institutional identity |
| Synnergyze | Workspace services, registry APIs, collaboration and release orchestration |
| RiverOS | Evidence events, source files, tests, decisions, timestamps and retention |
| Warden | Policy, safety, restricted-access and release decisions |
| EmpireOS | Licence issuance, amendment, suspension and termination |
| Virtual Silk Road | Discovery, collaboration, authorised distribution and network use |

## 4. Primary users

- originating creators and co-creators;
- material, product, apparel, molecular, electronics and software designers;
- process and manufacturing engineers;
- laboratory and validation operators;
- domain reviewers and safety authorities;
- sponsors, custodians and commercial operators;
- affiliated factory, laboratory and network nodes.

## 5. V0.1 creation laboratories

V0.1 supports three principal creation modes:

1. Material specification and process development;
2. Physical product and assembly development;
3. Research-use qPCR assay and molecular workflow development.

The common data model must remain extensible to apparel, electronics, software, media and organisational assets.

## 6. Workspace layout

Asset Lab uses five coordinated regions:

1. **Asset Header** — asset name, version, lifecycle stage, status, save, review and release controls.
2. **Asset Tree** — components, materials, processes, variants, requirements, claims, tests and licences.
3. **Creation Canvas** — graph, table, two-dimensional, three-dimensional, workflow, board or document view.
4. **Property Inspector** — controlled technical, commercial, safety, circularity and rights attributes.
5. **Evidence Dock** — RiverOS evidence, contributors, versions, tests, Warden decisions and review comments.

## 7. Core objects

| Object | Identifier | Purpose |
|---|---|---|
| Asset Draft | `CC-AD` | Editable workspace before Creation Passport release |
| Asset Component | `CC-AC` | Part, assembly, panel, material layer or logical module |
| Material Specification | `CC-MS` | Composition, grade, properties, hazards and circularity |
| Process Recipe | `CC-PR` | Ordered production, laboratory or computational process |
| Asset Variant | `CC-AV` | Controlled experimental or design alternative |
| Validation Run | `CC-VR` | Test execution, measurements, criteria and disposition |
| Creation Claim | `CC-CL` | Bounded claim linked to evidence and validation |
| Release Gate | `CC-RG` | Controlled lifecycle advancement decision |

## 8. Universal creation flow

```text
Create brief
  -> select laboratory
  -> define requirements
  -> add components and materials
  -> configure process
  -> create variants
  -> prototype or test
  -> attach RiverOS evidence
  -> record contributions
  -> assess claims
  -> complete Warden and rights checks
  -> pass release gate
  -> create or update Creation Passport
  -> issue EmpireOS licence
  -> publish authorised projection to Virtual Silk Road
```

## 9. Functional requirements

### 9.1 Asset drafting

The system shall create a permanent Asset Draft identifier while allowing controlled draft versions. Draft changes must preserve authorship and time history.

### 9.2 Component and material definition

The system shall support nested components, quantities, tolerances, material assignments, interfaces, approved suppliers and process references.

### 9.3 Variant management

A variant shall declare its base, objective and explicit change set. A rejected variant must remain available as historical evidence and must not silently disappear.

### 9.4 Claims and validation

A claim shall remain provisional until its supporting Validation Runs and evidence are accepted. Validation failure must be able to reject or narrow a claim without deleting the underlying run.

### 9.5 Contribution attribution

Material selection, geometry, process definition, software logic, assay design, test execution, review, funding and ownership must be representable as distinct roles and records.

### 9.6 Release gates

Lifecycle advancement shall require configured checks covering identity, contribution, technical definition, evidence, validation, safety, regulation, rights, licensing, manufacturing, circularity and retention.

### 9.7 Controlled conversion

An approved Asset Draft may be converted into a new Creation Passport or a new controlled version of an existing Creation Passport. The conversion event must preserve links to all source records.

## 10. AI assistance boundaries

AI may:

- convert briefs into candidate requirements;
- suggest materials and process alternatives;
- identify missing fields, incompatibilities and evidence gaps;
- compare variants and draft test plans;
- prepare candidate Creation Passport fields;
- estimate cost, carbon and circularity where the assumptions are visible.

AI shall not independently declare:

- creator identity or authorship;
- ownership or legal assignment;
- scientific validation;
- safety acceptance;
- regulated approval;
- final licence authority;
- final Warden release decision.

## 11. Non-functional requirements

- Every governed mutation must be attributable and timestamped.
- Restricted fields must support field-level access decisions.
- Evidence references must support content hashes and retention policies.
- The workspace must remain usable on desktop and tablet widths.
- The public discovery projection must exclude confidential source details.
- Schemas must use JSON Schema Draft 2020-12.
- Decimal measurements in digest-bound fixtures must use normalized strings under `CC-CJSON-0.1`.

## 12. V0.1 acceptance criteria

V0.1 is acceptable for architecture review when:

- all eight Asset Lab schemas validate;
- a linked material-asset fixture validates;
- the repository validator resolves all local Asset Lab references;
- the static dashboard prototype exposes the five-region workspace;
- the release gate visibly distinguishes draft, test, review and governed release;
- no synthetic fixture is represented as real evidence or legal permission.

## 13. Controlled limitations

This release is a product and data-contract baseline. It is not a production CAD system, laboratory information management system, regulatory submission platform, intellectual-property registration, legal agreement, scientific validation or safety approval.
