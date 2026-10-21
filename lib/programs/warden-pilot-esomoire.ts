/**
 * Creators Common R0.8 — OFFLINE, SYNTHETIC Esomoire registry/listing/booking bridge.
 *
 * No network, persistence, identity issuance, Warden admission, licence issuance,
 * customer data collection, billing or live bookings. Records are NOT authoritative.
 */
export type ProductionCode = "G-C" | "NG-C" | "G-E" | "NG-E";
export type AdditionalRole = "stack" | "production" | "both" | "distribution";

export interface SyntheticPilotApplication {
  kind: "WARDEN_PILOT_CANDIDATE_PROPOSAL";
  applicationStatus: "SYNTHETIC_EXAMPLE";
  company: {
    displayName: string;
    jurisdiction: string;
    legalIdentityEvidenceRef: null;
    signatoryAuthorityEvidenceRef: null;
  };
  classification: {
    base: ProductionCode;
    thirdPartyRoles: AdditionalRole[];
  };
  proposedService: {
    title: string;
    scope: string;
    excludedActions: string[];
  };
  commercial: {
    customerContracting: "pilot_company_direct";
    customerInvoicing: "pilot_company_direct";
    esomoirePaymentRole: "none_without_separate_authorization";
    draftAgreementRef: null;
  };
  consentAndData: {
    noCredentialsSubmitted: true;
    customerDataSubmitted: false;
    approvedIntakeEnabled: false;
    dataFlowReviewRef: null;
  };
}

export interface EsomoirePreview {
  kind: "ESOMOIRE_ADMINISTRATIVE_PROJECTION";
  version: "R0.8";
  status: "SYNTHETIC_ONLY";
  candidate: {
    id: string;
    title: string;
    company: string;
    productionCode: ProductionCode;
    additionalThirdPartyRoles: AdditionalRole[];
    productPackage: readonly ["Warden", "VSR", "DigitalMe"];
    licenceStatus: "NOT_GRANTED";
    pilotAdmission: "NOT_ADMITTED";
  };
  registry: {
    id: string;
    candidateId: string;
    status: "PREVIEW_ONLY";
    recordsOnly: true;
    proofOfOwnership: false;
  };
  listing: {
    id: string;
    registryId: string;
    status: "NOT_PUBLISHED";
    availableForSale: false;
  };
  booking: {
    id: string;
    listingId: string;
    status: "NOT_BOOKABLE";
    confirmedAt: null;
    customerReference: null;
  };
  commercial: {
    customerContracting: "PILOT_COMPANY_DIRECT";
    invoiceIssuer: "PILOT_COMPANY";
    esomoireReceivesFunds: false;
    contractReference: null;
    paymentReference: null;
  };
  governance: {
    genesisIdentityIssued: false;
    digitalMeIdentityIssued: false;
    wardenExecutionAdmitted: false;
    riverEvidenceIssued: false;
  };
}

function requireCondition(value: unknown, message: string): asserts value {
  if (!value) throw new Error("R0.8_REJECTED: " + message);
}
function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v) &&
    (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);
}
function exactly(value: unknown, keys: readonly string[], label: string): asserts value is Record<string, unknown> {
  requireCondition(isRecord(value), label + " must be a plain object");
  const actual = Object.keys(value).sort().join("\u0000");
  const expected = [...keys].sort().join("\u0000");
  requireCondition(actual === expected, label + " has missing or unknown fields");
}
function boundedString(v: unknown, max: number, label: string): asserts v is string {
  requireCondition(typeof v === "string" && v.trim() === v && v.length >= 2 && v.length <= max,
    label + " must be bounded nonempty text");
}
const productionCodes = ["G-C", "NG-C", "G-E", "NG-E"] as const;
const thirdPartyRoles = ["stack", "production", "both", "distribution"] as const;
const noCustomerDataActions = ["No production API calls", "No real customer records", "No price changes", "No financial transactions"];

