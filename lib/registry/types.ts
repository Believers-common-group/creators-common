export type PublicState = "Registered" | "Candidate" | "Published" | "Planned";

export interface CreatorRecord {
  id: string;
  slug: string;
  displayName: string;
  category: string;
  summary: string;
  workIds: string[];
  experienceIds: string[];
  status: PublicState;
  isExample: true;
}

export interface WorkRecord {
  id: string;
  slug: string;
  title: string;
  creatorId: string;
  category: string;
  provenanceState: PublicState;
  summary: string;
  experienceIds: string[];
  isExample: true;
}

export interface ExperienceRecord {
  id: string;
  slug: string;
  name: string;
  creatorId: string;
  workIds: string[];
  packageState: PublicState;
  publicationState: PublicState;
  surfaces: string[];
  summary: string;
  isExample: true;
}

export interface ExecutionSurfaceRecord {
  id: string;
  provider: "VRChat" | "Web" | "VSR";
  state: PublicState;
  label: string;
  isExample: true;
}
