// MEGA PACK O — V136–V140 Final Acceptance / Field Check Protocols - acceptanceGateV139
// Pure runtime helper. No DOM. No package dependency.

export function acceptanceGateV139(protocol = {}, options = {}) {
  const checks = Array.isArray(protocol?.checks) ? protocol.checks : [];
  const required = checks.filter((item) => item.required !== false);
  const passed = required.filter((item) => item.status === "PASS").length;
  const failed = required.filter((item) => item.status === "FAIL").length;
  const missing = required.filter((item) => !item.status || item.status === "MISSING").length;

  return {
    pack: "O",
    module: "acceptanceGateV139",
    checks: checks.length,
    required: required.length,
    passed,
    failed,
    missing,
    acceptanceAllowed: failed === 0 && missing === 0,
    status: failed === 0 && missing === 0 ? "ACCEPTED" : "BLOCKED",
    generatedAt: options.now || new Date().toISOString(),
  };
}
