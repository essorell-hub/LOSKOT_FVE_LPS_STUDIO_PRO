import { collectAllQaFindings, summarizeQa } from "./qaApplicationServiceV826.js";

export function buildDocumentPackage(project = {}, inputs = {}) {
  const documents = project.documents || {};
  const bomAvailable = inputs.bomReady !== false && (inputs.bom !== false);
  const packageItems = [
    { id: "technical-report", title: "Technical report", ready: documents.technicalReportReady !== false },
    { id: "qa-report", title: "QA report", ready: true },
    { id: "bom", title: "Bill of materials", ready: bomAvailable }
  ];
  return {
    ok: packageItems.every((item) => item.ready),
    data: {
      packageId: `docs-${project.projectId || project.id || "project"}`,
      items: packageItems,
      source: "documentsApplicationServiceV824"
    },
    warnings: packageItems.filter((item) => !item.ready).map((item) => `${item.id.toUpperCase()}_NOT_READY`),
    errors: [],
    qaFindings: collectAllQaFindings(project, inputs)
  };
}

export function buildQaReport(project = {}, inputs = {}) {
  const qaFindings = collectAllQaFindings(project, inputs);
  return {
    ok: true,
    data: {
      reportId: `qa-${project.projectId || project.id || "project"}`,
      summary: summarizeQa(qaFindings),
      findings: qaFindings
    },
    warnings: [],
    errors: [],
    qaFindings
  };
}

export function buildTechnicalReportSet(project = {}, inputs = {}) {
  const documentPackage = buildDocumentPackage(project, inputs);
  const qaReport = buildQaReport(project, inputs);
  return {
    ok: documentPackage.ok && qaReport.ok,
    data: {
      documents: documentPackage.data.items,
      qaReport: qaReport.data,
      projectId: project.projectId || project.id || null
    },
    warnings: [...documentPackage.warnings, ...qaReport.warnings],
    errors: [...documentPackage.errors, ...qaReport.errors],
    qaFindings: qaReport.qaFindings
  };
}

export function createDocumentsApplicationServiceV824() {
  return { buildDocumentPackage, buildQaReport, buildTechnicalReportSet };
}
