# Creators Common Creator and Creation Registration

**Document ID:** CC-CREATOR-AND-CREATION-REGISTRATION-V0.1  
**Status:** Controlled workflow architecture  
**Applies to:** DigitalMe intake, Creator Passport registration, Creation Passport registration, Warden review, RiverOS evidence and VSR publication readiness

## 1. Purpose

This document defines the first controlled registration workflow for creators and creations inside Creators Common.

It implements the operating rules:

- no actor claim without a DigitalMe identity reference;
- no public projection without explicit consent;
- no accepted registration without sufficient evidence and human review;
- no verified status without a Warden decision;
- every material status change must create a RiverOS evidence event;
- sponsorship, ownership and authorship remain separate;
- no registration record automatically creates a Virtual Silk Road listing; and
- rejected, withdrawn, suspended or revoked records must not be represented as active public trust objects.

## 2. Institutional responsibilities

| Layer | Responsibility |
|---|---|
| DigitalMe | Identity reference, role intent, consent, delegation and visibility preference |
| Creators Common | Registration intake, duplicate review, creator and creation record semantics, attribution and passport issuance |
| RiverOS | Evidence-event recording for submission, review, acceptance, rejection, issuance, correction and withdrawal |
| Warden | Identity, evidence, permission, safety, public-visibility and policy decision |
| Synnergyze | API execution, workflow orchestration, idempotency and persistence |
| Virtual Silk Road | Separate discovery and publication projection after registry and Warden gates |
| Believers Common | Constitutional governance, dispute escalation and public-interest safeguards |

## 3. Registration families

| Record | Identifier | Purpose |
|---|---|---|
| Creator Registration Application | `CC-REG-CR-...` | Consent-bound request for a Creator Passport |
| Creation Registration Application | `CC-REG-CP-...` | Evidence-bound request for a Creation Passport |
| Registration Review | `CC-REG-RV-...` | Human review, evidence sufficiency, permissions and visibility decision |
| Registration Event | `CC-REG-EV-...` | Append-only workflow transition and issuance history |

## 4. Creator registration workflow

```text
DigitalMe Lite or verified identity
        ↓
role intent + jurisdiction + consent
        ↓
evidence references
        ↓
Creator Registration Application
        ↓
duplicate / identity / consent review
        ↓
Warden decision
        ↓
human registration-authority decision
        ↓
accepted / returned / rejected
        ↓
Creator Passport issuance event
        ↓
member or public projection may be prepared
```

A Creator Passport is not issued merely because a form was submitted. The accepted application, human review, Warden decision and RiverOS evidence event must remain linked.

## 5. Creation registration workflow

```text
registered Creator Passport
        ↓
Asset Draft or external creation definition
        ↓
creator and contribution claims
        ↓
rights / ownership / sponsor disclosure
        ↓
safety and regulatory declaration
        ↓
evidence references and publication preference
        ↓
Creation Registration Application
        ↓
authorship / ownership / evidence / safety review
        ↓
Warden decision
        ↓
human registration-authority decision
        ↓
Creation Passport issuance event
        ↓
separate VSR listing workflow
```

A sponsor may be recorded as a sponsor. Sponsorship does not automatically create authorship, ownership or creator attribution.

## 6. Consent and privacy

Creator intake may begin with a DigitalMe Lite identity, but the application must record:

- the DigitalMe reference;
- identity stage;
- role intent;
- jurisdiction;
- the applicable privacy-notice version;
- consent for identity processing;
- consent for evidence processing;
- separate consent for a public profile or public creation projection; and
- a consent-revocation reference.

Public projections use an explicit allow-list. Contact references, raw identity evidence, private evidence, ownership basis, reviewer notes, internal Warden reasoning and sensitive addresses are not included by default.

## 7. Review model

Critical acceptance and rejection decisions require a human reviewer. The Registration Review records:

- review stage;
- reviewer and institution;
- evidence sufficiency;
- permission check;
- public-visibility check;
- findings and required actions;
- disposition and reason codes;
- Warden decision reference; and
- RiverOS evidence-event reference.

Automated checks may detect duplicates, missing fields, stale consent, unsupported claims and policy conflicts. They do not replace the human decision for final acceptance or rejection.

## 8. Registration event chain

Registration Events are append-only and monotonically sequenced per application.

```text
submitted
  → evidence-attached
  → review-started
  → returned / accepted / rejected
  → passport-issued
  → withdrawn / superseded
```

Every applied event carries a RiverOS evidence-event reference. Events after sequence 1 reference the preceding event.

A `passport-issued` event must reference:

- the accepted review;
- the Warden decision;
- the output Creator or Creation Passport;
- the effective timestamp; and
- the RiverOS evidence event.

## 9. Public and VSR boundary

Registration can make a passport eligible for a controlled projection. It does not publish the passport to Virtual Silk Road.

The Registration Event field `publicProjectionEffect` is limited to:

- `none`;
- `prepare-eligible`; or
- `remove`.

There is deliberately no `public-index` effect in this workflow. VSR publication requires a separate listing or projection decision with its own evidence, Warden review, current passport status and visibility consent.

The public verification view should expose only approved fields such as:

- object or creator display name;
- passport type;
- issuer;
- issue date;
- current verification state;
- public evidence summary; and
- allowed public actions.

It must not expose raw compliance documents, financials, internal evidence logs, reviewer notes, sensitive locations or private identity data.

## 10. Correction, dispute and withdrawal

Corrections create a controlled new application or record version. Historical applications, reviews and events remain preserved.

A disputed authorship, ownership, safety or consent issue may place the application or resulting passport on hold through Warden and Creators Common governance. Withdrawal or revocation must produce a new event and remove any public eligibility until separately restored.

## 11. API rules

The registration API requires:

- bearer-authenticated DigitalMe identity;
- `Idempotency-Key` on mutating requests;
- optimistic concurrency for reviews and issuance;
- explicit conflict and precondition responses;
- Warden and RiverOS references for final decisions;
- no silent replacement of historical events; and
- no issue endpoint that bypasses an accepted human review.

## 12. Controlled limitations

The schemas and fixtures are workflow and conformance artifacts. They do not constitute identity certification, legal authorship, ownership assignment, copyright or patent registration, scientific validation, safety approval, regulatory authorisation, diagnostic approval or a Virtual Silk Road listing.
