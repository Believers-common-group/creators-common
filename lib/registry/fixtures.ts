import type { CreatorRecord, ExecutionSurfaceRecord, ExperienceRecord, WorkRecord } from "./types";

export const creators: CreatorRecord[] = [
  {
    id: "EXAMPLE-CREATOR-001",
    slug: "spatial-storyteller",
    displayName: "Spatial Storyteller",
    category: "Interactive artist",
    summary: "Demonstration creator profile showing how public Works and Experiences can be projected without exposing private identity data.",
    workIds: ["EXAMPLE-WORK-001"],
    experienceIds: ["EXAMPLE-EXPERIENCE-001"],
    status: "Registered",
    isExample: true,
  },
  {
    id: "EXAMPLE-CREATOR-002",
    slug: "material-studio",
    displayName: "Material Studio",
    category: "Design collective",
    summary: "Demonstration collective exploring how a registered collection can become several execution-surface candidates.",
    workIds: ["EXAMPLE-WORK-002"],
    experienceIds: ["EXAMPLE-EXPERIENCE-002"],
    status: "Candidate",
    isExample: true,
  },
];

export const works: WorkRecord[] = [
  {
    id: "EXAMPLE-WORK-001",
    slug: "signal-garden",
    title: "Signal Garden",
    creatorId: "EXAMPLE-CREATOR-001",
    category: "Interactive installation",
    provenanceState: "Registered",
    summary: "Example Work used to demonstrate provenance-aware publication. No legal ownership claim is inferred from this fixture.",
    experienceIds: ["EXAMPLE-EXPERIENCE-001"],
    isExample: true,
  },
  {
    id: "EXAMPLE-WORK-002",
    slug: "woven-futures",
    title: "Woven Futures",
    creatorId: "EXAMPLE-CREATOR-002",
    category: "Digital collection",
    provenanceState: "Candidate",
    summary: "Example collection illustrating how source material can be packaged for multiple runtime targets.",
    experienceIds: ["EXAMPLE-EXPERIENCE-002"],
    isExample: true,
  },
];

export const executionSurfaces: ExecutionSurfaceRecord[] = [
  { id: "EXAMPLE-SURFACE-VRCHAT", provider: "VRChat", state: "Candidate", label: "VRChat reference runtime", isExample: true },
  { id: "EXAMPLE-SURFACE-WEB", provider: "Web", state: "Planned", label: "Web experience target", isExample: true },
  { id: "EXAMPLE-SURFACE-VSR", provider: "VSR", state: "Planned", label: "VSR Room target", isExample: true },
];

export const experiences: ExperienceRecord[] = [
  {
    id: "EXAMPLE-EXPERIENCE-001",
    slug: "signal-garden-room",
    name: "Signal Garden Room",
    creatorId: "EXAMPLE-CREATOR-001",
    workIds: ["EXAMPLE-WORK-001"],
    packageState: "Candidate",
    publicationState: "Candidate",
    surfaces: ["EXAMPLE-SURFACE-VRCHAT", "EXAMPLE-SURFACE-WEB"],
    summary: "Example Experience Package showing one Work projected toward VRChat and Web without claiming an operational adapter.",
    isExample: true,
  },
  {
    id: "EXAMPLE-EXPERIENCE-002",
    slug: "woven-futures-showcase",
    name: "Woven Futures Showcase",
    creatorId: "EXAMPLE-CREATOR-002",
    workIds: ["EXAMPLE-WORK-002"],
    packageState: "Planned",
    publicationState: "Planned",
    surfaces: ["EXAMPLE-SURFACE-VSR"],
    summary: "Example planned Experience illustrating how a collection may later project into a governed VSR Room.",
    isExample: true,
  },
];
