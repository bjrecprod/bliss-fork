// Loads .env.test into process.env BEFORE any module is imported.
// Critical for integration tests: DATABASE_URL should target `bijoyai_test` as user `bjrectest`
// (see apps/api/.env.test). Modules that read env at load time (e.g. encryption.js) rely on this.
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load `.env.test` first (PostgreSQL role `bjrectest`, database `bijoyai_test`).
config({ path: resolve(__dirname, '../../.env.test') });

// Then load root .env for all other vars (dotenv won't overwrite existing values)
config({ path: resolve(__dirname, '../../../../.env') });

// Ensure required test defaults are always set (override any loaded value)
process.env.ENCRYPTION_SECRET = 'test-secret-that-is-exactly-32-by';
process.env.JWT_SECRET_CURRENT = 'test-jwt-secret';
process.env.INTERNAL_API_KEY = 'test-internal-api-key';
