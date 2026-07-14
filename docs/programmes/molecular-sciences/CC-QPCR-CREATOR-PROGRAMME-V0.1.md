# Creators Common qPCR Creator Programme

**Document ID:** CC-MS-QPCR-001  
**Release:** V0.1-R0  
**Status:** Controlled programme baseline for review  
**Parent authority:** Creators Common Canon V0.2  
**Guild:** Molecular Sciences Guild  
**Initial use classification:** Research use and other lawfully permitted non-diagnostic applications  

## 0. Release disposition

This document establishes the first discipline-level implementation of Creators Common.

It is suitable for:

- registering qPCR creators and contributions;
- defining assay and platform Creation Passports;
- structuring research-use assay development;
- governing evidence, versions, licences and laboratory-node use;
- designing software, data and instrument-integration requirements;
- preparing pilot laboratory and assay-foundry programmes.

It is not, by itself:

- a clinical or diagnostic protocol;
- a regulated-product authorisation;
- laboratory accreditation;
- proof of analytical or clinical performance;
- permission to handle biological materials without the required facilities, biosafety controls and approvals.

## 1. Programme purpose

The qPCR Creator Programme makes molecular creation attributable, reproducible, evidence-linked and licensable.

It governs the chain:

> research need → target definition → assay design → prototype → optimisation → analytical verification → intended-use validation → controlled release → licensed laboratory use → evidence return → improvement → preservation

The programme treats qPCR as a complete measurement system rather than only a thermal-cycling instrument:

> sample → nucleic-acid preparation → assay chemistry → thermal control → fluorescence measurement → quantitative analysis → review → report → evidence archive

## 2. Why qPCR is the first Molecular Sciences programme

qPCR is suited to a first implementation because it combines:

- clearly identifiable scientific and engineering contributions;
- controlled assay versions;
- measurable performance parameters;
- repeatable laboratory workflows;
- instrument-generated raw evidence;
- defined controls and acceptance criteria;
- compatibility with distributed laboratory nodes;
- complementary use with endpoint PCR, digital PCR and sequencing.

qPCR is particularly effective when a target is known and must be measured rapidly across multiple samples. Digital PCR may provide higher-precision absolute quantification for selected applications, while sequencing supports broad discovery and characterisation. The programme therefore treats these methods as complementary rather than institutionally competing.

## 3. Registrable qPCR creations

### 3.1 Assay creations

- forward and reverse primer sets;
- hydrolysis or other sequence-specific probes;
- DNA-binding-dye assays;
- singleplex assays;
- multiplex panels;
- reference-gene panels;
- internal amplification controls;
- positive controls and standards;
- no-template and process-control designs;
- standard-curve materials;
- copy-number and expression-analysis methods.

### 3.2 Process creations

- sample receipt and accession workflows;
- nucleic-acid extraction protocols;
- DNase and contamination-control methods;
- reverse-transcription workflows;
- master-mix preparation methods;
- plate-layout rules;
- thermal protocols;
- baseline and threshold analysis policies;
- repeat, rejection and invalid-run rules;
- cleaning and contamination-control systems.

### 3.3 Reagent creations

- polymerase and master-mix formulations;
- primers and probes;
- reference dyes;
- buffers and stabilisers;
- extraction reagents;
- calibration and reference materials;
- lyophilised or room-temperature-stable kits;
- control materials.

### 3.4 Hardware creations

- thermal blocks and temperature-control systems;
- optical excitation and detection modules;
- sample holders, plates, tubes and cartridges;
- liquid-handling and pipetting systems;
- extraction instruments;
- plate sealing and centrifugation systems;
- cold-chain and reagent-storage modules;
- embedded control electronics;
- calibration fixtures and test equipment.

### 3.5 Software creations

- plate designers;
- instrument connectors;
- raw-fluorescence importers;
- baseline and threshold algorithms;
- standard-curve and efficiency calculators;
- relative-quantification engines;
- multiplex channel configuration;
- curve-shape and outlier analysis;
- QC rule engines;
- laboratory information systems;
- evidence, report and audit modules;
- inventory, calibration and maintenance systems.

### 3.6 Organisational creations

- laboratory layouts;
- one-way clean-to-dirty workflows;
- training programmes;
- proficiency-testing programmes;
- assay-foundry operating models;
- distributed laboratory-node systems;
- quality and review frameworks;
- research-product and service models.

## 4. Recognised creator and contributor roles

