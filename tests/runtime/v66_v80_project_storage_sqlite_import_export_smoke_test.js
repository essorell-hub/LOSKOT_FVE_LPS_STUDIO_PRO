// LOSKOT V66/V76-V80 Project Storage + SQLite + Import/Export Smoke Test
// Run from repository root after SAFE PACK installation:
// node tests/runtime/v66_v80_project_storage_sqlite_import_export_smoke_test.js

import fs from "node:fs";
import assert from "node:assert/strict";
import {
  normalizeProjectV66,
  serializeProjectV66,
  parseProjectJsonV66,
  migrateProjectToV66,
  detectProjectSchemaV66,
  validateMigrationResultV66,
  buildProjectExportPackageV66,
  importProjectPackageV66,
  getSqliteSchemaV80,
} from "../../src/runtime/v66v80/index.js";

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const oldProject = loadJson("tests/fixtures/v66_v80/mega_b_old_project.json");
const okProject = loadJson("tests/fixtures/v66_v80/mega_b_project_ok.json");
const badProject = loadJson("tests/fixtures/v66_v80/mega_b_project_bad_export.json");

const oldSchema = detectProjectSchemaV66(oldProject);
assert.equal(oldSchema.needsMigration, true);

const migrated = migrateProjectToV66(oldProject);
const migrationCheck = validateMigrationResultV66(migrated);
assert.equal(migrationCheck.status, "OK");
assert.equal(migrated.project.schema_version, "v66-v80");

const normalized = normalizeProjectV66(okProject);
assert.equal(normalized.project.schema_version, "v66-v80");
assert.ok(Array.isArray(normalized.fve.panels));

const serialized = serializeProjectV66(normalized);
const parsed = parseProjectJsonV66(serialized);
assert.equal(parsed.project.project_code, "MEGA-B-OK");

const okExport = buildProjectExportPackageV66(okProject);
assert.equal(okExport.status, "READY_DEMO");
assert.equal(okExport.manifest.blocks_export, 0);
assert.ok(okExport.files.some((file) => file.path === "project.json"));

const imported = importProjectPackageV66({
  "project.json": okExport.files.find((file) => file.path === "project.json").content,
  "export_manifest.json": okExport.files.find((file) => file.path === "export_manifest.json").content,
});
assert.equal(imported.status, "OK");
assert.equal(imported.project.project.project_code, "MEGA-B-OK");

const badExport = buildProjectExportPackageV66(badProject);
assert.equal(badExport.status, "BLOCKED");
assert.ok(badExport.manifest.blocks_export > 0);

const schema = getSqliteSchemaV80();
assert.equal(schema.version, "v80_sqlite_foundation");
assert.ok(schema.statements.length >= 5);

console.log("===== LOSKOT V66/V76-V80 STORAGE SQLITE IMPORT EXPORT SMOKE TEST =====");
console.log("MIGRATION_STATUS=" + migrationCheck.status);
console.log("OK_EXPORT_STATUS=" + okExport.status);
console.log("BAD_EXPORT_STATUS=" + badExport.status);
console.log("SQL_SCHEMA_STATEMENTS=" + schema.statements.length);
console.log("RESULT=OK");
