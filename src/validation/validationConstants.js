export const VALIDATION_STATUS = Object.freeze({
  OK: "OK",
  WARNING: "WARNING",
  ERROR: "ERROR",
  REVIEW: "REVIEW",
  UNKNOWN: "UNKNOWN",
  PLACEHOLDER: "PLACEHOLDER"
});

export const VALIDATION_SEVERITY = Object.freeze({
  INFO: "INFO",
  WARNING: "WARNING",
  ERROR: "ERROR",
  CRITICAL: "CRITICAL"
});

export const QA_STATUS = VALIDATION_STATUS;
export const QA_SEVERITY = VALIDATION_SEVERITY;
export const WORKFLOW_STATUS = VALIDATION_STATUS;
export const WORKFLOW_SEVERITY = VALIDATION_SEVERITY;
export const WORKFLOW_QA_STATUS = VALIDATION_STATUS;
export const WORKFLOW_QA_SEVERITY = VALIDATION_SEVERITY;
export const ISSUE_STATUS = VALIDATION_STATUS;
export const ISSUE_SEVERITY = VALIDATION_SEVERITY;

export function normalizeValidationStatus(status) {
  if (!status) return VALIDATION_STATUS.UNKNOWN;
  const value = String(status).toUpperCase();
  return VALIDATION_STATUS[value] || value;
}

export function createValidationIssue(input = {}) {
  return {
    id: input.id || `issue-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    status: normalizeValidationStatus(input.status || VALIDATION_STATUS.WARNING),
    severity: input.severity || VALIDATION_SEVERITY.WARNING,
    message: input.message || "",
    module: input.module || "unknown",
    details: input.details || {}
  };
}

export function createValidationSummary(issues = []) {
  const list = Array.isArray(issues) ? issues : [];
  const errors = list.filter((item) =>
    item.status === VALIDATION_STATUS.ERROR ||
    item.severity === VALIDATION_SEVERITY.ERROR ||
    item.severity === VALIDATION_SEVERITY.CRITICAL
  );

  const warnings = list.filter((item) =>
    item.status === VALIDATION_STATUS.WARNING ||
    item.severity === VALIDATION_SEVERITY.WARNING
  );

  return {
    ok: errors.length === 0,
    status: errors.length ? VALIDATION_STATUS.ERROR : warnings.length ? VALIDATION_STATUS.WARNING : VALIDATION_STATUS.OK,
    issues: list,
    errors,
    warnings,
    counts: {
      total: list.length,
      errors: errors.length,
      warnings: warnings.length
    }
  };
}

export default {
  VALIDATION_STATUS,
  VALIDATION_SEVERITY,
  QA_STATUS,
  QA_SEVERITY,
  WORKFLOW_STATUS,
  WORKFLOW_SEVERITY,
  WORKFLOW_QA_STATUS,
  WORKFLOW_QA_SEVERITY,
  ISSUE_STATUS,
  ISSUE_SEVERITY,
  normalizeValidationStatus,
  createValidationIssue,
  createValidationSummary
};
