// MEGA PACK F — V91–V95 Release Hardening / Diagnostics / Backup - runtimeHealthSummaryV95
// Pure runtime helper. No DOM. No package dependency.

export function runtimeHealthSummaryV95(project = {}, options = {}) {
  const qaResults = Array.isArray(project?.qa?.results) ? project.qa.results : [];
  const blocksExport = qaResults.filter((item) => Boolean(item.blocks_export ?? item.blocksExport)).length;
  const errors = qaResults.filter((item) => String(item.severity || "").toUpperCase() === "ERROR").length;
  const warnings = qaResults.filter((item) => String(item.severity || "").toUpperCase() === "WARNING").length;

  return {
    pack: "F",
    module: "runtimeHealthSummaryV95",
    purpose: "No-white-screen guard, diagnostika, recovery, backup/restore a release preflight.",
    projectCode: project?.project?.project_code || "",
    blocksExport,
    errors,
    warnings,
    status: blocksExport > 0 ? "BLOCKED" : "OK",
    generatedAt: options.now || new Date().toISOString(),
  };
}