export function validateSyntheticPilotApplication(candidate: unknown): asserts candidate is SyntheticPilotApplication {
  exactly(candidate, ["kind", "applicationStatus", "company", "classification",
    "proposedService", "commercial", "consentAndData"], "application");
  requireCondition(candidate.kind === "WARDEN_PILOT_CANDIDATE_PROPOSAL" &&
    candidate.applicationStatus === "SYNTHETIC_EXAMPLE", "only example applications are accepted");
  exactly(candidate.company, ["displayName", "jurisdiction",
    "legalIdentityEvidenceRef", "signatoryAuthorityEvidenceRef"], "company");
  const company = candidate.company;
  boundedString(company.displayName, 120, "company name");
  boundedString(company.jurisdiction, 120, "jurisdiction");
  requireCondition(company.displayName.startsWith("EXAMPLE ") &&
    company.jurisdiction.startsWith("EXAMPLE "), "synthetic marker required");
  requireCondition(company.legalIdentityEvidenceRef === null &&
    company.signatoryAuthorityEvidenceRef === null, "real identity evidence forbidden");
  exactly(candidate.classification, ["base", "thirdPartyRoles"], "classification");
  const cls = candidate.classification;
  requireCondition(productionCodes.includes(cls.base as ProductionCode), "unknown production code");
  requireCondition(Array.isArray(cls.thirdPartyRoles) &&
    cls.thirdPartyRoles.every(x => thirdPartyRoles.includes(x)) &&
    new Set(cls.thirdPartyRoles).size === cls.thirdPartyRoles.length, "invalid third-party roles");
  exactly(candidate.proposedService, ["title", "scope", "excludedActions"], "proposedService");
  const service = candidate.proposedService;
  boundedString(service.title, 150, "service title");
  boundedString(service.scope, 1500, "service scope");
  requireCondition(service.title.startsWith("Synthetic ") &&
    service.scope.toLowerCase().includes("fictional"), "service must be explicitly synthetic");
  const excludedActions = service.excludedActions;
  requireCondition(Array.isArray(excludedActions) &&
    noCustomerDataActions.every(x => excludedActions.includes(x)) &&
    excludedActions.every(x => typeof x === "string"), "required no-action exclusions missing");
  exactly(candidate.commercial, ["customerContracting", "customerInvoicing",
    "esomoirePaymentRole", "draftAgreementRef"], "commercial");
  const commercial = candidate.commercial;
  requireCondition(commercial.customerContracting === "pilot_company_direct" &&
    commercial.customerInvoicing === "pilot_company_direct" &&
    commercial.esomoirePaymentRole === "none_without_separate_authorization" &&
    commercial.draftAgreementRef === null, "unapproved commercial arrangements");
  exactly(candidate.consentAndData, ["noCredentialsSubmitted", "customerDataSubmitted",
    "approvedIntakeEnabled", "dataFlowReviewRef"], "consentAndData");
  const consent = candidate.consentAndData;
  requireCondition(consent.noCredentialsSubmitted === true &&
    consent.customerDataSubmitted === false &&
    consent.approvedIntakeEnabled === false &&
    consent.dataFlowReviewRef === null, "intake/data collection not permitted");
}
function syntheticId(id: unknown): asserts id is string {
  requireCondition(typeof id === "string" && /^EXAMPLE-[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(id) &&
    id.length <= 60, "synthetic-only identifier required");
}

/** Deterministically creates references solely for preview. No I/O or side effects. */
export function buildEsomoirePreview(candidate: unknown, candidateId: unknown): EsomoirePreview {
  validateSyntheticPilotApplication(candidate);
  syntheticId(candidateId);
  const registryId = candidateId.replace(/^EXAMPLE-/, "EXAMPLE-REG-");
  const listingId = candidateId.replace(/^EXAMPLE-/, "EXAMPLE-LIST-");
  const bookingId = candidateId.replace(/^EXAMPLE-/, "EXAMPLE-BOOK-");
  const roles = [...candidate.classification.thirdPartyRoles];
  return {
    kind: "ESOMOIRE_ADMINISTRATIVE_PROJECTION", version: "R0.8", status: "SYNTHETIC_ONLY",
    candidate: {
      id: candidateId, title: candidate.proposedService.title,
      company: candidate.company.displayName, productionCode: candidate.classification.base,
      additionalThirdPartyRoles: roles,
      productPackage: ["Warden", "VSR", "DigitalMe"],
      licenceStatus: "NOT_GRANTED", pilotAdmission: "NOT_ADMITTED",
    },
    registry: { id: registryId, candidateId, status: "PREVIEW_ONLY", recordsOnly: true, proofOfOwnership: false },
    listing: { id: listingId, registryId, status: "NOT_PUBLISHED", availableForSale: false },
    booking: { id: bookingId, listingId, status: "NOT_BOOKABLE", confirmedAt: null, customerReference: null },
    commercial: {
      customerContracting: "PILOT_COMPANY_DIRECT", invoiceIssuer: "PILOT_COMPANY",
      esomoireReceivesFunds: false, contractReference: null, paymentReference: null,
    },
    governance: {
      genesisIdentityIssued: false, digitalMeIdentityIssued: false,
      wardenExecutionAdmitted: false, riverEvidenceIssued: false,
    },
  };
}
