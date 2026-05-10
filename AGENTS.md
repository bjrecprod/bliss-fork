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

## Cursor Cloud / Docker (optional)

### Infrastructure (`bijoyai-postgres`, `bijoyai-redis`)

| Service | Container | Port | Notes |
|---------|-----------|------|-------|
| PostgreSQL 16 + pgvector | `bijoyai-postgres` | 5432 | User `bijoyai`, DB `bijoyai`. Test DB: `bijoyai_test` ( dedicated role **`bjrectest`**, trust auth locally) |
| Redis 7 | `bijoyai-redis` | 6379 | Password from `.env` → `REDIS_PASSWORD` |

```bash
# Start containers (idempotent) — snippet only; paths match typical Cursor sandboxes.
docker start bijoyai-postgres bijoyai-redis 2>/dev/null || \
  (PGPASS=$(grep '^POSTGRES_PASSWORD=' .env | cut -d= -f2) && \
   RDPASS=$(grep '^REDIS_PASSWORD=' .env | cut -d= -f2) && \
   docker run -d --name bijoyai-postgres -e POSTGRES_USER=bijoyai -e POSTGRES_PASSWORD="$PGPASS" -e POSTGRES_DB=bijoyai -p 5432:5432 pgvector/pgvector:pg16 && \
   docker run -d --name bijoyai-redis -p 6379:6379 redis:7-alpine redis-server --requirepass "$RDPASS")
```

### Running tests locally (integration DB)

Integration tests expect **`bijoyai_test`** with pgvector plus role **`bjrectest`** (trust auth before the SCRAM rule in `pg_hba.conf`). Example bootstrap:

```bash
docker exec bijoyai-postgres psql -U bijoyai -d bijoyai -c "CREATE DATABASE bijoyai_test;"
docker exec bijoyai-postgres psql -U bijoyai -d bijoyai_test -c "CREATE EXTENSION IF NOT EXISTS vector;"
docker exec bijoyai-postgres psql -U bijoyai -d bijoyai -c "CREATE ROLE bjrectest WITH LOGIN SUPERUSER;"
docker exec bijoyai-postgres bash -c "sed -i '/^host all all all scram-sha-256/i host all bjrectest 0.0.0.0/0 trust' /var/lib/postgresql/data/pg_hba.conf"
docker exec bijoyai-postgres psql -U bijoyai -d bijoyai -c "SELECT pg_reload_conf();"
```

### Linting

```bash
pnpm --filter @bijoyai/web lint
pnpm --filter @bijoyai/api lint
pnpm --filter @bijoyai/backend lint
```

### Gotchas

- `.env.test` overrides `DATABASE_URL` first; then tests layer fixed secrets (`ENCRYPTION_SECRET`, etc.).
- `postinstall` runs `prisma generate`.
- Signup API requires `countries`, `currencies`, and `bankIds` arrays (may be empty).
- Cookie `Secure` is enforced in production-like setups — prefer `Authorization: Bearer` for scripted API probes.

## Product identity

- **Domain:** https://bijoy.ai  
- **App host (demo):** https://app.bijoy.ai  
- **GitHub repo:** https://github.com/bjrecprod/bjfinance
- **Demo login (hosted demo UI):** `bjrec@bijoy.ai` (see auth panel on `app.bijoy.ai`)
