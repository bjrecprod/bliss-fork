# Bijoy.ai — agent notes

Upstream architecture and conventions live in `CLAUDE.md` (repo root and per-app).

## Local infra expectations

| Service | Default | Notes |
|--------|---------|--------|
| PostgreSQL (dev) | user/db **`bijoyai`** | Matches `docker-compose.yml` and `.env.example`. |
| PostgreSQL (Vitest/API + Jest/backend integration) | db **`bijoyai_test`**, role **`bjrectest`** | Set in `apps/api/.env.test` and `apps/backend/.env.test`; use trust auth for `bjrectest` **before** the global `scram-sha-256` rule in `pg_hba.conf` when running tests locally. |
| Redis | `REDIS_PASSWORD` from `.env` | Required for backend workers in dev. |

## Useful commands

```bash
pnpm install          # prisma generate runs via postinstall
pnpm dev              # api, backend, web, docs (parallel)
pnpm test             # all workspace test scripts
```

## Product identity

- **Domain:** `https://bijoy.ai`
- **App host (demo/help links):** `https://app.bijoy.ai`
- **Fork / PR target:** `https://github.com/bjrecprod/bliss-fork`
- **Primary demo tenant email (hosted demo only):** `bjrec@bijoy.ai` (see auth demo panel)
