# Creators Common R0.1 Design

**Status:** Proposed and user-approved at concept level on 2026-09-08. This document freezes the implementation boundary before code changes.

## 1. Objective

Turn `creators-common.org` from a federation placeholder into the public operating and distribution common for creators while preserving the repository's existing authority model.

The R0.1 product proposition is:

> **Create work. Establish provenance. Build experiences. Publish across worlds.**

Creators Common is not a new identity authority, settlement rail, or social network. It is the public creator surface and distribution layer that projects registered creator/work/experience relationships into admitted execution surfaces.

## 2. Existing contracts that remain authoritative

R0.1 must preserve the repository's current estate and deployment contracts:

- Canonical domain: `https://creators-common.org`
- Site id: `cc`
- App id: `APP-CC-001`
- Registry object: `REG-SITE-001`
- Alpha node: `ALPHA-NODE-001`
- Authority boundary: `WARDEN`
- Federation metadata endpoint: `/.well-known/estate-site`
- Health endpoint: `/health`
- No shared cross-domain cookie
- No self-issued DigitalMe identity
- No client-side Warden authority
- No private River credentials in the public application

The existing `estate-site.json`, `health.json`, and the semantic meaning of `vercel.json` routes are retained.

## 3. Product model

The public information model is intentionally small:

```text
CREATOR
   ↓
WORK
   ↓
EXPERIENCE
   ↓
EXECUTION SURFACE
   ↓
AUDIENCE
```

Definitions:

- **Creator** — a public projection of a creator principal. It does not itself create or replace DigitalMe identity.
- **Work** — a registered creative work or collection with provenance and rights metadata.
- **Experience** — an executable or interactive package derived from one or more Works.
- **Execution Surface** — a runtime or distribution target such as VRChat, Web, or VSR Room.
- **Audience** — participants who discover or use published experiences. R0.1 does not create an audience identity graph.

The canonical relationship is:

```text
Creator → Work → Experience → Execution Surface
```

A platform-specific deployment is a projection of an Experience, not the canonical Experience record.

## 4. R0.1 information architecture

The public site exposes these routes:

- `/` — public home and proposition
- `/discover` — browsable creator/work/experience discovery surface
- `/creators` — creator directory
- `/works` — registered work directory
- `/experiences` — experience directory and execution-surface projections
- `/studio` — creator entry point and explanation of the governed publication flow
- `/registry` — public registry projection explaining canonical objects and authority boundaries
- `/commons` — collaboration/program surface
- `/about` — purpose, operating model, and federation relationship
- `/health` — existing machine health route
- `/.well-known/estate-site` — existing federation metadata route

R0.1 may use static or repository-backed sample records. It must not imply that unimplemented account creation, authentication, payments, or registry writes are live.

## 5. Homepage contract

The homepage must make the product legible in one screen.

Primary heading:

> **Creators Common**

Primary proposition:

> **Create work. Establish provenance. Build experiences. Publish across worlds.**

Primary actions:

1. **Explore the Common** → `/discover`
2. **Enter as a Creator** → `/studio`
3. **Build an Experience** → `/experiences`

The homepage must also show the core flow:

```text
Registered Work → Experience Package → VRChat / Web / VSR
```

The existing federation relationship to Believers Common and Virtual Silk Road remains visible but secondary to the creator product proposition.

## 6. Page contracts

### 6.1 `/discover`

Purpose: show the Common as a navigable portfolio rather than a marketing-only site.

R0.1 provides three discovery categories:

- Creators
- Works
- Experiences

Each card must identify its object type and use explicit status language such as `Registered`, `Candidate`, or `Published`. Cards must not display fabricated metrics.

### 6.2 `/creators`

Purpose: public creator directory.

Each creator card/profile may display:

- display name
- creator category
- short public description
- linked Works
- linked Experiences
- admitted execution surfaces

R0.1 does not expose private identity attributes or claim that a public profile is itself a DigitalMe record.

### 6.3 `/works`

Purpose: show registered creative works and their provenance relationship.

Each Work may display:

- Work title
- creator attribution
- work category
- public provenance state
- experience count
- public rights/provenance note

The UI must distinguish provenance evidence from ownership claims. If no rights evidence is available in the R0.1 fixture, use neutral language such as `Provenance record available in registry projection` rather than `Owned by`.

### 6.4 `/experiences`

Purpose: make executable distribution the differentiating product surface.

Each Experience may display:

- Experience name
- source Work(s)
- creator
- package state
- execution surfaces
- publication state

The first reference execution surface is VRChat. Web and VSR may be shown as supported architectural targets only when their records are explicitly marked as `Candidate` or `Planned`; do not present them as deployed if no evidence exists.

### 6.5 `/studio`

Purpose: explain the creator operating flow without implementing identity issuance or registry mutation in R0.1.

The visible flow is:

```text
1. Establish creator relationship
2. Register a Work
3. Create an Experience Package
4. Select an execution surface
5. Qualify publication
6. Publish through the platform adapter
```

R0.1 Studio is an informational/onboarding surface. Any call to action that would require a live workflow must be labeled `Request access`, `Start qualification`, or equivalent and may link to an explicit existing intake path only if that path is verified during implementation.

### 6.6 `/registry`

Purpose: expose the public system model and prevent authority ambiguity.

It must state:

- Genesis/registry records are canonical for registered objects when integrated.
- DigitalMe represents actor identity relationships.
- Warden governs admission/authority decisions.
- River preserves evidence when integrated.
- Creators Common is a public projection and creator operating surface.
- Third-party platforms remain authoritative for their own runtime and native commerce.

