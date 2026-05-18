
import assert from "node:assert/strict";
import {
  SQLITE_DATA_MODEL_VERSION,
  getV53InitialSchemaSql,
  createSqliteDataModel,
  safeSqliteDataModel
} from "../../src/runtime/sqliteDataModel.js";

assert.equal(SQLITE_DATA_MODEL_VERSION, "v53-sqlite-data-model-foundation");
const sql = getV53InitialSchemaSql();
assert.match(sql, /CREATE TABLE IF NOT EXISTS projects/);
assert.match(sql, /CREATE TABLE IF NOT EXISTS fve_panels/);
assert.match(sql, /CREATE TABLE IF NOT EXISTS cad_objects/);

const model = createSqliteDataModel();
const info = model.getSchemaInfo();
assert.equal(info.ok, true);
assert.ok(info.data.tables.includes("projects"));
assert.ok(info.data.tables.includes("graphic_symbols"));

const validation = model.validateSchema();
assert.equal(validation.ok, true);
assert.equal(validation.data.valid, true);

const payload = model.buildSqliteSyncPayload({
  id: "PRJ1",
  name: "Test",
  fve: { panels: [{ id: "P1", wattPeak: 450, vocV: 49 }] }
});
assert.equal(payload.ok, true);
assert.equal(payload.data.projects[0].id, "PRJ1");
assert.equal(payload.data.fve_panels.length, 1);

const exported = model.exportProjectJson({ id: "PRJ2" });
assert.equal(exported.ok, true);

const imported = model.importProjectJson(exported.data);
assert.equal(imported.ok, true);

const unsupported = model.run("missing", {});
assert.equal(unsupported.ok, false);

const safe = safeSqliteDataModel();
assert.equal(safe.getSchemaInfo().ok, true);

console.log("v53 sqlite data model smoke test OK");

