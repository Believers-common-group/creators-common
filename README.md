# Creators Common

Canonical source repository for the Creators Common public web surface.

## Product boundary

Creators Common is the public operating and distribution common for creators.

> **Create work. Establish provenance. Build experiences. Publish across worlds.**

R0.1 exposes a typed public projection of `Creator → Work → Experience → Execution Surface`. It does not implement authentication, DigitalMe issuance, Warden decisions, River writes, Genesis writes, payments, VRChat build hooks, or private telemetry.

## Site federation

Creators Common participates in `REG-SITE-001` with Believers Common and Virtual Silk Road.

- Site id: `cc`
- App id: `APP-CC-001`
- Canonical domain: `https://creators-common.org`
- Containing node: `ALPHA-NODE-001`
- Authority boundary: `WARDEN`
- Federation metadata: `/.well-known/estate-site`
- Health endpoint: `/health`
- Session policy: `NO_SHARED_CROSS_DOMAIN_COOKIE`

The public site is a projection. It must not self-issue DigitalMe identity, Warden authority, Registry truth, or cross-domain session credentials.

## Application

- Framework: Next.js 16 App Router
- Rendering: static export (`output: "export"`)
- Runtime backend: none in R0.1
- Public fixture data: typed example records prefixed `EXAMPLE-`
- Required secrets: none

Human-facing routes:

- `/`
- `/discover`
- `/creators`
- `/works`
- `/experiences`
- `/studio`
- `/registry`
- `/commons`
- `/about`

Machine routes:

- `/health`
- `/.well-known/estate-site`

## Local verification

```bash
npm install
npm run verify
```

`verify` runs tests, TypeScript validation, the production static build, and export-artifact checks.

## Deployment contract

- Default and production source branch: `main`
- Hosting target: Vercel
- Project root: repository root (`.`)
- Framework preset: `Next.js`
- Build command: `npm run build`
- Static output: `out/`
- No database, AI-provider, or private runtime credentials are required by R0.1.

The repository-level `vercel.json` preserves the federation rewrites and baseline security headers, including the existing denial of camera, microphone, and geolocation access.

## Safe release path

1. Implement on a feature branch.
2. Open a pull request into `main`.
3. Require GitHub validation to pass.
4. Review the Vercel preview when the project connection is established.
5. Verify every human route plus `/health` and `/.well-known/estate-site` on preview.
6. Merge only after validation is healthy.
7. Treat `creators-common.org` and `www.creators-common.org` domain attachment as a separate production gate.

Do not reintroduce environment variables from older projects unless source code explicitly consumes them and their owner, purpose, and environment scope are documented.
