-- Rename the global native CSV adapter display label from Bliss to Bijoy.ai branding.
UPDATE "ImportAdapter"
SET name = 'Bijoy Native CSV'
WHERE name = 'Bliss Native CSV' AND "tenantId" IS NULL;