A qPCR creation may recognise:

- originating molecular creator;
- target and sequence researcher;
- primer designer;
- probe designer;
- assay-development scientist;
- extraction-method creator;
- reverse-transcription specialist;
- reagent-formulation creator;
- thermal-systems engineer;
- optical-systems engineer;
- electronics and embedded-systems engineer;
- mechanical or fluidic-systems engineer;
- automation engineer;
- analysis-software creator;
- bioinformatics creator;
- laboratory-architecture creator;
- validation scientist;
- quality reviewer;
- biosafety reviewer;
- manufacturing contributor;
- reference-material provider;
- institutional sponsor;
- funding sponsor;
- laboratory operator;
- programme custodian;
- improvement or derivative creator.

The programme shall not collapse these roles into a single corporate or project-level authorship claim.

## 5. qPCR Creation Passport

Every controlled assay, panel, instrument, process or software component should receive a permanent Creation ID.

Example:

`CC-MS-QPCR-ASSAY-000001-V1.0`

### 5.1 Scientific identity

For an assay, the passport should record:

- assay name;
- target identity and target region;
- intended research purpose;
- sample matrices;
- primer identifiers and controlled sequence references;
- probe identifier, reporter and quencher where applicable;
- amplicon length;
- dye-based or probe-based chemistry;
- singleplex or multiplex configuration;
- reference gene or normaliser where applicable;
- control architecture;
- known inclusivity and exclusivity boundaries.

Protected sequences may remain confidential or restricted while identity, ownership, maturity and validation status remain discoverable.

### 5.2 Reaction identity

The passport should record:

- reaction volume;
- master mix and reagent versions;
- primer and probe concentrations;
- template-input range;
- denaturation, annealing and extension parameters;
- number of cycles;
- reverse-transcription requirements;
- instrument and optical-channel compatibility;
- plate or consumable format;
- baseline and threshold analysis method;
- replicate requirements.

### 5.3 Performance identity

Performance fields may include:

- amplification efficiency;
- standard-curve slope;
- correlation coefficient;
- dynamic range;
- analytical specificity;
- repeatability;
- reproducibility;
- precision;
- detection limit;
- quantification limit where applicable;
- robustness;
- inhibition tolerance;
- matrix effects;
- inter-operator and inter-instrument performance;
- multiplex-versus-singleplex equivalence.

A theoretically ideal doubling reaction corresponds to a standard-curve slope near -3.32. A commonly used preliminary efficiency review range is approximately 90–110%, but the programme shall require application-specific acceptance criteria and evidence rather than treating this range as universal proof of validity.

### 5.4 Control identity

The passport shall specify required controls, which may include:

- no-template control;
- positive amplification control;
- extraction negative control;
- extraction positive control;
- no-reverse-transcription control;
- internal amplification control;
- reference gene;
- calibrator;
- standard series;
- contamination-monitoring controls.

Each control shall have defined acceptance, warning, repeat and invalidation rules.

### 5.5 Legal, safety and commercial identity

The passport should record:

- originating creators;
- contributors and roles;
- owner and custodian;
- sponsor;
- manufacturer;
- approved laboratory operators;
- use classification;
- territory and field of use;
- licence family;
- economic allocation;
- biosafety and access classification;
- status: draft, active, superseded, suspended, withdrawn or preserved.

## 6. Preliminary assay-design guidance

The following values may be used as preliminary design guidance, not automatic validation criteria:

- primer length commonly around 18–24 nucleotides;
- amplicon size commonly around 50–150 base pairs;
- GC content often targeted near 50%;
- closely matched primer melting temperatures;
- avoidance of primer-dimers, strong secondary structure and long homopolymer runs;
- for RNA expression work, exon-junction strategies where appropriate to reduce genomic-DNA amplification.

Every assay shall still require target-specific design review, empirical optimisation and evidence.

## 7. Fluorescence-chemistry classification

### 7.1 Probe-based assays

Probe-based assays use a sequence-specific probe in addition to primers. The additional recognition event can provide higher analytical specificity and enables multiplexing through distinct optical labels.

The Creation Passport shall identify:

- probe sequence reference;
- reporter;
- quencher;
- channel;
- instrument compatibility;
- cross-reactivity and spectral-overlap review;
- multiplex interaction evidence.

### 7.2 DNA-binding-dye assays

DNA-binding dyes report double-stranded DNA and may detect target products, nonspecific products and primer-dimers.

