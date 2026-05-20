export const DOCUMENT_TEMPLATE_VERSION_V631 = "V631";

export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function cleanText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value).trim();
}

export function getProjectIdentity(project = {}) {
  return {
    projectId: cleanText(project.projectId || project.id, ""),
    projectName: cleanText(project.projectName || project.name, ""),
    customerName: cleanText(project.customerName || project.customer?.name, ""),
    siteName: cleanText(project.siteName || project.site?.name, ""),
  };
}

export function normalizeQaFinding(finding = {}, defaults = {}) {
  const severity = cleanText(finding.severity || defaults.severity || "INFO", "INFO").toUpperCase();
  return {
    id: cleanText(finding.id || defaults.id || "QA-FINDING", "QA-FINDING"),
    severity,
    sourceModule: cleanText(finding.sourceModule || defaults.sourceModule || "project", "project"),
    sourceId: cleanText(finding.sourceId || defaults.sourceId || "", ""),
    message: cleanText(finding.message || defaults.message || "", ""),
    ruleId: cleanText(finding.ruleId || defaults.ruleId || finding.id || "QA-RULE", "QA-RULE"),
  };
}

export function collectProjectQaFindings(project = {}) {
  const direct = [
    ...asArray(project.qaFindings),
    ...asArray(project.qa?.findings),
    ...asArray(project.validation?.findings),
  ];

  const modules = [
    project.fve,
    project.pv,
    project.lps,
    project.spd,
    project.grounding,
    project.bonding,
  ];

  for (const module of modules) {
    direct.push(...asArray(module?.qaFindings));
    direct.push(...asArray(module?.qa?.findings));
  }

  return direct.map((finding, index) =>
    normalizeQaFinding(finding, { id: `QA-${String(index + 1).padStart(3, "0")}` }),
  );
}

export function summarizeQaFindings(findings = []) {
  const normalized = asArray(findings).map((finding, index) =>
    normalizeQaFinding(finding, { id: `QA-${String(index + 1).padStart(3, "0")}` }),
  );
  const bySeverity = normalized.reduce((acc, finding) => {
    acc[finding.severity] = (acc[finding.severity] || 0) + 1;
    return acc;
  }, {});
  const blockers = normalized.filter((finding) => finding.severity === "BLOCKER");
  const errors = normalized.filter((finding) => finding.severity === "ERROR");
  return {
    total: normalized.length,
    bySeverity,
    hasErrors: errors.length > 0,
    hasBlockers: blockers.length > 0,
    errors,
    blockers,
    findings: normalized,
  };
}

export function createDocumentTemplateV631({
  project = {},
  documentType = "document",
  title = "Project document",
  sections = [],
  qaFindings = collectProjectQaFindings(project),
  status = "draft",
} = {}) {
  const identity = getProjectIdentity(project);
  const normalizedSections = asArray(sections).map((section, index) => ({
    id: cleanText(section.id || `section-${index + 1}`, `section-${index + 1}`),
    title: cleanText(section.title || `Section ${index + 1}`, `Section ${index + 1}`),
    data: section.data ?? {},
    notes: asArray(section.notes).map((note) => cleanText(note)),
  }));

  return {
    modelVersion: DOCUMENT_TEMPLATE_VERSION_V631,
    documentType: cleanText(documentType, "document"),
    title: cleanText(title, "Project document"),
    status: cleanText(status, "draft"),
    project: identity,
    sections: normalizedSections,
    qaSummary: summarizeQaFindings(qaFindings),
  };
}
