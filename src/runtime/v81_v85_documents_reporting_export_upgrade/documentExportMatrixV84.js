// MEGA PACK E — V81–V85 Documents / Reporting / Export Upgrade - documentExportMatrixV84
// Pure runtime helper. No DOM. No package dependency.

export function documentExportMatrixV84(project = {}, options = {}) {
  const qaResults = Array.isArray(project?.qa?.results) ? project.qa.results : [];
  const blocksExport = qaResults.filter((item) => Boolean(item.blocks_export ?? item.blocksExport)).length;
  const errors = qaResults.filter((item) => String(item.severity || "").toUpperCase() === "ERROR").length;
  const warnings = qaResults.filter((item) => String(item.severity || "").toUpperCase() === "WARNING").length;

  return {
    pack: "E",
    module: "documentExportMatrixV84",
    purpose: "Dokumenty, reporty, exportní manifest, QA report a dokumentační view-model.",
    projectCode: project?.project?.project_code || "",
    blocksExport,
    errors,
    warnings,
    status: blocksExport > 0 ? "BLOCKED" : "OK",
    generatedAt: options.now || new Date().toISOString(),
  };
}
