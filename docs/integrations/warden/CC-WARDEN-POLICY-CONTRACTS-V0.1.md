# Creators Common Warden Policy Contracts

**Document ID:** CC-WARDEN-POLICY-CONTRACTS-V0.1  
**Status:** Controlled prototype baseline  
**Authority boundary:** Warden evaluates and enforces policy; it does not create authorship, ownership, scientific validity or regulatory approval.

## 1. Purpose

Warden supplies the policy-decision and enforcement layer between a governed identity and a governed Creators Common resource.

The contracts answer:

- who is requesting access;
- which governed record and fields are requested;
- which action and purpose are claimed;
- which assurance, device and network conditions are present;
- which policy rules matched;
- whether the request is permitted, denied or conditionally permitted; and
- which obligations must be completed and preserved as evidence.

## 2. Record families

### `CC-WA` — Warden Access Policy

Defines reusable field-level rules for:

- subject identity, role, affiliation and assurance;
- governed record type, identifier, field paths and classification;
- action, purpose, environment, jurisdiction and device trust;
- deny or permit precedence;
- logging, approval, redaction, watermarking, expiry and export controls.

Schema: `schemas/warden-access-policy.schema.json`

### `CC-WD` — Warden Policy Decision

Records one evaluation against one access policy. A decision is append-only evidence of what Warden concluded at a specific time and under a specific context.

Schema: `schemas/warden-policy-decision.schema.json`

## 3. Decision flow

```text
DigitalMe / service identity
        ↓
Access request
        ↓
Warden Access Policy
        ↓
Rule matching and conflict resolution
        ↓
permit | deny | permit-with-conditions | indeterminate
        ↓
Obligations
        ↓
RiverOS evidence event
        ↓
Resource response or blocked action
```

## 4. Field-level enforcement

A policy may apply to an entire record or selected JSON-style field paths such as:

```text
$.composition
$.properties
$.evidenceRefs
$.economicTerms.royalties
```

A permit on one field does not imply permission for the entire record. A field omitted from the permit remains governed by the policy's default effect.

## 5. Conflict rules

Supported conflict-resolution modes are:

- `deny-overrides`;
- `permit-overrides`;
- `first-applicable`; and
- `only-one-applicable`.

The recommended baseline for restricted scientific, engineering, financial and identity fields is `deny-overrides`.

## 6. Obligations

Conditional permission may require:

- RiverOS access logging;
- human approval;
- field redaction;
- watermarking;
- purpose binding;
- time-limited access;
- no export or onward sharing;
- notification to a custodian; or
- a custom governed control.

An obligation is not satisfied merely because it appears in a decision record. The enforcing service must produce evidence of completion.

## 7. Relationship to Asset Lab

Asset Lab invokes Warden before exposing restricted material composition, supplier evidence, laboratory results, commercial terms or other protected fields.

The prototype fixture demonstrates a verified domain reviewer receiving bounded review access to selected fields of a synthetic Material Specification while export remains prohibited.

## 8. Non-authority boundary

A Warden permit means only that the evaluated policy allowed the requested action under the recorded context. It does not prove:

- the record is true;
- the actor owns the creation;
- the actor is professionally qualified beyond the identity evidence supplied;
- the creation is safe or validated;
- a licence has been legally executed; or
- a regulator has authorised the use.

Those conclusions require their own governed authorities and evidence.