The Creation Passport shall therefore specify:

- melt-curve requirements;
- expected melt profile;
- nonspecific-product acceptance rules;
- no-template control interpretation;
- restrictions on claims of specificity.

### 7.3 Passive reference dyes

Where a passive reference such as ROX is used, the record shall identify:

- dye and concentration class;
- master-mix compatibility;
- instrument requirement;
- normalisation method;
- exceptions for systems that do not use passive referencing.

## 8. Quantification classifications

### 8.1 Absolute quantification

Absolute qPCR uses a standard curve with assigned target quantities. The passport should document:

- standard material identity and traceability;
- concentration-assignment method;
- dilution preparation;
- replicate structure;
- linear range;
- interpolation rules;
- result units;
- uncertainty and limitations.

An "absolute" result remains dependent on the assigned standard and measurement chain.

### 8.2 Relative quantification

Relative expression analysis may use:

- Delta Ct for target-to-reference normalisation;
- Delta Delta Ct for sample-to-calibrator comparison;
- fold change calculated as 2^(-Delta Delta Ct) where the equal-efficiency assumption is justified.

The passport shall document:

- target and reference assays;
- reference-gene stability evidence;
- calibrator identity;
- efficiency comparison;
- exclusion and outlier rules;
- interpretation boundaries.

A commonly used housekeeping gene shall not be presumed stable without evidence for the actual tissue, treatment and experimental context.

## 9. Maturity gates for qPCR creations

### C0 — Research need registered

- target or measurement need defined;
- originating creator recorded;
- intended use and use classification stated.

### C1 — Assay concept defined

- target region selected;
- preliminary primer/probe design completed;
- controls and sample matrices proposed;
- biosafety and misuse review initiated.

### C2 — Laboratory prototype

- initial amplification demonstrated;
- raw amplification and melt data preserved;
- prototype protocol recorded;
- known limitations documented.

### C3 — Analytically verified

- expected product or signal behaviour demonstrated;
- efficiency and linearity reviewed;
- controls perform under defined conditions;
- preliminary specificity and repeatability established.

### C4 — Intended-use validated

- sample matrices and intended users defined;
- analytical sensitivity and specificity bounded;
- detection and quantification limits established where relevant;
- repeatability, reproducibility, robustness and inhibition effects assessed;
- acceptance criteria approved by the designated validation authority.

### C5 — Production-ready

- controlled assay specification released;
- reagent and supplier controls established;
- lot-release and stability programme defined;
- packaging, labelling and instructions completed;
- software and instrument compatibility frozen for the release.

### C6 — Licensed laboratory deployment

- laboratory node approved;
- operators trained and authorised;
- instruments and calibrations registered;
- evidence-return rules active;
- deviations, repeats and invalid runs centrally traceable.

### C7 — Network assay

- performance monitored across multiple nodes;
- inter-laboratory comparability established;
- common data schema and QC gates active;
- local modifications prohibited unless separately versioned.

### C8 — Preserved assay

- source designs, sequences, protocols, validation and software archived;
- reference materials and dependencies documented;
- custodian and continuity pathway assigned.

## 10. Laboratory-node architecture

An affiliated qPCR laboratory node should maintain one-way workflow:

> sample receipt → extraction → clean master-mix preparation → template addition → amplification → analysis → evidence archive

Recommended functional zones include:

1. sample receipt, accession and storage;
2. sample preparation and extraction;
3. clean reagent and master-mix preparation;
4. template addition and plate sealing;
5. instrument operation and primary analysis;
6. physically separated post-PCR work where amplified products must be opened.

Node records should include:

- laboratory identity;
- rooms and workflow map;
- instrument inventory;
- pipette and equipment calibration;
- environmental and storage monitoring;
- operator authorisations;
- approved assay versions;
- reagent and consumable lots;
- contamination events;
- maintenance, deviations and corrective actions.

## 11. Molecular Evidence Node

The recommended first Synnergyze implementation is a **Molecular Evidence Node** connecting:

- Sample Passport;
- Creator Passport;
- qPCR Creation Passport;
- assay registry;
- extraction batch;
- plate map;
- reagent and consumable lots;
- operator identity;
- instrument and software version;
- raw fluorescence and melt data;
- baseline and threshold settings;
- Ct or Cq values;
- standard curves and efficiency;
- control outcomes;
- deviations and repeat decisions;
- reviewer authorisation;
- final report and audit history.

