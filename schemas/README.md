# Creators Common Registry Schemas

**Schema release:** CC-SCHEMAS-V0.1  
**Status:** Draft controlled contracts for implementation and review  
**JSON Schema dialect:** Draft 2020-12

This directory converts the Creators Common Canon into machine-readable registry contracts.

## Schemas

| Schema | Registry object | Purpose |
|---|---|---|
| [`creator-passport.schema.json`](creator-passport.schema.json) | Creator Passport | Portable identity, capabilities, affiliations, verified roles and creation portfolio |
| [`creation-passport.schema.json`](creation-passport.schema.json) | Creation Passport | Controlled identity, maturity, evidence, ownership, custodianship, restrictions and lineage of a creation |
| [`contribution-record.schema.json`](contribution-record.schema.json) | Contribution Record | Precise contributor action, evidence, review, attribution and agreed rights |
| [`licence-record.schema.json`](licence-record.schema.json) | Licence Record | Permitted parties, actions, territory, field of use, obligations, economic terms and suspension controls |

## Identifier families

- Creator Passport: `CC-CR-...`
- Creation Passport: `CC-CP-...`
- Contribution Record: `CC-CO-...`
- Licence Record: `CC-LR-...`

Identifiers are permanent. A correction or substantive update creates a new controlled version; it does not silently overwrite historical evidence.

## Design rules

1. Schema validation confirms structural conformance, not truth, ownership or regulatory approval.
2. Sensitive evidence may be represented by controlled references rather than embedded source material.
3. `additionalProperties` is disabled at the record boundary to prevent accidental, ungoverned fields.
4. Records carry issuer, provenance and timestamps so that registry actions can be audited.
5. Cross-record relationships use permanent identifiers and resolvable references.
6. Lifecycle stage, verification, validation and licensing remain separate concepts.
7. A licence does not substitute for legally required certification, accreditation, registration or authorisation.

## Implementation sequence

1. Validate sample records against these schemas.
2. Add signed record envelopes and content hashes.
3. Define RiverOS evidence references and retention rules.
4. Define Warden policy decisions and restricted-field access.
5. Define EmpireOS licence issuance and lifecycle events.
6. Add Synnergyze APIs and Virtual Silk Road discovery projections.

These schemas are an architecture baseline and are not legal advice, an intellectual-property registration, a regulated-product authorisation or a guarantee of scientific validity.
