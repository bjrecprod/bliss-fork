// Loads .env.test into process.env BEFORE any module is require()'d.
// Critical for integration tests: DATABASE_URL should use role `bjrectest` and DB `bijoyai_test` (see apps/backend/.env.test).
// Needed for modules that read env at load time (e.g. encryption.js).

// Load test-specific overrides first (DATABASE_URL → bijoyai_test as bjrectest)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.test') });

// Then load root .env for all other vars (dotenv won't overwrite existing values)
require('dotenv').config({ path: path.resolve(__dirname, '../../../../../.env') });
