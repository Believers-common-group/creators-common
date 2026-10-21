/**
 * Proposal-only Warden partner pilot metadata.
 * These records do not confer product rights, service authority or intake access.
 */
export const WARDEN_PILOT = {
  id: "CC-WARDEN-PILOT-R0.6",
  state: "proposed",
  intakeState: "closed",
  productState: "pilot-stage",
  authorityBoundary: "WARDEN",
  registrationAuthority: "not-connected",
  bundledDefaults: ["Warden", "VSR", "DigitalMe"],
  operatorRole: "Esomoire — registry, listings, bookings and authorized reporting only",
  pilotBilling: "The independent pilot provider contracts with and invoices its customer",
  deviceLaunchRule: "Quantum Room may not launch commercially without a validated physical device",
} as const;

export const productionConditions = [
  { code: "G-C", stack: "Genesis", production: "Commons" },
  { code: "NG-C", stack: "Non-Genesis", production: "Commons" },
  { code: "G-E", stack: "Genesis", production: "External" },
  { code: "NG-E", stack: "Non-Genesis", production: "External" },
] as const;

export const additionalThirdPartyRoles = [
  "Independent stack supplier",
  "Additional production participant",
  "Both stack and production participant",
  "Separately authorized distribution partner",
] as const;
