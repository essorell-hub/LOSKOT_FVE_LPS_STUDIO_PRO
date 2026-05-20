const FOREIGN_CONTENT_TERMS = ["Veolia", "FQ1", "S01BHE03", "DA"];

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function makeFinding(code, severity, message, path, source = "qa-v826") {
  return { code, severity, message, path, source };
}

function walk(value, visitor, path = "$") {
  visitor(value, path);
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, visitor, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => walk(child, visitor, `${path}.${key}`));
  }
}

export function normalizeQaFindings(findings = []) {
  return asArray(findings)
    .filter(Boolean)
    .map((finding, index) => ({
      code: finding.code || `QA_FINDING_${index + 1}`,
      severity: finding.severity || "INFO",
      message: finding.message || "QA finding",
      path: finding.path || "$",
      source: finding.source || "unknown",
      data: finding.data ? clone(finding.data) : undefined
    }));
}

export function collectForeignContentFindings(project = {}) {
  const findings = [];
  walk(project, (value, path) => {
    if (typeof value !== "string") return;
    for (const term of FOREIGN_CONTENT_TERMS) {
      if (value.includes(term)) {
        findings.push(makeFinding(
          "FOREIGN_CONTENT_BLOCKER",
          "BLOCKER",
          `Forbidden foreign content marker detected: ${term}`,
          path,
          "foreign-content-guard-v826"
        ));
      }
    }
  });
  return findings;
}

export function collectPlaceholderNormativeFindings(project = {}) {
  const findings = [];
  walk(project, (value, path) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return;
    const marker = String(value.kind || value.type || value.calculationType || value.status || "").toLowerCase();
    const looksPlaceholder = value.placeholder === true
      || marker.includes("placeholder")
      || marker.includes("mock")
      || marker.includes("stub")
      || marker.includes("todo");
    if (!looksPlaceholder) return;
    if (value.isPlaceholder !== true || value.normative !== false) {
      findings.push(makeFinding(
        "PLACEHOLDER_NORMATIVE_BLOCKER",
        "BLOCKER",
        "Placeholder calculation must be explicitly marked as isPlaceholder=true and normative=false.",
        path,
        "placeholder-guard-v826"
      ));
    }
  });
  return findings;
}

export function collectAllQaFindings(project = {}, inputs = {}) {
  return normalizeQaFindings([
    ...asArray(project.qaFindings),
    ...asArray(project.qa?.findings),
    ...asArray(inputs.qaFindings),
    ...collectForeignContentFindings(project),
    ...collectPlaceholderNormativeFindings(project)
  ]);
}

export function summarizeQa(findings = []) {
  const normalized = normalizeQaFindings(findings);
  const counts = { BLOCKER: 0, ERROR: 0, WARNING: 0, INFO: 0 };
  for (const finding of normalized) {
    const severity = counts[finding.severity] === undefined ? "INFO" : finding.severity;
    counts[severity] += 1;
  }
  return {
    total: normalized.length,
    counts,
    hasBlockers: counts.BLOCKER > 0,
    hasErrors: counts.ERROR > 0,
    hasWarnings: counts.WARNING > 0,
    highestSeverity: counts.BLOCKER ? "BLOCKER" : counts.ERROR ? "ERROR" : counts.WARNING ? "WARNING" : counts.INFO ? "INFO" : "NONE"
  };
}

export function evaluateReleaseGate(project = {}, inputs = {}) {
  const findings = collectAllQaFindings(project, inputs);
  const summary = summarizeQa(findings);
  const exportReady = inputs.exportReady !== false && !summary.hasBlockers && !summary.hasErrors;
  const releaseGo = exportReady && inputs.documentsReady !== false && inputs.bomReady !== false;
  return {
    releaseGo,
    exportReady,
    qaSummary: summary,
    qaFindings: findings,
    reasons: releaseGo ? [] : findings.filter((finding) => ["BLOCKER", "ERROR"].includes(finding.severity)).map((finding) => finding.code)
  };
}

export function createQaApplicationServiceV826() {
  return {
    collectAllQaFindings,
    summarizeQa,
    evaluateReleaseGate,
    collectForeignContentFindings,
    collectPlaceholderNormativeFindings
  };
}
