# Creators Common EmpireOS Licence Lifecycle

**Document ID:** CC-EMPIREOS-LICENCE-LIFECYCLE-V0.1  
**Status:** Controlled prototype baseline  
**Authority boundary:** EmpireOS records and executes authorised licence lifecycle events; it does not itself determine authorship, ownership, scientific validity or regulatory approval.

## 1. Purpose

The Licence Record defines the governed permission and its terms. EmpireOS provides the append-only lifecycle events that change the operational state of that licence.

This separation prevents the current licence state from silently overwriting the history of how, when and by whom it was issued, amended, suspended or terminated.

## 2. Record family

### `CC-EO-LE` — EmpireOS Licence Lifecycle Event

Schema: `schemas/empireos-licence-event.schema.json`

Supported event types are:

- `issue`;
- `amend`;
- `renew`;
- `suspend`;
- `resume`;
- `expire`;
- `terminate`;
- `revoke`; and
- `supersede`.

## 3. Event chain

```text
Licence Record
      ↓
Issue event · sequence 1
      ↓
Amend / renew / suspend / resume
      ↓
Expire / terminate / revoke / supersede
```

Every event after issuance carries:

- the same Licence Record identifier;
- a monotonically increasing sequence;
- the immediately previous event identifier;
- the prior and resulting licence status;
- field-level changes and reasons;
- the actor and decision basis;
- occurrence and effective timestamps; and
- notice and evidence references where applicable.

## 4. Proposed versus effective events

An event may be:

- `proposed`;
- `authorised`;
- `effective`;
- `rejected`;
- `cancelled`; or
- `superseded`.

Only an authorised or effective event is required to carry an effective timestamp and at least one approving authority reference.

A proposed event is a workflow object. It does not change the licence state.

## 5. Warden and RiverOS relationship

Before EmpireOS executes a protected lifecycle action, Warden may evaluate the actor, action, licence, field changes and context. The resulting `CC-WD` decision can be referenced by the lifecycle event.

RiverOS records the event, notices, approvals and resulting state as evidence. EmpireOS remains the lifecycle executor; RiverOS remains the evidence authority.

## 6. Notice and surviving obligations

Suspension, termination and revocation may require notice to licensees, beneficiaries, custodians or regulators. The event records whether notice is required and the evidence reference for delivery.

Termination does not automatically erase:

- attribution;
- accrued payment duties;
- confidentiality;
- evidence retention;
- audit rights;
- derivative lineage; or
- other terms expressly stated to survive.

## 7. Synthetic fixture chain

The repository includes proposed issuance, amendment, suspension and termination events for the synthetic qPCR Research Licence fixture.

The chain demonstrates structure only. It does not issue, amend, suspend or terminate a real licence and must not be treated as an executed legal instrument.

## 8. Controlled limitations

Lifecycle-event conformance proves only that a record follows the contract and event-chain rules. It does not prove that:

- the actor had lawful authority;
- required signatures or approvals are valid;
- notice was legally sufficient;
- consideration was paid;
- the underlying rights exist; or
- the licence is enforceable in a jurisdiction.

Production activation requires legal, tax, regulatory, identity, signature and authority review appropriate to the intended use.
