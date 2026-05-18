// MEGA PACK I — V106–V110 Advanced QA / Norm Rulebook Engine - qaRuleExportV110
// Pure runtime helper. No DOM. No package dependency.

export function qaRuleExportV110(qaRules = [], options = {}) {
  const rules = Array.isArray(qaRules) ? qaRules : [];
  const errors = rules.filter((rule) => rule.severity === "ERROR").length;
  const warnings = rules.filter((rule) => rule.severity === "WARNING").length;
  const blockers = rules.filter((rule) => Boolean(rule.blocks_export ?? rule.blocksExport)).length;
  const needsReview = rules.filter((rule) => Boolean(rule.requires_manual_review)).length;

  return {
    pack: "I",
    module: "qaRuleExportV110",
    rules: rules.length,
    errors,
    warnings,
    blockers,
    needsReview,
    status: blockers > 0 || errors > 0 ? "ACTIVE" : "OK",
    generatedAt: options.now || new Date().toISOString(),
  };
}
