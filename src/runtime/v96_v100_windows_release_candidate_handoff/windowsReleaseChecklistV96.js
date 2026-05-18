// MEGA PACK G — V96–V100 Windows Release Candidate Handoff - windowsReleaseChecklistV96
// Pure runtime helper. No DOM. No package dependency.

export function windowsReleaseChecklistV96(project = {}, options = {}) {
  const qaResults = Array.isArray(project?.qa?.results) ? project.qa.results : [];
  const blocksExport = qaResults.filter((item) => Boolean(item.blocks_export ?? item.blocksExport)).length;
  const errors = qaResults.filter((item) => String(item.severity || "").toUpperCase() === "ERROR").length;
  const warnings = qaResults.filter((item) => String(item.severity || "").toUpperCase() === "WARNING").length;

  return {
    pack: "G",
    module: "windowsReleaseChecklistV96",
    purpose: "Windows candidate readiness, build checklist, release manifest, handoff report.",
    projectCode: project?.project?.project_code || "",
    blocksExport,
    errors,
    warnings,
    status: blocksExport > 0 ? "BLOCKED" : "OK",
    generatedAt: options.now || new Date().toISOString(),
  };
}
