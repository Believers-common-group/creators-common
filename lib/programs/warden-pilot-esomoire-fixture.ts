import type { SyntheticPilotApplication } from "./warden-pilot-esomoire";

/** Public example only. Do not substitute an actual applicant. */
export const examplePilotApplication: SyntheticPilotApplication = {
  kind: "WARDEN_PILOT_CANDIDATE_PROPOSAL",
  applicationStatus: "SYNTHETIC_EXAMPLE",
  company: {
    displayName: "EXAMPLE Consulting Organisation",
    jurisdiction: "EXAMPLE Jurisdiction",
    legalIdentityEvidenceRef: null,
    signatoryAuthorityEvidenceRef: null,
  },
  classification: { base: "NG-C", thirdPartyRoles: ["stack"] },
  proposedService: {
    title: "Synthetic commerce discrepancy review",
    scope: "Read-only review of entirely fictional product-listing records",
    excludedActions: [
      "No production API calls",
      "No real customer records",
      "No price changes",
      "No financial transactions",
    ],
  },
  commercial: {
    customerContracting: "pilot_company_direct",
    customerInvoicing: "pilot_company_direct",
    esomoirePaymentRole: "none_without_separate_authorization",
    draftAgreementRef: null,
  },
  consentAndData: {
    noCredentialsSubmitted: true,
    customerDataSubmitted: false,
    approvedIntakeEnabled: false,
    dataFlowReviewRef: null,
  },
};
