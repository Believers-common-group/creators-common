# Creators Common R0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current single-page placeholder with a backend-free, static-exported Creators Common application that exposes the approved creator/work/experience operating model while preserving existing Warden, federation, and machine-endpoint contracts.

**Architecture:** Migrate the repository to a Next.js 16.3.4 App Router application configured for static export. Keep public data behind a small typed repository interface backed only by explicit example fixtures in R0.1. Preserve `/health` and `/.well-known/estate-site` via public JSON files plus the existing Vercel rewrites, and keep all authority/identity/runtime integrations descriptive rather than executable.

**Tech Stack:** Node.js 24 LTS; Next.js 16.3.4 Active LTS; React 19.2.x; TypeScript; Vitest 5; CSS modules/global CSS; Vercel static deployment.

**Spec:** `docs/superpowers/specs/2026-09-08-creators-common-r0.1-design.md`

## Global Constraints

- Canonical domain remains `https://creators-common.org`.
- Preserve `site_id=cc`, `APP-CC-001`, `REG-SITE-001`, `ALPHA-NODE-001`, `authority_boundary=WARDEN`, `NO_SHARED_CROSS_DOMAIN_COOKIE`, and `SCAFFOLDED_NOT_ACTIVATED` handoff semantics.
- Preserve `/health` and `/.well-known/estate-site` machine contracts.
- No authentication, DigitalMe issuance, Warden calls, River writes, Genesis writes, payments, VRChat build hooks, cross-domain cookies, private analytics, or secrets in R0.1.
- Example records must use identifiers beginning `EXAMPLE-` and must be visibly labeled as demonstration data.
- Third-party runtime/platform states may only be shown as `Candidate`, `Planned`, or otherwise explicitly non-operational unless evidence exists.
- Production source branch remains `main`; implementation occurs on a feature branch and reaches production through PR validation.

---

### Task 1: Establish the static Next.js application baseline

**Files:**
- Create: `package.json`
- Create: `package-lock.json` via `npm install`
- Create: `.gitignore`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `public/health.json`
- Create: `public/estate-site.json`
- Delete after migration: `index.html`, root `health.json`, root `estate-site.json`
- Modify: `vercel.json`
- Test: `tests/machine-contracts.test.ts`

**Interfaces:**
- Produces a static-exportable App Router project and immutable machine metadata in `public/`.
- `next.config.ts` exports `{ output: "export" }` and does not enable server-only features.
- `vercel.json` retains `cleanUrls`, `trailingSlash: false`, existing security headers, and rewrites `/health -> /health.json`, `/.well-known/estate-site -> /estate-site.json`.

- [ ] **Step 1: Write the machine-contract test first**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));

describe("machine contracts", () => {
  it("preserves estate authority metadata", () => {
    const estate = readJson("public/estate-site.json");
    expect(estate.site_id).toBe("cc");
    expect(estate.app_id).toBe("APP-CC-001");
    expect(estate.registry_object).toBe("REG-SITE-001");
    expect(estate.alpha_node_id).toBe("ALPHA-NODE-001");
    expect(estate.authority_boundary).toBe("WARDEN");
    expect(estate.session_policy).toBe("NO_SHARED_CROSS_DOMAIN_COOKIE");
    expect(estate.handoff_status).toBe("SCAFFOLDED_NOT_ACTIVATED");
  });
});
```

- [ ] **Step 2: Run `npm test -- tests/machine-contracts.test.ts` and verify RED because the Next/public scaffold does not exist yet.**
- [ ] **Step 3: Add the minimal Next.js scaffold and move the two JSON contracts into `public/` without changing their semantic values.**
- [ ] **Step 4: Run `npm test -- tests/machine-contracts.test.ts`, `npm run typecheck`, and `npm run build`; require all three to exit 0.**
- [ ] **Step 5: Delete the obsolete static root files only after the export contains `out/index.html`, `out/health.json`, and `out/estate-site.json`.**
- [ ] **Step 6: Commit as `feat(web): establish Creators Common app baseline`.**

### Task 2: Implement the typed public registry projection

**Files:**
- Create: `lib/registry/types.ts`
- Create: `lib/registry/fixtures.ts`
- Create: `lib/registry/repository.ts`
- Test: `tests/registry.test.ts`

**Interfaces:**
- `getCreators(): CreatorRecord[]`
- `getWorks(): WorkRecord[]`
- `getExperiences(): ExperienceRecord[]`
- `getExecutionSurfaces(): ExecutionSurfaceRecord[]`
- Fixtures use only `EXAMPLE-*` identifiers and an explicit `isExample: true` marker.

- [ ] **Step 1: Write failing integrity tests covering unique ids/slugs, valid creator/work references, valid surface references, and the `EXAMPLE-` prefix rule.**
- [ ] **Step 2: Run `npm test -- tests/registry.test.ts` and verify RED.**
- [ ] **Step 3: Implement the four record types, small example fixture set, and repository accessors.**
- [ ] **Step 4: Run the registry tests and require 0 failures.**
- [ ] **Step 5: Commit as `feat(registry): add typed public projection fixtures`.**

### Task 3: Build the shared operating-common visual system

**Files:**
- Create: `components/site-header.tsx`
- Create: `components/site-footer.tsx`
- Create: `components/page-intro.tsx`
- Create: `components/status-pill.tsx`
- Create: `components/object-card.tsx`
- Create: `components/flow-rail.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- `StatusPill` renders explicit state text; it never converts state into an authority claim.
- `ObjectCard` receives `kind`, `title`, `summary`, `status`, and optional metadata rows.
- `FlowRail` renders `Creator → Work → Experience → Surface` as the recurring product grammar.

