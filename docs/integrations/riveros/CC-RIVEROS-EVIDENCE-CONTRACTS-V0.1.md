# RiverOS Evidence Contracts for Creators Common

**Document ID:** CC-RIVEROS-EVIDENCE-CONTRACTS-V0.1  
**Status:** Controlled prototype architecture  
**Applies to:** Creators Common registry and programme evidence

## 1. Purpose

RiverOS provides the evidence authority for Creators Common. It records what happened to a governed creation record, who or what performed the action, which evidence was captured, which policy applied and how long the evidence must be retained.

RiverOS does not decide authorship, ownership or licence rights by itself. It preserves the evidence and decision trail used by Creators Common, Warden and EmpireOS.

## 2. Contract families

### Evidence Event

Schema: `schemas/riveros-evidence-event.schema.json`  
Identifier: `CC-RV-EV-...`

An Evidence Event records:

- event type and lifecycle status;
- occurrence and recording timestamps;
- responsible actor;
- one or more governed subjects;
- evidence artefact references and optional digests;
- policy decision and conditions;
- retention-policy assignment;
- optional signed-envelope reference;
- previous-event chain reference.

### Evidence Retention Policy

Schema: `schemas/riveros-retention-policy.schema.json`  
Identifier: `CC-RV-RP-...`

A retention policy records:

- programme and jurisdiction scope;
- evidence categories;
- retention trigger;
- retention and review periods;
- disposition at the end of retention;
- legal-hold support;
- deletion-evidence requirements;
- approving authority.

## 3. Event types

The initial event vocabulary is:

- `capture`
- `register`
- `attest`
- `verify`
- `validate`
- `issue`
- `amend`
- `supersede`
- `suspend`
- `revoke`
- `access`
- `disclose`
- `retain`
- `archive`
- `destroy`

These event types describe evidence actions. They do not replace the lifecycle state of the subject record.

## 4. Subject relationships

An event may link several governed records using relationships such as:

- primary subject;
- supports;
- supersedes;
- derives from;
- authorises;
- restricts;
- preserves.

Example: a `register` event may name a Creation Passport as the primary subject and a signed envelope as supporting evidence.

## 5. Event time model

RiverOS separates:

- **occurredAt** — when the underlying action occurred;
- **recordedAt** — when RiverOS accepted the event record;
- **createdAt/updatedAt** — lifecycle timestamps of the event record itself.

The difference between occurrence and recording time must remain visible. Backdated events must not be represented as if they were recorded in real time.

## 6. Evidence artefacts

An event can reference:

- controlled JSON records;
- reports and test outputs;
- images, audio or video;
- source repositories and commits;
- approvals and review findings;
- instrument exports;
- signed envelopes.

For local JSON artefacts with a SHA-256 digest, the repository validator applies CC-CJSON-0.1 canonicalization and verifies the digest.

A digest demonstrates change detection for the captured bytes. It does not prove that the evidence is truthful, complete or lawfully obtained.

## 7. Event chain

The optional chain object links an event to a previous RiverOS event and may carry the previous event digest.

This creates an auditable sequence but is not represented as a blockchain. Production storage may use append-only logs, immutability controls or other ledger technology, provided the event identity and evidence semantics remain unchanged.

## 8. Policy decisions

An Evidence Event may record a Warden or institutional decision:

- allow;
- deny;
- allow with conditions;
- escalate;
- not applicable.

The decision must identify the applicable policy, deciding party, timestamp and conditions where relevant.

An event recording a policy decision is evidence of the decision. It is not a substitute for the underlying policy authority.

## 9. Retention triggers

The initial retention triggers are:

- record creation;
- record supersession;
- licence expiry;
- programme closure;
- contract termination;
- last use;
- manual review;
- legal event.

Retention periods use ISO-8601-style duration strings such as `P5Y` or `P1Y` in this prototype.

## 10. End-of-retention disposition

Supported dispositions are:

- preserve;
- archive;
- review;
- delete;
- anonymize;
- transfer.

A disposition of `delete` does not permit silent deletion. Where `deletionEvidenceRequired` is true, RiverOS must record a destruction or disposition event before the source evidence becomes unavailable.

## 11. Legal holds and disputes

A legal hold or active dispute overrides normal deletion schedules. The policy records whether holds are supported and who may release them.

The prototype does not determine statutory retention periods. Jurisdiction-specific legal review is required before a draft policy becomes active.

## 12. qPCR programme example

The synthetic fixture set demonstrates:

```text
Creation Passport
      ↓ digest binding
Signed Record Envelope
      ↓ evidence registration
RiverOS Evidence Event
      ↓ retention assignment
RiverOS Retention Policy
```

The example remains research-use architecture only. It does not establish assay validation, diagnostic approval, laboratory accreditation or clinical evidence.

## 13. Institutional boundaries

| Layer | Responsibility |
|---|---|
| Creators Common | Defines the subject record, attribution and creation lifecycle |
| RiverOS | Captures evidence events, timestamps, artefacts, chain references and retention duties |
| Warden | Evaluates access, safety, disclosure and authority policy |
| EmpireOS | Issues or changes licence state based on governed decisions |
| Synnergyze | Operates storage, APIs, indexing and workflow integration |
| DigitalMe | Resolves actors, reviewers and institutional identities |

## 14. Production gates

Before production deployment:

- define jurisdiction-specific retention schedules;
- define trusted timestamp sources;
- define immutable-storage and backup requirements;
- define evidence-access logging;
- define deletion and anonymization procedures;
- define incident and breach handling;
- define Warden decision schemas;
- define cryptographic key and signature verification;
- establish data-protection and consent controls;
- validate event ordering and idempotency behaviour;
- add negative conformance tests.
