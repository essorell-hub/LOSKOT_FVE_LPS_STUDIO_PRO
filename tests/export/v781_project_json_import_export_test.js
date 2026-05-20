import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { exportProjectToJsonPackageV781 } from '../../src/export/projectJsonExportV781.js';
import { importProjectFromJsonV782 } from '../../src/export/projectJsonImportV782.js';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = resolve(here, '../fixtures/v761_v820');
const okFixture = JSON.parse(readFileSync(resolve(fixtureRoot, 'project_persistence_ok.json'), 'utf8'));
const legacyFixture = JSON.parse(readFileSync(resolve(fixtureRoot, 'project_legacy_import_sample.json'), 'utf8'));

const exported = exportProjectToJsonPackageV781(okFixture.unifiedProject, {
  projectId: okFixture.projectId,
  projectName: okFixture.projectName,
  savedAt: okFixture.savedAt,
  documents: okFixture.documents,
  bom: okFixture.bom,
  exportManifest: okFixture.exportManifest,
});

assert.equal(exported.ok, true);
assert.equal(exported.package.packageVersion, 'LOSKOT_PORTABLE_PROJECT_PACKAGE_V783');
assert.equal(exported.package.readiness.ok, true);

const imported = importProjectFromJsonV782(exported.package);
assert.equal(imported.ok, true);
assert.equal(imported.normalizedProject.projectId, okFixture.projectId);

const legacyImport = importProjectFromJsonV782(legacyFixture);
assert.equal(legacyImport.ok, false);
assert.ok(legacyImport.qaFindings.some((finding) => finding.code === 'QA-DATA-003'));

console.log('V781_PROJECT_JSON_IMPORT_EXPORT_TEST=PASS');