- [ ] **Step 1: Add compile-time usage of each component from the home page before implementation so typecheck fails for missing modules.**
- [ ] **Step 2: Run `npm run typecheck` and verify RED.**
- [ ] **Step 3: Implement semantic header/footer, accessible focus states, responsive typography/layout, cards, state labels, and the flow rail using CSS only; do not add client JavaScript unless required for navigation accessibility.**
- [ ] **Step 4: Run `npm run typecheck` and `npm run build`; require both to exit 0.**
- [ ] **Step 5: Commit as `feat(ui): establish Creators Common visual system`.**

### Task 4: Implement the public discovery routes

**Files:**
- Modify: `app/page.tsx`
- Create: `app/discover/page.tsx`
- Create: `app/creators/page.tsx`
- Create: `app/works/page.tsx`
- Create: `app/experiences/page.tsx`

**Interfaces:**
- Home actions: `/discover`, `/studio`, `/experiences`.
- Discovery pages consume only `lib/registry/repository.ts`.
- VRChat may appear as a reference execution surface; Web/VSR records remain explicitly non-operational unless fixture state says otherwise.

- [ ] **Step 1: Add `scripts/validate-export.mjs` assertions for `index.html`, `discover.html`, `creators.html`, `works.html`, and `experiences.html`, then run it against the current export and verify RED.**
- [ ] **Step 2: Implement the five routes with the approved proposition, object/state labels, demonstration-data disclosure, neutral provenance language, and no fabricated metrics.**
- [ ] **Step 3: Run `npm run build && node scripts/validate-export.mjs`; require all expected pages to exist.**
- [ ] **Step 4: Commit as `feat(web): add creator discovery surfaces`.**

### Task 5: Implement Studio, Registry, Commons, and About

**Files:**
- Create: `app/studio/page.tsx`
- Create: `app/registry/page.tsx`
- Create: `app/commons/page.tsx`
- Create: `app/about/page.tsx`
- Modify: `scripts/validate-export.mjs`

**Interfaces:**
- Studio shows exactly six stages: establish relationship; register Work; create Experience Package; select execution surface; qualify publication; publish through platform adapter.
- Registry page explicitly describes Genesis/registry, DigitalMe, Warden, River, Creators Common, and third-party runtime authority boundaries.
- Commons is collaboration/program structure only; no feed, followers, or messaging.

- [ ] **Step 1: Extend export validation for `studio.html`, `registry.html`, `commons.html`, and `about.html`; verify RED.**
- [ ] **Step 2: Implement all four pages, ensuring CTAs do not pretend account creation or live registry mutation exists.**
- [ ] **Step 3: Run `npm run build && npm run validate:export`; require all nine human-facing routes plus machine JSON files.**
- [ ] **Step 4: Commit as `feat(web): add governed creator operating pages`.**

### Task 6: Replace legacy CI with application validation and update deployment documentation

**Files:**
- Replace: `.github/workflows/validate-static-site.yml`
- Modify: `README.md`
- Modify: `package.json`
- Test: full CI-equivalent local command set

**Interfaces:**
- CI uses Node.js 24, `npm ci`, `npm test`, `npm run typecheck`, `npm run build`, and `npm run validate:export`.
- README changes the framework setting from `Other` to `Next.js`, records static-export behavior, states there are no required secrets, and preserves the safe PR → preview → merge release path.

- [ ] **Step 1: Update scripts so `npm run verify` executes tests, typecheck, build, and export validation sequentially.**
- [ ] **Step 2: Replace the old `index.html` grep workflow with Node application validation.**
- [ ] **Step 3: Update README deployment and governance documentation.**
- [ ] **Step 4: Run `npm ci && npm run verify` from a clean dependency install; require exit 0 and 0 test failures.**
- [ ] **Step 5: Commit as `ci: validate Creators Common application release`.**

### Task 7: Establish preview/deployment evidence without merging production

**Files:**
- No application source changes unless preview evidence reveals a defect.
- GitHub: open PR from the implementation branch into `main`.
- Vercel: create/link or deploy the `creators-common` project in team `faizahmed29-5330s-projects` only after application verification.

**Interfaces:**
- Production remains untouched until preview verification is complete.
- Verify `/`, `/discover`, `/creators`, `/works`, `/experiences`, `/studio`, `/registry`, `/commons`, `/about`, `/health`, and `/.well-known/estate-site` on the preview.
- Domain attachment for `creators-common.org` and `www.creators-common.org` is a separate gate; do not change DNS blindly.

- [ ] **Step 1: Create the implementation PR into `main` with acceptance checklist and explicit non-goals.**
- [ ] **Step 2: Inspect GitHub CI status for the PR head SHA; do not claim readiness unless all required checks are successful.**
- [ ] **Step 3: Inspect existing Vercel team/project state; if no project exists, establish a preview deployment using the connected Vercel deployment path and record the resulting project/deployment identifier.**
- [ ] **Step 4: Probe every required preview route and machine endpoint; record any failure instead of merging around it.**
- [ ] **Step 5: Inspect domain state separately. Only after preview correctness is evidenced should production domain attachment/repair be attempted.**
- [ ] **Step 6: Do not merge automatically as part of R0.1 setup unless the user separately authorizes production promotion.**

## Plan self-review

- Spec coverage: all nine human-facing routes, both machine endpoints, typed fixture integrity, governance constraints, CI, preview, and domain separation are mapped to tasks.
- Scope: VRChat Unity adapter, authentication, databases, settlement, telemetry, and registry writes remain excluded.
- Type/interface consistency: all pages consume the single registry repository interface; machine endpoints remain JSON files; the export validator is the route acceptance boundary.
- Placeholder scan: no implementation TBDs or undefined feature requirements remain.
