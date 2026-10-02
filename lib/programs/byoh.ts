/** Public, proposed-only programme metadata. Not a registry, authority or live mission feed. */
export const BYOH_PROGRAM = {
  id: "BYOH-PROGRAM-001",
  revision: "R0.1",
  name: "Be Your Own Hero",
  status: "proposed",
  siteId: "cc",
  authorityBoundary: "WARDEN",
  scope: "Creators Common public programme discovery",
  registrationState: "not-connected",
} as const;

export type ProposedHeroMission = {
  id: `EXAMPLE-BYOH-${string}`;
  title: string;
  brief: string;
  disciplines: readonly string[];
  outcome: string;
  state: "proposed";
  exampleOnly: true;
};

export const proposedHeroMissions: readonly ProposedHeroMission[] = [
  {
    id: "EXAMPLE-BYOH-DENIM",
    title: "Reinvent Everyday Denim",
    brief: "Explore a better-fitting, lower-waste product concept using qualified design and production partners.",
    disciplines: ["Fashion design", "Textile engineering", "Manufacturing", "Marketing"],
    outcome: "Concept, prototype and technical feasibility review",
    state: "proposed",
    exampleOnly: true,
  },
  {
    id: "EXAMPLE-BYOH-ROOM",
    title: "Build a Better Working Room",
    brief: "Explore an accessible, governed digital/physical Room experience for real workplace needs.",
    disciplines: ["Architecture", "Software", "Electronics", "Interaction design"],
    outcome: "Room demonstrator and validation brief",
    state: "proposed",
    exampleOnly: true,
  },
  {
    id: "EXAMPLE-BYOH-STORY",
    title: "Heroes Behind the Work",
    brief: "Develop a documentary/storytelling format recognizing overlooked professional and technical contributions.",
    disciplines: ["Journalism", "Film", "Photography", "Research"],
    outcome: "Rights-cleared editorial pilot",
    state: "proposed",
    exampleOnly: true,
  },
];
