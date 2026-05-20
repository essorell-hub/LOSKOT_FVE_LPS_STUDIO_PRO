export function createProjectPipelineStepV882(id, label, run) {
  return {
    id,
    label,
    run,
    required: true
  };
}

export function normalizeProjectPipelineStepResultV882(step, result = {}) {
  return {
    stepId: step.id,
    label: step.label,
    ok: result.ok !== false,
    data: result.data || null,
    warnings: Array.isArray(result.warnings) ? result.warnings : [],
    errors: Array.isArray(result.errors) ? result.errors : [],
    qaFindings: Array.isArray(result.qaFindings) ? result.qaFindings : []
  };
}
