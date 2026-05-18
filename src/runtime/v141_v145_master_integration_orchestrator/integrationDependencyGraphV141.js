// MEGA PACK P — V141–V145 Master Integration Orchestrator - integrationDependencyGraphV141
// Pure runtime helper. No DOM. No package dependency.

export function integrationDependencyGraphV141(integrationState = {}, options = {}) {
  const packs = Array.isArray(integrationState?.packs) ? integrationState.packs : [];
  const blockers = packs.filter((item) => item.status === "BLOCKED" || item.status === "BLOCKED");
  const pending = packs.filter((item) => item.status === "PENDING");
  const ready = packs.filter((item) => item.status === "READY" || item.status === "OK");
  const integrated = packs.filter((item) => item.status === "INTEGRATED");

  const orderedCodes = packs.map((item) => item.code).join("");
  const expectedPrefix = options.expectedPrefix || "ABCDEFGHIJKLMNO";
  const sequenceLooksValid = orderedCodes.startsWith(expectedPrefix.slice(0, Math.min(orderedCodes.length, expectedPrefix.length)));

  return {
    pack: "P",
    module: "integrationDependencyGraphV141",
    totalPacks: packs.length,
    ready: ready.length,
    integrated: integrated.length,
    pending: pending.length,
    blockers: blockers.length,
    sequenceLooksValid,
    nextPack: pending[0]?.code || ready[0]?.code || "",
    status: blockers.length > 0 || !sequenceLooksValid ? "STOP" : "GO",
    generatedAt: options.now || new Date().toISOString(),
  };
}
