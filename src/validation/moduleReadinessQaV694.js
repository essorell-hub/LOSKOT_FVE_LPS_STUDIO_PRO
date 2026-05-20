function scanPlaceholder(value, path = "$", findings = []) {
  if (!value || typeof value !== "object") return findings;
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanPlaceholder(item, `${path}[${index}]`, findings));
    return findings;
  }
  if (value.isPlaceholder === true && value.normative !== false) {
    findings.push({
      id: "RELEASE-010",
      severity: "BLOCKER",
      sourceModule: "placeholder-guard",
      sourceId: path,
      message: "Placeholder calculation is not clearly marked as non-normative",
      ruleId: "RELEASE-010",
    });
  }
  Object.entries(value).forEach(([key, child]) => scanPlaceholder(child, `${path}.${key}`, findings));
  return findings;
}

export function evaluateModuleReadinessQaV694(project = {}) {
  return scanPlaceholder(project);
}
