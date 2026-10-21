import { describe, expect, it } from "vitest";
import { WARDEN_PILOT, productionConditions, additionalThirdPartyRoles } from "../lib/programs/warden-pilot";

describe("Warden proposal-only pilot", () => {
  it("keeps the identity and authority boundaries explicit", () => {
    expect(WARDEN_PILOT.authorityBoundary).toBe("WARDEN");
    expect(WARDEN_PILOT.registrationAuthority).toBe("not-connected");
    expect(WARDEN_PILOT.state).toBe("proposed");
    expect(WARDEN_PILOT.intakeState).toBe("closed");
    expect(WARDEN_PILOT.productState).toBe("pilot-stage");
  });
  it("includes VSR and DigitalMe in the default proposed Warden package", () => {
    expect(WARDEN_PILOT.bundledDefaults).toEqual(["Warden", "VSR", "DigitalMe"]);
  });
  it("covers all four technology x production configurations, independently of third parties", () => {
    expect(productionConditions.map((p) => p.code)).toEqual(["G-C", "NG-C", "G-E", "NG-E"]);
    expect(new Set(productionConditions.map((p) => p.code)).size).toBe(4);
    expect(additionalThirdPartyRoles.length).toBeGreaterThan(0);
  });
  it("keeps commercial and device obligations distinct", () => {
    expect(WARDEN_PILOT.pilotBilling).toMatch(/invoices its customer/);
    expect(WARDEN_PILOT.operatorRole).toMatch(/registry, listings, bookings/);
    expect(WARDEN_PILOT.deviceLaunchRule).toMatch(/validated physical device/);
  });
});
