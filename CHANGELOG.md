# Changelog

All notable changes to this project are documented here. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] — 2026-05-10

### Changed

- GitHub repository URL updated to **`bjrecprod/bjfinance`** (rename from `bliss-fork`); docs, license links, and clone instructions use `cd bjfinance`.

## [0.2.0] — 2026-05-10

### Changed

- Rebrand UI, docs, scripts, OpenAPI titles, defaults, and wordmarks from Bliss to **Bijoy.ai** (`bijoy.ai` URLs, `@bijoyai/*` workspace packages).
- Default PostgreSQL/docker user and application database renamed to **`bijoyai`**; integration-test database **`bijoyai_test`** with dedicated role **`bjrectest`** (`apps/*/`.env.test).
- Repo and artifact references from upstream moved to **`bjrecprod/bjfinance`**; published Docker images use **`bjrecprod/bijoyai-api`**, **`bjrecprod/bijoyai-backend`**, **`bjrecprod/bijoyai-web`**.
- Native CSV naming: downloadable template **`bijoy-native-template.csv`**, transaction export filenames **`bijoy-export-YYYY-MM-DD.csv`**, seeded adapter display name **Bijoy Native CSV** (with Prisma migration to rename legacy rows).

## [0.1.0] — prior

- Inherited from upstream Bliss OSS baseline (`danielvsantos/bliss`).
