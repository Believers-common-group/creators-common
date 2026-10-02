# BYOH-PROGRAM-001 — Be Your Own Hero R0.1

**Lifecycle:** Proposed; not production-admitted  
**Site:** `cc` — `https://creators-common.org`  
**Parent:** Creators Common `APP-CC-001` / `REG-SITE-001` / `ALPHA-NODE-001`  
**Authority boundary:** `WARDEN`  
**Scope:** Public programme, professional discovery and opportunity intake design  
**Date:** 2026-10-02

## 1. Purpose

Reintroduce the historical *Be Your Own Hero* idea as a multidisciplinary, all-professions programme for finding qualified collaborators, solving practical problems, making products and creative work, and developing commercial opportunities using *available, admitted, provider-owned* shared capacity. Creators Common remains the programme's public discovery surface; it is **not** a separate identity authority, capability registry, work-order ledger, settlement rail or standalone app.

Historical Under25/FAED imagery is background inspiration, **not evidence of current partnership, brand licensing, sponsorship, ownership or approval**. No under-25 age restriction applies by default. Minors, regulated professional activities and protected data need separate admission policies.

## 2. Four participation entry routes

- **Have an idea:** ask for a collaboration or prototyping pathway.
- **Have a skill:** propose to contribute to an admitted project.
- **Have resources:** offer a bounded, verified capacity envelope (personnel, tools, facilities, compute, AI, logistics or distribution).
- **Have a challenge:** commission or sponsor a mission with stated objectives and commercial terms.

Any entry is a lead/proposal, **not admission**. No user-submitted records, consent or identity data are stored in the public static site. Only verified, privacy-reviewed backend intake may accept such data in a later release.

## 3. Canonical objects and ownership

| Object | Nature | Authority |
| --- | --- | --- |
| ProgramDefinition | Programme purpose, scope, version, eligibility and review rules | Approved institutional owner / Genesis reference |
| HeroMission | Objective, acceptance tests, jurisdiction, dates, status, sponsor and budget | Admitted mission owner |
| ParticipationRequest | Consented expression of interest with minimal information | Protected intake service |
| ContributorBinding | DigitalMe principal, role, qualification, assignment and consent | DigitalMe / Warden |
| CapacityOffer | Provider-declared skills/facility/tool/runtime availability and constraints | Provider native; Genesis binding |
| ResourceReservation | Bounded quota, entitlement, Place/Room, schedule, safety and budget | Provider / Warden |
| RightsAndCompensationTerms | Authorship, intellectual-property rights, licences, confidentiality, pay and settlement | Signed counterparties |
| Deliverable | Work/product/result and acceptance evidence | Responsible project team |
| OutcomeAndCoverage | Verified impact, story rights, attribution and publication state | River evidence / PressTech distribution |

Do not duplicate `CreatorRecord`, `WorkRecord`, `ExperienceRecord`, Creator Passport or Creation Passport. Reuse the applicable creator/creation registration and canonical estate records when qualified. `HeroMission` is programme-level coordination, **not** a new Genesis source of truth.

## 4. Governed sequence

1. **Discover:** show a proposed programme or published mission only if disclosure is authorized.
2. **Identify:** verify DigitalMe subject/organization and signed consent for private intake.
3. **Classify:** define sector, profession, mission objective, Place/jurisdiction, IP and risk.
4. **Admit:** Warden validates eligibility, purpose, sponsor, dependency, safeguarding, budget and licence.
5. **Compose:** Synnergyze creates the ARK-capability workflow and requests resource capacity.
6. **Contract:** counterparties agree terms before doing compensated or proprietary work.
7. **Execute:** provider-native tools, qualified facilities, agents, contractors and ARKs perform work within quota; VSR Doors/Rooms are admitted execution surfaces.
8. **Evidence:** River receives provenance, approvals and deliverable acceptance.
9. **Publish/settle:** Warden reviews claims, rights and reputational exposure; PressTech distributes only authorized stories; SILK records metering/benefits/settlement when independently admitted.

