# Creators Common

Canonical source repository for the Creators Common public web surface.

## Site federation

Creators Common participates in `REG-SITE-001` with Believers Common and Virtual Silk Road.

- Site id: `cc`
- Canonical domain: `https://creators-common.org`
- Containing node: `ALPHA-NODE-001`
- Authority boundary: `WARDEN`
- Federation metadata: `/.well-known/estate-site`
- Health endpoint: `/health`

The public site is a projection. It must not self-issue DigitalMe identity, Warden authority, Registry truth, or cross-domain session credentials.

## Deployment contract

- Default and production source branch: `main`
- Hosting target: Vercel static deployment
- Project root: repository root (`.`)
- Public entry point: `index.html`
- Health endpoint: `/health`
- No database, AI-provider, or private runtime credentials are required by the current static site.

## Safe release path

1. Open a pull request into `main`.
2. Review the Vercel preview generated for the pull request when a Vercel project is connected.
3. Verify `/`, `/health`, and `/.well-known/estate-site` on the preview URL.
4. Merge only after validation is healthy.
5. Confirm that the production domain resolves to the merged `main` deployment.

## Vercel settings

Use the following project settings unless the application is deliberately migrated to a framework:

- Framework preset: `Other`
- Root directory: `.`
- Build command: leave empty
- Output directory: leave empty
- Install command: leave empty

The repository-level `vercel.json` supplies routing and baseline security headers. Environment variables shown in an older Vercel project should not be reintroduced unless future source code explicitly consumes them and their owner, purpose, and environment scope are documented.