### 6.7 `/commons`

Purpose: show collaboration/program structure rather than social-feed behavior.

R0.1 may present curated collaboration types such as:

- creator × creator
- creator × brand
- creator × venue/event
- creator × execution platform

No messaging, follower graph, or social feed is introduced in R0.1.

### 6.8 `/about`

Purpose: concise explanation of Creators Common, its relation to Believers Common and Virtual Silk Road, and the non-duplication principle.

## 7. Runtime and platform adapter boundary

R0.1 introduces the concept of an execution adapter but does not implement the full VRChat Unity build hook in the website repository.

The website can describe and render platform bindings such as:

```text
Experience
  └─ VRChat
       ├─ package state
       ├─ runtime variant(s)
       └─ publication state
```

The future VRChat adapter remains a separate executable integration boundary that can use the VRChat SDK build callback and Blueprint ID binding defined in the wider architecture. The public site must not claim that this adapter is operational until repository-backed evidence exists.

## 8. Technical direction

R0.1 should evolve the current repository rather than create a second canonical web repository.

Recommended implementation shape:

- retain the existing repository as canonical source
- introduce a lightweight application structure suitable for multiple routes
- preserve current static machine endpoints
- avoid backend/database dependencies in R0.1
- use local typed/static fixture data for creator/work/experience examples
- keep data access behind a small repository interface so a later Genesis/registry source can replace fixture data without rewriting page components

A framework migration is permitted if it provides route composition, reusable components, and deterministic Vercel deployment without introducing a server/database requirement. Next.js static rendering is the preferred direction if a framework is selected.

## 9. Visual direction

The site should feel like an operating common, not a generic portfolio template.

Design principles:

- editorial, spatial, and registry-aware
- strong typography and generous spacing
- explicit object/state labels
- limited decorative chrome
- responsive from mobile through desktop
- accessible semantic navigation and headings
- system-level credibility over consumer-social styling

The product flow `Creator → Work → Experience → Surface` should appear as a recurring visual system.

## 10. Governance and privacy constraints

R0.1 must fail closed on authority claims.

The site must not:

- mint DigitalMe identities
- represent a browser session as Warden authorization
- write directly to River from unauthenticated client code
- expose secrets or private environment credentials
- create a shared cookie across Creators Common, Believers Common, and VSR
- infer legal ownership from public attribution
- present third-party platform roles as Creators Common authority roles

The existing `Permissions-Policy` restriction for camera, microphone, and geolocation remains in force unless a later approved feature requires a scoped change.

## 11. Data model for R0.1 fixtures

Implementation should use a small typed schema with these public fields.

```text
CreatorRecord
- id
- slug
- displayName
- category
- summary
- workIds[]
- experienceIds[]
- status

WorkRecord
- id
- slug
- title
- creatorId
- category
- provenanceState
- summary
- experienceIds[]

ExperienceRecord
- id
- slug
- name
- creatorId
- workIds[]
- packageState
- publicationState
- surfaces[]

ExecutionSurfaceRecord
- id
- provider
- state
- label
```

All fixture identifiers must be obviously non-authoritative examples unless they correspond to an existing verified registry record.

## 12. Error and empty-state behavior

- Unknown slugs return a standard not-found surface.
- Empty directories explain that no public records are available rather than inventing entries.
- Machine endpoints continue to return machine-readable responses.
- Missing optional metadata must render as absent/unknown, not synthesized.
- External links use safe rel attributes where appropriate.

## 13. Deployment contract

R0.1 keeps GitHub `main` as the production source branch and Vercel as the hosting target.

Release path:

1. implement on a feature branch
2. run local/static validation and tests
3. open a PR into `main`
4. inspect Vercel preview when the project connection is established
5. verify `/`, `/discover`, `/creators`, `/works`, `/experiences`, `/studio`, `/registry`, `/commons`, `/about`, `/health`, and `/.well-known/estate-site`
6. merge only after validation is healthy
7. attach/verify `creators-common.org` and `www.creators-common.org` on the production project
8. confirm canonical-domain behavior

No DNS or domain mutation is performed blindly; the implementation step must inspect the Vercel project/domain state first.

## 14. Acceptance criteria

R0.1 is acceptable when all of the following are evidenced:

1. Existing federation metadata and health routes still work.
2. Existing Warden/authority semantics are unchanged.
3. The nine human-facing routes render successfully.
4. Navigation works on mobile and desktop.
5. Creator, Work, Experience, and execution-surface states are represented without fabricated metrics or authority claims.
6. The homepage clearly communicates the create/provenance/experience/distribution proposition.
7. The Studio explains the governed publication flow without pretending live identity or registry mutation exists.
8. Automated validation covers routing, machine endpoints, and core object-schema integrity.
9. Vercel preview is inspected before production merge when available.
10. Production domain attachment is verified separately from application correctness.

## 15. Explicit non-goals for R0.1

R0.1 does not implement:

- user authentication
- DigitalMe issuance
- Warden decision service calls
- River writes
- Genesis database writes
- payments or SILK settlement
- VRChat Unity build hooks
- direct VRChat API account linking
- creator messaging
- follower/social graph
- recommendation algorithms
- private analytics or telemetry collection

These are intentionally excluded so the first release proves the public product model and deployment boundary without overstating runtime integration.

## 16. Next implementation boundary

The first implementation plan should cover only the public R0.1 application and Vercel project/deployment setup. The VRChat execution adapter must receive its own later spec and plan because it is an independent executable subsystem with different tooling, security, and test requirements.
