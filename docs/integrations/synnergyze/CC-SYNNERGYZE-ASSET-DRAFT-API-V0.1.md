# Synnergyze Asset Draft API and Collaborative Persistence

**Document ID:** CC-SYNNERGYZE-ASSET-DRAFT-API-V0.1  
**Status:** Controlled prototype contract  
**Applies to:** Creators Common Asset Lab and Synnergyze services

## 1. Purpose

Synnergyze provides the durable authoring and collaboration services behind Creators Common Asset Lab. This contract defines how editable Asset Drafts are created, retrieved, changed, reviewed and prepared for governed release without allowing collaboration mechanics to overwrite provenance or bypass Warden, RiverOS, Release Gate or Creation Passport controls.

The API contract is published at:

`api/openapi/synnergyze-asset-draft-api-v0.1.json`

## 2. Governed record families

| Identifier | Record | Function |
|---|---|---|
| `CC-SY-CS` | Collaboration Session | Bounded actor, device, role, capability and Warden context |
| `CC-SY-OP` | Asset Operation | Idempotent client operation against a declared base revision |
| `CC-SY-EV` | Asset Event | Append-only server outcome in the Asset Draft stream |
| `CC-SY-SN` | Asset Snapshot | Deterministic checkpoint for projection recovery |

These records complement, rather than replace, the existing `CC-AD` Asset Draft and its component, material, process, variant, validation, claim and release records.

## 3. Persistence model

```text
Asset Draft projection
        ↑ rebuild
Latest Snapshot + subsequent Events
        ↑
Append-only Asset Event stream
        ↑
Validated idempotent Asset Operations
        ↑
Bounded Collaboration Session
```

The current Asset Draft view is a projection. The authoritative durable sequence is the append-only event stream plus deterministic snapshots. A projection may be recreated from the latest valid snapshot and every later event in sequence.

## 4. Optimistic concurrency

Every mutating operation carries:

- the Asset Draft identifier;
- a base revision in the governed payload;
- an HTTP `If-Match` revision ETag;
- a client operation identifier; and
- an `Idempotency-Key`.

The service accepts an operation only when the declared base revision and ETag match the current projection revision. A mismatch returns a conflict or precondition failure and does not silently merge the change.

Accepted operations advance the revision exactly once. Repeated submission with the same idempotency key must return the original result rather than apply the operation again.

## 5. Collaboration sessions

A session binds:

- actor identity;
- Asset Draft;
- role and capabilities;
- starting revision;
- device context;
- Warden decision where required;
- expiry and status.

Cursor position, typing indicators and transient presence are ephemeral by default. Presence does not create authorship, ownership, contribution credit or economic entitlement. A meaningful contribution must be promoted through the governed Contribution Record process with evidence and review.

## 6. Operation semantics

`CC-SY-OP` uses a constrained JSON Patch style structure. Each operation is immutable after acceptance. Supported operation intents include:

- patching draft fields;
- attaching evidence;
- linking governed records;
- requesting review;
- requesting release; and
- resolving a recorded conflict.

The service records who submitted the operation and when it occurred, but acceptance is a service decision based on revision, identity, capability and policy checks.

## 7. Event stream

Every accepted, rejected or conflicted operation generates an append-only `CC-SY-EV` record. Event sequence numbers are monotonically increasing within one `asset-draft:<CC-AD-...>` stream.

An event records:

- operation reference;
- actor;
- base and resulting revision;
- idempotency key;
- changed paths;
- reason codes;
- Warden and RiverOS references where applicable; and
- server recording time.

An event is not deleted because a later operation reverses its effect. Reversal is represented by a new operation and event.

## 8. Snapshots

A `CC-SY-SN` snapshot records:

- Asset Draft identifier;
- exact revision;
- last included event;
- canonical state;
- `CC-CJSON-0.1` state digest.

Snapshots are acceleration checkpoints, not alternative histories. The snapshot digest is recalculated by the conformance validator. A snapshot whose revision, last event or digest does not match the stream is invalid.

## 9. Conflict policy

Automatic silent conflict resolution is prohibited for governed fields.

Conflicts must produce an explicit outcome with reason codes. Resolution may require:

- refreshing to the latest revision;
- resubmitting a new operation;
- human comparison;
- a Warden decision;
- evidence review; or
- a dedicated conflict-resolution operation.

No conflict resolution may erase earlier events.

## 10. Release boundary

The release-request endpoint only records a request. It does not advance lifecycle stage or create a Creation Passport.

A governed release still requires:

1. completed draft and linked sub-records;
2. contribution and evidence integrity;
3. Warden policy satisfaction;
4. Release Gate disposition;
5. Creation Passport generation;
6. signed-envelope verification where required; and
7. EmpireOS licence handling for authorised deployment.

## 11. Security and authority

The API assumes DigitalMe-authenticated actors and Warden-evaluated permissions. Each service must fail closed when:

- identity is unresolved;
- session is expired or revoked;
- capability is absent;
- Warden conditions are unmet;
- base revision is stale;
- idempotency state is ambiguous; or
- the event store cannot durably record the outcome.

## 12. Offline and intermittent clients

An offline client may queue operations with stable client operation identifiers and idempotency keys. On reconnect, every operation is evaluated against its original base revision. Stale operations are not automatically rebased. The client must surface conflicts and preserve the user’s proposed change for comparison.

## 13. Audit and evidence

Routine accepted field edits remain in the Asset Event stream. Events affecting release, claims, evidence, licences, safety, restricted fields or authority should additionally create or reference RiverOS Evidence Events according to the applicable retention policy.

## 14. Synthetic fixture boundary

The files under `examples/synnergyze/` demonstrate one session, one accepted operation, one event and one snapshot. They do not represent a production user session, live database transaction, legal contribution, approved material specification or production release.

## 15. Implementation gates

Before production deployment:

- implement transactional event-store writes;
- enforce uniqueness for idempotency keys and client operation IDs;
- bind DigitalMe tokens to session actors;
- evaluate Warden policy on every privileged operation;
- implement event-stream integrity and backup recovery;
- define snapshot cadence and compaction rules;
- add multi-user conflict and offline replay tests;
- establish RiverOS evidence routing;
- implement rate limits, abuse controls and incident response; and
- independently review authorization and tenancy isolation.
