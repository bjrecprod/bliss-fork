# Status

## Current version

**0.2.0** (last updated: 2026-05-10)

## What is working

- Monorepo builds with workspace packages **`@bijoyai/{api,backend,web,docs,shared}`** and updated `pnpm-lock.yaml`.
- Core branding surfaced in web shell (titles, logos, onboarding, export filenames, CSV template path).
- Docker Compose aligns DB user/name **`bijoyai`** with `DATABASE_URL` for API and backend services.
- Spot checks: `@bijoyai/web` Vitest subsets (export hook, capybara, setup checklist); `@bijoyai/api` transactions-export unit tests.

## In progress

- Optional: rebuild and push container images under **`bjrecprod/bijoyai-*`** to Docker Hub (or migrate registry names).
- Residual Bliss mentions may remain in archived specs under `docs/specs/`; safe to prune or update incrementally.

## Blocked / dependencies

- None in-repo. Production **`bijoy.ai`** screenshots and badges in README assume deployed marketing assets.
