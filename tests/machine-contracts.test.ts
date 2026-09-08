import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));

describe("machine contracts", () => {
  it("preserves estate authority metadata", () => {
    const estate = readJson("public/estate-site.json");
    expect(estate.site_id).toBe("cc");
    expect(estate.app_id).toBe("APP-CC-001");
    expect(estate.registry_object).toBe("REG-SITE-001");
    expect(estate.alpha_node_id).toBe("ALPHA-NODE-001");
    expect(estate.authority_boundary).toBe("WARDEN");
    expect(estate.session_policy).toBe("NO_SHARED_CROSS_DOMAIN_COOKIE");
    expect(estate.handoff_status).toBe("SCAFFOLDED_NOT_ACTIVATED");
  });

  it("preserves the health projection contract", () => {
    const health = readJson("public/health.json");
    expect(health.service).toBe("creators-common-web");
    expect(health.productionBranch).toBe("main");
  });
});
