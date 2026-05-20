import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { runProjectIntegrityQaV791 } from '../../src/validation/projectIntegrityQaV791.js';
import { runProjectReferenceIntegrityQaV792 } from '../../src/validation/projectReferenceIntegrityQaV792.js';
import { runProjectSchemaDriftQaV793 } from '../../src/validation/projectSchemaDriftQaV793.js';
import { runProjectPersistenceQaV794 } from '../../src/validation/projectPersistenceQaV794.js';
import { PROJECT_PERSISTENCE_FOREIGN_CONTENT_TERMS_V761 } from '../../src/database/projectPersistenceContractV761.js';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = resolve(here, '../fixtures/v761_v820');
const okFixture = JSON.parse(readFileSync(resolve(fixtureRoot, 'project_persistence_ok.json'), 'utf8'));
const corruptFixture = JSON.parse(readFileSync(resolve(fixtureRoot, 'project_persistence_corrupt.json'), 'utf8'));

assert.equal(runProjectIntegrityQaV791(okFixture).ok, true);
assert.equal(runProjectReferenceIntegrityQaV792(okFixture).ok, true);
assert.equal(runProjectSchemaDriftQaV793(okFixture).ok, true);

const integrity = runProjectIntegrityQaV791(corruptFixture);
assert.equal(integrity.ok, false);
assert.ok(integrity.qaFindings.some((finding) => finding.code === 'QA-DATA-013'));

const foreignIntegrity = runProjectIntegrityQaV791({
  ...okFixture,
  metadata: {
    guardProbe: PROJECT_PERSISTENCE_FOREIGN_CONTENT_TERMS_V761[0],
  },
});
assert.equal(foreignIntegrity.ok, false);
assert.ok(foreignIntegrity.qaFindings.some((finding) => finding.code === 'QA-DATA-012'));

const references = runProjectReferenceIntegrityQaV792(corruptFixture);
assert.equal(references.ok, false);
assert.ok(references.qaFindings.some((finding) => finding.code === 'QA-DATA-009'));
assert.ok(references.qaFindings.some((finding) => finding.code === 'QA-DATA-010'));
assert.ok(references.qaFindings.some((finding) => finding.code === 'QA-DATA-011'));

const persistence = runProjectPersistenceQaV794(corruptFixture);
assert.equal(persistence.ok, false);
assert.ok(persistence.qaFindings.some((finding) => finding.code === 'QA-DATA-014'));

console.log('V791_PROJECT_INTEGRITY_TEST=PASS');
