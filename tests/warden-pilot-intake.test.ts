import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const root = "docs/programmes/warden-pilot/";
const json = (name: string) => JSON.parse(readFileSync(root + name, "utf8"));

describe("Warden R0.7 proposal-only intake contracts", () => {
  const gate = json("R0.7-intake-gates.json");
  const schema = json("R0.7-candidate.schema.json");
  const fixture = json("R0.7-candidate.synthetic.json");

  it("prevents live collection, operations or sales while gate is HOLD", () => {
    expect(gate.status).toBe("HOLD");
    for (const flag of ["effective", "intakeEnabled", "executionEnabled", "publicListingEnabled"])
      expect(gate[flag]).toBe(false);
    expect(gate.approvedApplicationEndpoint).toBe(null);
    expect(gate.applicationController).toBe(null);
    expect(gate.firstPilotCompany).toBe(null);
    expect(gate.operationalRightsGrant).toBe(null);
    expect(gate.approvalRecord).toBe(null);
  });

  it("requires independent evidence for each pre-activation gate", () => {
    expect(gate.gates).toHaveLength(10);
    expect(new Set(gate.gates.map((g: { id: string }) => g.id)).size).toBe(10);
    for (const g of gate.gates) {
      expect(g.state).toBe("HOLD");
      expect(g.evidenceRef).toBe(null);
      expect(g.reviewedBy).toBe(null);
    }
  });

  it("keeps independent commercial relationships and bundled proposal defaults", () => {
    expect(gate.entryPackage).toEqual(["Warden","VSR","DigitalMe"]);
    expect(gate.supportedConditions).toEqual(["G-C","NG-C","G-E","NG-E"]);
    expect(gate.separation.contractingParty).toMatch(/Independent/);
    expect(gate.separation.invoiceIssuer).toMatch(/Independent/);
  });

  it("restricts published applicant examples to synthetic, non-executing data", () => {
    expect(schema.properties.applicationStatus.const).toBe("SYNTHETIC_EXAMPLE");
    expect(schema.properties.commercial.properties.customerInvoicing.const).toBe("pilot_company_direct");
    expect(schema.properties.consentAndData.properties.approvedIntakeEnabled.const).toBe(false);
    expect(fixture.applicationStatus).toBe("SYNTHETIC_EXAMPLE");
    expect(fixture.company.displayName).toMatch(/^EXAMPLE/);
    expect(fixture.consentAndData).toEqual({
      noCredentialsSubmitted: true,
      customerDataSubmitted: false,
      approvedIntakeEnabled: false,
      dataFlowReviewRef: null,
    });
  });
});
