import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { serializeProjectPersistenceV762 } from '../../src/database/projectPersistenceSerializerV762.js';
import { deserializeProjectPersistenceV763 } from '../../src/database/projectPersistenceDeserializerV763.js';
import { validateProjectPersistencePayloadV764 } from '../../src/database/projectPersistenceValidatorV764.js';
import { createProjectPersistenceSnapshotV765 } from '../../src/database/projectPersistenceSnapshotV765.js';
import { PROJECT_PERSISTENCE_FOREIGN_CONTENT_TERMS_V761 } from '../../src/database/projectPersistenceContractV761.js';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = resolve(here, '../fixtures/v761_v820');
const okFixture = JSON.parse(readFileSync(resolve(fixtureRoot, 'project_persistence_ok.json'), 'utf8'));
const corruptFixture = JSON.parse(readFileSync(resolve(fixtureRoot, 'project_persistence_corrupt.json'), 'utf8'));

const serialized = serializeProjectPersistenceV762(okFixture.unifiedProject, {
  projectId: okFixture.projectId,
  projectName: okFixture.projectName,
  savedAt: okFixture.savedAt,
  documents: okFixture.documents,
  bom: okFixture.bom,
  exportManifest: okFixture.exportManifest,
});

assert.equal(serialized.ok, true);
assert.equal(serialized.payload.projectId, okFixture.projectId);
assert.equal(serialized.payload.formatVersion, 'LOSKOT_PROJECT_PERSISTENCE_V761');
assert.ok(serialized.payload.integrity.checksumLikeFingerprint.startsWith('v761-'));

const deserialized = deserializeProjectPersistenceV763(serialized.payload);
assert.equal(deserialized.ok, true);
assert.equal(deserialized.project.projectName, okFixture.projectName);

const validation = validateProjectPersistencePayloadV764(corruptFixture);
assert.equal(validation.ok, false);
assert.ok(validation.qaFindings.some((finding) => finding.code === 'QA-DATA-001'));
assert.ok(validation.qaFindings.some((finding) => finding.code === 'QA-DATA-013'));

const foreignContentValidation = validateProjectPersistencePayloadV764({
  ...okFixture,
  metadata: {
    guardProbe: PROJECT_PERSISTENCE_FOREIGN_CONTENT_TERMS_V761[0],
  },
});
assert.equal(foreignContentValidation.ok, false);
assert.ok(foreignContentValidation.qaFindings.some((finding) => finding.code === 'QA-DATA-012'));

const snapshot = createProjectPersistenceSnapshotV765(serialized.payload, { createdAt: '2026-05-20T00:00:00.000Z' });
assert.equal(snapshot.projectId, okFixture.projectId);
assert.ok(snapshot.checksumLikeFingerprint.startsWith('v761-'));

console.log('V761_PROJECT_PERSISTENCE_TEST=PASS');