Keep the canonical runtime dependency order: **Identity → Authority → Reachability → Orchestration → Execution → Evidence**. Marketing cannot shortcut authorization or impersonate provider verification.

## 5. Mission status machine

`proposed → review → admitted → open → matched → contracted → active → delivered → accepted → closed`.

Exception states: `rejected`, `paused`, `cancelled`, `disputed`, `revoked`.

All material transitions are governed and evidenced in the admitted runtime. A website click is not an authoritative transition. `open` requires confirmed sponsor, resource envelope and participant conditions. `delivered` does not imply `accepted`; `accepted` does not imply IP transfer. Warden can suspend work and revoke capability access; provider-native safety authority remains controlling.

## 6. Shared resources and economics

Capacity is **offered, not presumed**. Every offer should specify provider, estate/Place/Location/Room, resource class, entitlement, availability window, skill/safety constraints, data residency, marginal cost and currency, quota, cancellation/exit terms, approved delegation and evidence source. Synnergyze may suggest combinations but does not fabricate capacity or provider entitlements. Warden must admit resource binding before execution. Prefer the lowest-cost viable route within quality and assurance limits.

Compensation is project-specific: clearly separate paid contracts, prizes, licensing/royalties, material reimbursement, sponsored in-kind use, volunteering and equity. No blanket rights assignment. No promise of earnings, publication or incorporation. Specify insurance, labour, safeguarding and professional-regulatory obligations by jurisdiction.

## 7. Website R0.1 boundary

Add a static, accessible, metadata-described `/programs/be-your-own-hero` landing page, discoverable from Commons/navigation. Public copy must say *programme in preparation* and label all three example mission cards **Proposed concept — applications not open**. Do not insert false metrics, fabricated success stories, working application buttons, fake Warden approval seals or a client-side form that silently collects leads. Preserve `/health`, `/.well-known/estate-site`, existing SEO structure, static export and no shared cross-domain cookie.

### Proposed pilot references (no active funding or acceptance yet)

- `EXAMPLE-BYOH-DENIM`: design, textiles, manufacturing and marketing.
- `EXAMPLE-BYOH-ROOM`: architecture, engineering, software and accessible interfaces.
- `EXAMPLE-BYOH-STORY`: documentary, research, photography, consent and rights.

Marketing may describe the ecosystem's intended collaboration model, but it must not imply live integration, participating named sponsors or verified outcomes until evidenced.

## 8. Lead, marketing and evidence design

Anonymous website visits may be assessed using privacy-compliant aggregate counts. For any later intake: purpose-specific consent, minimal name/contact/role only when needed, clear response time, withdrawal/deletion route, lead-owner routing, retention schedule, jurisdictional privacy notice, security controls and opt-in communications. Sponsor leads and participant applications remain separate workflows with separate permissions. No data-broker enrichment or disclosure of private DigitalMe attributes for advertising.

Track: qualified mission requests, admitted provider capacity, participant-to-mission conversion, accepted outputs, verified commercial enquiries, time to handoff, actual resource cost and cost per contracted outcome. Never use unsupported outcome counters. PressTech publishes only evidence-backed, authorized and rights-cleared stories.

## 9. Assurance and release gates

- Confirm programme legal owner, historical campaign reuse rights and final public branding.
- Resolve merge/ownership relationship with existing Creators Common R0.1 PR and the parallel canon/registration PR without copying their logic.
- Confirm approved intake endpoint/identity service before activating application submission.
- Sign off mission sponsorship, safety/insurance, capacity envelopes, rights and commercial terms.
- Run test/typecheck/build/static-export verification and inspect Vercel preview.
- Verify static federation `/health` and `/.well-known/estate-site`; test keyboard/mobile accessibility and metadata.
- Review public statements for privacy, security, legal, commercial and reputational accuracy under Warden publication policy.
- Do not merge/deploy until authorised and evidence exists.

## 10. Version decision

This is a **proposed extension** to current Creators Common work, not a silent replacement for PR #1 (Canon V0.2 and registration) or PR #5 (public Next.js R0.1). Registration and passport integration is a subsequent approval-gated revision.
