import { describe, expect, it } from "vitest";
import { BYOH_PROGRAM, proposedHeroMissions } from "../lib/programs/byoh";

describe("BYOH public proposed-only programme", () => {
  it("keeps the existing estate authority and programme proposal boundary", () => {
    expect(BYOH_PROGRAM.id).toBe("BYOH-PROGRAM-001");
    expect(BYOH_PROGRAM.authorityBoundary).toBe("WARDEN");
    expect(BYOH_PROGRAM.status).toBe("proposed");
    expect(BYOH_PROGRAM.registrationState).toBe("not-connected");
  });
  it("publishes only explicit synthetic mission concepts", () => {
    expect(proposedHeroMissions).toHaveLength(3);
    expect(new Set(proposedHeroMissions.map((m) => m.id)).size).toBe(3);
    for (const mission of proposedHeroMissions) {
      expect(mission.exampleOnly).toBe(true);
      expect(mission.state).toBe("proposed");
      expect(mission.id).toMatch(/^EXAMPLE-BYOH-/);
      expect(mission.disciplines.length).toBeGreaterThan(0);
    }
  });
});
