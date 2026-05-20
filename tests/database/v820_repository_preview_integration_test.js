import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createProjectRepositoryMemoryAdapterV802 } from '../../src/database/projectRepositoryMemoryAdapterV802.js';
import { createProjectRepositoryJsonAdapterV803 } from '../../src/database/projectRepositoryJsonAdapterV803.js';
import {
  PROJECT_REPOSITORY_CAPABILITIES_V801,
  assertProjectRepositoryCapabilityV801,
} from '../../src/database/projectRepositoryContractV801.js';
import { createProjectRepositoryMigrationPlanV804 } from '../../src/database/projectRepositoryMigrationPlanV804.js';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = resolve(here, '../fixtures/v761_v820');
const okFixture = JSON.parse(readFileSync(resolve(fixtureRoot, 'project_persistence_ok.json'), 'utf8'));

const memory = createProjectRepositoryMemoryAdapterV802();
const saveResult = memory.save(okFixture);
assert.equal(saveResult.ok, true);
assert.equal(memory.list().data.length, 1);
assert.equal(memory.load(okFixture.projectId).data.projectName, okFixture.projectName);

const missingCapability = assertProjectRepositoryCapabilityV801(memory, PROJECT_REPOSITORY_CAPABILITIES_V801.exportJson);
assert.equal(missingCapability.ok, false);
assert.ok(missingCapability.qaFindings.some((finding) => finding.code === 'QA-DATA-015'));

const jsonAdapter = createProjectRepositoryJsonAdapterV803();
const exported = jsonAdapter.exportJson(okFixture.unifiedProject, {
  projectId: okFixture.projectId,
  projectName: okFixture.projectName,
  savedAt: okFixture.savedAt,
  documents: okFixture.documents,
  bom: okFixture.bom,
  exportManifest: okFixture.exportManifest,
});
assert.equal(exported.ok, true);

const imported = jsonAdapter.importJson(exported.data);
assert.equal(imported.ok, true);
assert.equal(imported.data.projectId, okFixture.projectId);

const migrationPlan = createProjectRepositoryMigrationPlanV804('LEGACY_UNKNOWN');
assert.equal(migrationPlan.planVersion, 'V804');
assert.ok(migrationPlan.steps.some((step) => step.id === 'migration-normalize-v761'));

console.log('V820_REPOSITORY_PREVIEW_INTEGRATION_TEST=PASS');