RiverOS should preserve the evidence history. Warden should enforce role, safety and licence gates. EmpireOS should issue laboratory, assay and network-use licences. The Virtual Silk Road may provide controlled discovery, supply, collaboration and service access.

## 12. Automated QC engine

A governed QC engine may flag:

- no-template control amplification;
- positive-control failure;
- extraction-control failure;
- replicate divergence;
- poor standard-curve fit;
- efficiency outside the assay-specific range;
- abnormal amplification-curve shape;
- multiple or unexpected melt peaks;
- internal-control delay;
- inhibition patterns;
- edge-well evaporation patterns;
- unexpected cross-channel signal;
- assay-version or reagent-lot mismatch.

Automated flags support review but do not independently convert a result into a clinical or diagnostic conclusion.

## 13. AI boundaries

AI may support:

- plate-layout optimisation;
- curve anomaly detection;
- replicate and control review;
- troubleshooting suggestions;
- SOP guidance;
- inventory and maintenance forecasting;
- draft report preparation;
- search across controlled evidence.

AI shall not independently:

- authorise a failed run;
- conceal control failures;
- change a controlled threshold or protocol without a recorded decision;
- issue a regulated or diagnostic interpretation without the applicable authorised process;
- fabricate missing evidence or infer validation that has not occurred.

## 14. Programme licence classes

The programme may use:

- **CC-QPCR Open Research** — attribution-based, non-commercial research use;
- **CC-QPCR Research Commercial** — contract and industrial research use;
- **CC-QPCR Manufacturing** — controlled production of assay kits, instruments or components;
- **CC-QPCR Laboratory Deployment** — execution at approved laboratory nodes;
- **CC-QPCR Network** — use across affiliated nodes with common evidence requirements;
- **CC-QPCR Derivative** — controlled modification with preserved lineage;
- **CC-QPCR Restricted** — sensitive, dual-use, confidential, regulated or otherwise controlled work.

Every licence shall define the exact asset, version, field of use, territory, users, volume, evidence duties, restrictions, economic allocation and suspension rules.

## 15. Economic participation

Possible economic participants include:

- assay and method creators;
- primer and probe designers;
- validation laboratories;
- reference-material providers;
- sponsors;
- reagent and instrument manufacturers;
- software and evidence-platform operators;
- licensed testing laboratories;
- distributors and service operators;
- programme and preservation funds;
- improvement and derivative creators.

Allocation shall be creation-specific. No universal royalty percentage is imposed by this baseline.

## 16. First implementation backlog

### Phase 0 — Registry architecture

- qPCR Creation Passport schema;
- Creator and Contribution Record linkage;
- assay-version and evidence model;
- use-classification and licence model;
- controlled terminology.

### Phase 1 — Single-assay pilot

- one research-use assay;
- one sample matrix;
- one extraction method;
- one 96-well instrument;
- controlled plate map;
- raw-data import;
- manual reviewer approval.

### Phase 2 — Laboratory operations

- barcode sample identity;
- extraction-batch records;
- reagent and calibration inventory;
- automated control gates;
- report and audit generation.

### Phase 3 — Assay foundry

- creator onboarding;
- design and prototype workflow;
- validation package;
- Creation Passport issuance;
- manufacturing and laboratory licences;
- usage-linked creator participation.

### Phase 4 — Multiplex and automation

- multi-channel panels;
- automated extraction;
- liquid handling;
- spectral and cross-reactivity controls;
- higher-throughput node operation.

### Phase 5 — Distributed network

- multiple laboratory nodes;
- inter-laboratory comparability;
- common QC engine;
- proficiency monitoring;
- network evidence and controlled distribution.

## 17. Technical baseline reference

The initial educational baseline for qPCR concepts used in forming this programme is:

- Thermo Fisher Scientific, *30 Years of qPCR Innovation: Advancing Science Together*.

The baseline covers real-time amplification, Ct interpretation, primer and assay design, probes and DNA-binding dyes, passive reference dyes, standard curves, PCR efficiency, absolute and relative quantification, multiplexing, controls, experimental design, troubleshooting, applications and system selection.

The source is educational and marked for research use only. Programme validation requirements must be independently defined for each creation and intended use.

## 18. Programme statement

> **The qPCR Creator Programme ensures that every assay, protocol, reagent, instrument, algorithm and laboratory use remains connected to its creators, controlled version, evidence, licence, limitations and continuing responsibilities.**
