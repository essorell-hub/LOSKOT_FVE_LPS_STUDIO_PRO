import {
  PROJECT_PERSISTENCE_QA_CODES_V761,
  createPersistenceQaFindingV761,
  isPlainObjectV761,
} from '../database/projectPersistenceContractV761.js';

function collectIds(items = []) {
  return new Set(
    (Array.isArray(items) ? items : [])
      .map((item) => item?.id || item?.stringId || item?.objectId || item?.uuid)
      .filter(Boolean),
  );
}

function collectReferences(value, keyMatcher, path = '$', output = []) {
  if (!value || typeof value !== 'object') return output;
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectReferences(item, keyMatcher, `${path}[${index}]`, output));
    return output;
  }

  Object.entries(value).forEach(([key, item]) => {
    if (keyMatcher(key) && typeof item === 'string') output.push({ id: item, path: `${path}.${key}` });
    collectReferences(item, keyMatcher, `${path}.${key}`, output);
  });
  return output;
}

export function runProjectReferenceIntegrityQaV792(payload = {}) {
  const findings = [];
  const unifiedProject = isPlainObjectV761(payload.unifiedProject) ? payload.unifiedProject : payload;
  const fve = unifiedProject.fve || unifiedProject.fveModule || {};
  const lps = unifiedProject.lps || unifiedProject.lpsModule || {};
  const cad = unifiedProject.cad || unifiedProject.cadObjects || {};

  const fveStringIds = collectIds(fve.strings || fve.pvStrings || []);
  const lpsObjectIds = collectIds(lps.objects || lps.zones || lps.airTerminals || []);
  const cadObjectIds = collectIds(cad.objects || cad.items || unifiedProject.cadObjects || []);

  collectReferences(unifiedProject, (key) => ['fveStringId', 'stringRef', 'referencedStringId'].includes(key)).forEach((ref) => {
    if (fveStringIds.size > 0 && !fveStringIds.has(ref.id)) {
      findings.push(createPersistenceQaFindingV761({
        code: PROJECT_PERSISTENCE_QA_CODES_V761.missingFveStringReference,
        severity: 'BLOCKER',
        message: 'Reference points to a missing FVE string.',
        path: ref.path,
        details: { id: ref.id },
      }));
    }
  });

  collectReferences(unifiedProject, (key) => ['cadObjectId', 'cadRef', 'referencedCadObjectId'].includes(key)).forEach((ref) => {
    if (cadObjectIds.size > 0 && !cadObjectIds.has(ref.id)) {
      findings.push(createPersistenceQaFindingV761({
        code: PROJECT_PERSISTENCE_QA_CODES_V761.missingCadObjectReference,
        severity: 'BLOCKER',
        message: 'Reference points to a missing CAD object.',
        path: ref.path,
        details: { id: ref.id },
      }));
    }
  });

  collectReferences(unifiedProject, (key) => ['lpsObjectId', 'lpsRef', 'referencedLpsObjectId'].includes(key)).forEach((ref) => {
    if (lpsObjectIds.size > 0 && !lpsObjectIds.has(ref.id)) {
      findings.push(createPersistenceQaFindingV761({
        code: PROJECT_PERSISTENCE_QA_CODES_V761.missingLpsObjectReference,
        severity: 'BLOCKER',
        message: 'Reference points to a missing LPS object.',
        path: ref.path,
        details: { id: ref.id },
      }));
    }
  });

  return {
    ok: findings.length === 0,
    qaFindings: findings,
    errors: findings,
    warnings: [],
  };
}
