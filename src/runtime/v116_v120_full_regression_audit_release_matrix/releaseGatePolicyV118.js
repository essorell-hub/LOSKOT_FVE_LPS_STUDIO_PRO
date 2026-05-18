// MEGA PACK K — V116–V120 Full Regression / Audit / Release Matrix - releaseGatePolicyV118
// Pure runtime helper. No DOM. No package dependency.

export function releaseGatePolicyV118(matrix = [], options = {}) {
  const tests = Array.isArray(matrix) ? matrix : [];
  const passed = tests.filter((item) => item.status === "PASS").length;
  const failed = tests.filter((item) => item.status === "FAIL").length;
  const blocked = tests.filter((item) => item.blocks_release === true).length;

  return {
    pack: "K",
    module: "releaseGatePolicyV118",
    tests: tests.length,
    passed,
    failed,
    blocked,
    releaseAllowed: failed === 0 && blocked === 0,
    status: failed === 0 && blocked === 0 ? "GO" : "STOP",
    generatedAt: options.now || new Date().toISOString(),
  };
}
