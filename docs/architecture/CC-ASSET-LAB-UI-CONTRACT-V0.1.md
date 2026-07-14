# Creators Common Asset Lab UI Contract

**Document ID:** CC-ASSET-LAB-UI-001  
**Release:** V0.1-R0  
**Status:** Controlled interaction architecture for review

## 1. Shell

```text
Creators Common
├── Home
├── Create
│   └── Asset Lab
├── Assets
├── Creators
├── Evidence
├── Rights
├── Licences
├── Network
└── Governance
```

Asset Lab is the authoring surface. The existing Creators Common schemas and services remain the system of record.

## 2. Five-region workspace

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Asset name | Draft version | Stage | Save | Request review | Release gate  │
├────────────────┬─────────────────────────────────────┬──────────────────────┤
│ Asset tree     │ Creation canvas                     │ Property inspector   │
│                │                                     │                      │
│ Requirements   │ Material / product / molecular      │ Technical            │
│ Components     │ graph, table, 2D, 3D or workflow    │ Process              │
│ Materials      │                                     │ Cost                 │
│ Processes      │                                     │ Circularity          │
│ Variants       │                                     │ Safety and rights    │
├────────────────┴─────────────────────────────────────┴──────────────────────┤
│ Evidence | Contributions | Versions | Tests | Claims | Warden | Comments   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3. Component contract

```text
AssetLabShell
├── GlobalNavigation
├── AssetHeader
│   ├── AssetIdentity
│   ├── DraftStatus
│   ├── LifecycleStage
│   ├── SaveControl
│   ├── ReviewControl
│   └── ReleaseGateControl
├── AssetTree
│   ├── RequirementNode
│   ├── ComponentNode
│   ├── MaterialNode
│   ├── ProcessNode
│   ├── VariantNode
│   ├── ValidationNode
│   ├── ClaimNode
│   └── LicenceNode
├── CreationCanvas
│   ├── GraphCanvas
│   ├── TableCanvas
│   ├── TwoDimensionalCanvas
│   ├── ThreeDimensionalCanvas
│   ├── WorkflowCanvas
│   └── DocumentCanvas
├── PropertyInspector
│   ├── TechnicalProperties
│   ├── ProcessParameters
│   ├── CostAndCommercial
│   ├── Circularity
│   ├── SafetyAndRegulation
│   ├── RightsAndVisibility
│   └── SchemaValidation
└── EvidenceDock
    ├── RiverOSEvents
    ├── ContributionTimeline
    ├── VersionHistory
    ├── ValidationRuns
    ├── CreationClaims
    ├── WardenDecisions
    └── ReviewComments
```

## 4. View-state rules

- Selecting a tree node changes the canvas focus and property inspector without changing the active Asset Draft.
- Unsaved local edits must be visually distinct from a saved draft version.
- A new variant must branch from an explicit base and show its change set.
- A claim must show its evidence state: no evidence, evidence attached, tested, verified, validated, rejected or disputed.
- A release gate must show blocking, conditional and non-applicable checks separately.
- Confidential fields must render a Warden access decision rather than silently hiding their existence.

## 5. Material Lab mode

Material Lab mode shall expose:

- material family, grade and composition;
- physical, mechanical, thermal, electrical, chemical or biological properties;
- source type and recycled content;
- supplier declarations and test methods;
- hazard and restricted-use classifications;
- process recipe graph;
- waste and recovery outputs;
- variant comparison matrix;
- validation result overlay.

## 6. Product Lab mode

Product Lab mode shall expose:

- assembly and component hierarchy;
- material assignment;
- interfaces and tolerances;
- process and supplier eligibility;
- requirements traceability;
- variant and cost comparison;
- manufacturing and circularity gates.

## 7. Molecular Lab mode

Molecular Lab mode shall expose, subject to restricted-field policy:

- research target and assay purpose;
- primer, probe and control references;
- extraction and thermal workflow;
- reagent and instrument compatibility;
- validation runs and performance claims;
- research-use restrictions and diagnostic-use prohibition;
- laboratory and reviewer contributions.

## 8. Primary commands

| Command | Result |
|---|---|
| Save draft | Creates a controlled draft version and evidence event |
| Add component | Creates `CC-AC` record linked to the draft |
| Add material | Creates or links `CC-MS` record |
| Add process | Creates `CC-PR` record |
| Create variant | Creates `CC-AV` branch with explicit changes |
| Start validation | Creates `CC-VR` execution record |
| Add claim | Creates `CC-CL` bounded claim |
| Request review | Creates contribution and RiverOS review events |
| Open release gate | Creates `CC-RG` check set |
| Convert to Creation Passport | Creates or versions `CC-CP` after gate approval |

## 9. Status language

The interface must not use “approved” as a generic success label. It must identify what was approved:

- draft approved for testing;
- validation result accepted;
- claim verified;
- safety gate passed;
- licence issued;
- Creation Passport released.

## 10. Accessibility and responsive behaviour

- Full five-region view at desktop widths.
- Collapsible tree and inspector on tablet widths.
- Single-panel navigation with persistent status header on mobile widths.
- Keyboard-accessible tree, tabs and release controls.
- Text labels must accompany colour and icon status cues.
- Evidence and restrictions must remain understandable without animation.

## 11. Data-service boundaries

```text
Asset Lab UI
  -> Synnergyze Asset Draft Service
  -> Creators Common Registry Service
  -> RiverOS Evidence Service
  -> Warden Policy Decision Service
  -> EmpireOS Licence Service
  -> Virtual Silk Road Projection Service
```

The UI may cache draft state. It must not become the authoritative evidence, identity or licence store.
