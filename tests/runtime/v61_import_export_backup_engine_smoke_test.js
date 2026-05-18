
import assert from "node:assert/strict";
import { IMPORT_EXPORT_BACKUP_ENGINE_VERSION, createImportExportBackupEngine, safeImportExportBackupEngine } from "../../src/runtime/importExportBackupEngine.js";

assert.equal(IMPORT_EXPORT_BACKUP_ENGINE_VERSION, "v61-import-export-backup-engine");
const engine = createImportExportBackupEngine();
const project = { id: "PRJ1", name: "Zakázka", fve: { panels: [{ id: "P1" }] }, cad: { objects: [{ id: "C1" }] }, documents: [{ id: "D1" }] };

assert.equal(engine.listFormats().ok, true);
const exported = engine.exportProject(project);
assert.equal(exported.ok, true);
assert.equal(exported.data.manifest.counts.fvePanels, 1);
assert.equal(exported.data.manifest.classicProUnchanged, true);

const validation = engine.validateImportPayload(exported.data.project);
assert.equal(validation.ok, true);
assert.equal(validation.data.valid, true);

const imported = engine.importProject(exported.data.project, { mode: "validate-only" });
assert.equal(imported.ok, true);
assert.equal(imported.data.accepted, true);

const backup = engine.createBackupManifest(project);
assert.equal(backup.ok, true);
assert.equal(backup.data.classicProUnchanged, true);

const restore = engine.createRestorePlan(backup.data);
assert.equal(restore.ok, true);
assert.ok(restore.data.steps.length >= 4);

assert.equal(engine.run("missing", {}).ok, false);
assert.equal(safeImportExportBackupEngine().run("listFormats").ok, true);
console.log("v61 import export backup engine smoke test OK");

