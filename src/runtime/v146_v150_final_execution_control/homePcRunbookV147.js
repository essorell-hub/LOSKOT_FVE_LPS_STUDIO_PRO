// MEGA PACK Q — V146–V150 Final Execution Control - homePcRunbookV147
// Pure runtime helper. No DOM. No package dependency.

export function homePcRunbookV147(executionState = {}, options = {}) {
  const checks = Array.isArray(executionState?.checks) ? executionState.checks : [];
  const logs = Array.isArray(executionState?.logs) ? executionState.logs : [];
  const workPcItems = Array.isArray(executionState?.workPcItems) ? executionState.workPcItems : [];

  const failedChecks = checks.filter((item) => item.status === "FAIL").length;
  const warningChecks = checks.filter((item) => item.status === "WARNING").length;
  const logErrors = logs.filter((item) => item.level === "ERROR").length;
  const openWorkPcItems = workPcItems.filter((item) => item.status !== "DONE").length;

  return {
    pack: "Q",
    module: "homePcRunbookV147",
    checks: checks.length,
    failedChecks,
    warningChecks,
    logs: logs.length,
    logErrors,
    workPcItems: workPcItems.length,
    openWorkPcItems,
    finalStatus: failedChecks === 0 && logErrors === 0 ? "GO" : "STOP",
    generatedAt: options.now || new Date().toISOString(),
  };
}
