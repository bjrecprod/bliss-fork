# Bliss — Agent Instructions

See `CLAUDE.md` for full architecture, subsystem, and coding convention details.

## Cursor Cloud specific instructions

### Infrastructure (started automatically via Docker)

| Service | Container | Port | Notes |
|---------|-----------|------|-------|
| PostgreSQL 16 + pgvector | `bliss-postgres` | 5432 | User `bliss`, DB `bliss`. Test DB: `bliss_test` (user `bijoybenny`, trust auth) |
| Redis 7 | `bliss-redis` | 6379 | Password from `.env` `REDIS_PASSWORD` |

### Starting infrastructure

```bash
# Ensure Docker daemon is running
sudo dockerd &>/tmp/dockerd.log &
sleep 3
sudo chmod 666 /var/run/docker.sock

# Start containers (idempotent)
docker start bliss-postgres bliss-redis 2>/dev/null || \
  (PGPASS=$(grep '^POSTGRES_PASSWORD=' .env | cut -d= -f2) && \
   RDPASS=$(grep '^REDIS_PASSWORD=' .env | cut -d= -f2) && \
   docker run -d --name bliss-postgres -e POSTGRES_USER=bliss -e POSTGRES_PASSWORD="$PGPASS" -e POSTGRES_DB=bliss -p 5432:5432 pgvector/pgvector:pg16 && \
   docker run -d --name bliss-redis -p 6379:6379 redis:7-alpine redis-server --requirepass "$RDPASS")
```

### Starting dev services

```bash
pnpm dev   # starts api (3000), backend (3001), web (8080), docs (3002) in parallel
```

### Running tests

All 1178 tests (219 web + 428 api + 531 backend):

```bash
pnpm test          # all
pnpm test:web      # Vitest — 219 tests
pnpm test:api      # Vitest — 428 tests (needs bliss_test DB)
pnpm test:backend  # Jest — 531 tests (needs bliss_test DB)
```

Integration tests require the `bliss_test` database with pgvector extension and user `bijoybenny` (trust auth). If the test DB is missing:

```bash
docker exec bliss-postgres psql -U bliss -d bliss -c "CREATE DATABASE bliss_test;"
docker exec bliss-postgres psql -U bliss -d bliss_test -c "CREATE EXTENSION IF NOT EXISTS vector;"
docker exec bliss-postgres psql -U bliss -d bliss -c "CREATE ROLE bijoybenny WITH LOGIN SUPERUSER;"
# Add trust rule BEFORE the catch-all scram-sha-256 rule in pg_hba.conf
docker exec bliss-postgres bash -c "sed -i '/^host all all all scram-sha-256/i host all bijoybenny 0.0.0.0/0 trust' /var/lib/postgresql/data/pg_hba.conf"
docker exec bliss-postgres psql -U bliss -d bliss -c "SELECT pg_reload_conf();"
DATABASE_URL="postgresql://bijoybenny@localhost:5432/bliss_test" pnpm exec prisma migrate deploy --schema=prisma/schema.prisma
```

### Linting

```bash
pnpm --filter @bliss/web lint     # ESLint (--max-warnings 0)
pnpm --filter @bliss/api lint     # next lint
```

### Gotchas discovered during setup

- The `.env.test` files in `apps/api/` and `apps/backend/` use `postgresql://bijoybenny@localhost:5432/bliss_test` — this user must exist with trust auth in pg_hba.conf **before** the catch-all `scram-sha-256` rule.
- The `postinstall` script runs `prisma generate` automatically on `pnpm install`.
- The Prisma `package.json#prisma` config triggers a deprecation warning — safe to ignore.
- The signup API requires `countries`, `currencies`, and `bankIds` arrays (even if empty). Without them, it crashes with a `.length` error on undefined.
- Cookie `Secure` flag is set even in dev — use `Authorization: Bearer <token>` header for curl-based API testing instead of cookies.
- External API keys (Gemini, Plaid, TwelveData, CurrencyLayer) are optional; the app degrades gracefully without them.
