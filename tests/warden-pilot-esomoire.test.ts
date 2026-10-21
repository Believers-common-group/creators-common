import { describe, expect, it } from "vitest";
import { buildEsomoirePreview, validateSyntheticPilotApplication } from "../lib/programs/warden-pilot-esomoire";
import { examplePilotApplication } from "../lib/programs/warden-pilot-esomoire-fixture";

const valid = () => structuredClone(examplePilotApplication) as Record<string, any>;

describe("Esomoire R0.8 synthetic-only administrative bridge", () => {
  it("derives independently linked registry/listing/booking references without live authority", () => {
    const output = buildEsomoirePreview(examplePilotApplication, "EXAMPLE-PILOT-001");
    expect(output.status).toBe("SYNTHETIC_ONLY");
    expect(output.registry).toMatchObject({
      id: "EXAMPLE-REG-PILOT-001", candidateId: "EXAMPLE-PILOT-001",
      status: "PREVIEW_ONLY", recordsOnly: true, proofOfOwnership: false,
    });
    expect(output.listing).toMatchObject({
      id: "EXAMPLE-LIST-PILOT-001", registryId: output.registry.id,
      status: "NOT_PUBLISHED", availableForSale: false,
    });
    expect(output.booking).toMatchObject({
      id: "EXAMPLE-BOOK-PILOT-001", listingId: output.listing.id,
      status: "NOT_BOOKABLE", confirmedAt: null, customerReference: null,
    });
    expect(output.candidate.productPackage).toEqual(["Warden", "VSR", "DigitalMe"]);
    expect(output.candidate.licenceStatus).toBe("NOT_GRANTED");
    expect(output.candidate.pilotAdmission).toBe("NOT_ADMITTED");
    expect(Object.values(output.governance)).toEqual([false, false, false, false]);
  });

  it("preserves direct pilot-company commercial contracting and no Esomoire payment", () => {
    const output = buildEsomoirePreview(valid(), "EXAMPLE-ONE-002");
    expect(output.commercial).toEqual({
      customerContracting: "PILOT_COMPANY_DIRECT",
      invoiceIssuer: "PILOT_COMPANY",
      esomoireReceivesFunds: false,
      contractReference: null,
      paymentReference: null,
    });
  });

  it("is deterministic and has no input mutation", () => {
    const before = JSON.stringify(examplePilotApplication);
    const a = buildEsomoirePreview(examplePilotApplication, "EXAMPLE-PILOT-001");
    const b = buildEsomoirePreview(examplePilotApplication, "EXAMPLE-PILOT-001");
    expect(a).toEqual(b);
    expect(JSON.stringify(examplePilotApplication)).toBe(before);
  });

  it("rejects a real identity or service claim, an extra field, and a non-synthetic identifier", () => {
    const a = valid();
    a.company.displayName = "Real Consulting Firm";
    expect(() => buildEsomoirePreview(a, "EXAMPLE-PILOT-001")).toThrow(/synthetic marker/);
    const b = valid();
    b.company.legalIdentityEvidenceRef = "GSTIN-real-person";
    expect(() => buildEsomoirePreview(b, "EXAMPLE-PILOT-001")).toThrow();
    const c = valid();
    c.privateEmail = "not-for-public-repo@example.com";
    expect(() => buildEsomoirePreview(c, "EXAMPLE-PILOT-001")).toThrow(/unknown fields/);
    expect(() => buildEsomoirePreview(valid(), "PILOT-001")).toThrow(/synthetic-only/);
  });

  it("rejects commerce, data collection, actual intakes, and unauthorized changes", () => {
    for (const [field, value] of [
      ["customerContracting", "esomoire"],
      ["customerInvoicing", "esomoire"],
      ["esomoirePaymentRole", "collect"],
      ["draftAgreementRef", "contract-123"],
    ] as const) {
      const c = valid(); c.commercial[field] = value;
      expect(() => validateSyntheticPilotApplication(c)).toThrow();
    }
    for (const [field, value] of [
      ["noCredentialsSubmitted", false],
      ["customerDataSubmitted", true],
      ["approvedIntakeEnabled", true],
      ["dataFlowReviewRef", "real-consent-data"],
    ] as const) {
      const c = valid(); c.consentAndData[field] = value;
      expect(() => validateSyntheticPilotApplication(c)).toThrow();
    }
  });

  it("rejects unsupported/duplicate stack or third-party classification", () => {
    const a = valid(); a.classification.base = "UNKNOWN";
    expect(() => buildEsomoirePreview(a, "EXAMPLE-PILOT-001")).toThrow();
    const b = valid(); b.classification.thirdPartyRoles = ["stack", "stack"];
    expect(() => buildEsomoirePreview(b, "EXAMPLE-PILOT-001")).toThrow();
    const c = valid(); c.classification.thirdPartyRoles = ["owner"];
    expect(() => buildEsomoirePreview(c, "EXAMPLE-PILOT-001")).toThrow();
    const d = valid(); d.proposedService.excludedActions = [];
    expect(() => buildEsomoirePreview(d, "EXAMPLE-PILOT-001")).toThrow();
  });

  it("rejects arrays, nulls and non-plain-object applications", () => {
    for (const bad of [null, [], "candidate", Object.create({kind:"WARDEN_PILOT_CANDIDATE_PROPOSAL"})]) {
      expect(() => buildEsomoirePreview(bad, "EXAMPLE-PILOT-001")).toThrow();
    }
  });
});
