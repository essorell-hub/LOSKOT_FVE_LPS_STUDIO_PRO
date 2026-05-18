import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";



export const ERROR_RECOVERY_DIAGNOSTICS_VERSION = "v63-error-recovery-diagnostics";

const MODULE_NAME = "errorRecoveryDiagnostics";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: ERROR_RECOVERY_DIAGNOSTICS_VERSION,
      classicProUnchanged: true
    }
  });
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function nowIso() {
  return new Date().toISOString();
}

const ERROR_PATTERNS = [
  "TypeError",
  "ReferenceError",
  "SyntaxError",
  "FAILED",
  "test failed",
  "is not a function",
  "is not defined",
  "ERR_MODULE_NOT_FOUND",
  "Cannot read properties"
];

export function createErrorRecoveryDiagnostics(options = {}) {
  function listErrorPatterns() {
    return createResult("listErrorPatterns", ERROR_PATTERNS);
  }

  function scanLogText(logText = "") {
    const text = String(logText || "");
    const findings = [];
    ERROR_PATTERNS.forEach((pattern) => {
      const count = (text.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length;
      if (count) findings.push({ pattern, count, severity: pattern.includes("Syntax") || pattern.includes("Reference") ? "ERROR" : "WARNING" });
    });
    return createResult("scanLogText", {
      status: findings.some((item) => item.severity === "ERROR") ? "FAIL" : findings.length ? "WARNING" : "PASS",
      findings,
      classicProUnchanged: true
    });
  }

  function buildDiagnosticSnapshot(runtimeState = {}) {
    const state = runtimeState.data || runtimeState;
    return createResult("buildDiagnosticSnapshot", {
      createdAt: nowIso(),
      projectId: state.project?.projectId || state.project?.id || null,
      modules: state.modules || {},
      counts: {
        fvePanels: normalizeArray(state.project?.fve?.panels).length,
        cadObjects: normalizeArray(state.project?.cad?.objects).length,
        lpsObjects: normalizeArray(state.project?.lps?.objects || state.project?.lps?.components).length,
        documents: normalizeArray(state.project?.documents).length
      },
      classicProUnchanged: true
    });
  }

  function buildRecoveryPlan(diagnostic = {}) {
    const findings = normalizeArray(diagnostic.findings || diagnostic.data?.findings);
    const steps = [
      { key: "preserve_logs", label: "Uložit logy" },
      { key: "stop_new_runs", label: "Nepouštět další běhy" },
      { key: "identify_failed_step", label: "Najít selhaný krok" },
      { key: "prepare_fix_pack", label: "Připravit FIX balík" },
      { key: "rerun_verify", label: "Spustit verify po opravě" }
    ];
    return createResult("buildRecoveryPlan", {
      severity: findings.some((item) => item.severity === "ERROR") ? "ERROR" : findings.length ? "WARNING" : "NONE",
      steps,
      classicProUnchanged: true
    });
  }

  function wrapModuleResult(result = {}, context = {}) {
    if (result && typeof result === "object" && "ok" in result) {
      return createResult("wrapModuleResult", { result, context, safe: true });
    }
    return createResult("wrapModuleResult", { result, context, safe: true }, ["Výsledek modulu nebyl standardní runtime result."]);
  }

  function getWhiteScreenGuardStatus(runtimeState = {}) {
    const snapshot = buildDiagnosticSnapshot(runtimeState).data;
    return createResult("getWhiteScreenGuardStatus", {
      safeRenderRequired: true,
      fallbackUiRequired: true,
      moduleIsolationRequired: true,
      snapshot,
      classicProUnchanged: true
    });
  }

  function run(command, payload = {}) {
    if (command === "listErrorPatterns") return listErrorPatterns();
    if (command === "scanLogText") return scanLogText(payload.logText || payload.text || "");
    if (command === "buildDiagnosticSnapshot") return buildDiagnosticSnapshot(payload.runtimeState || payload);
    if (command === "buildRecoveryPlan") return buildRecoveryPlan(payload.diagnostic || payload);
    if (command === "wrapModuleResult") return wrapModuleResult(payload.result || payload, payload.context || {});
    if (command === "getWhiteScreenGuardStatus") return getWhiteScreenGuardStatus(payload.runtimeState || payload);
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return { version: ERROR_RECOVERY_DIAGNOSTICS_VERSION, classicProUnchanged: true, listErrorPatterns, scanLogText, buildDiagnosticSnapshot, buildRecoveryPlan, wrapModuleResult, getWhiteScreenGuardStatus, run };
}

export function safeErrorRecoveryDiagnostics(options = {}) {
  try { return createErrorRecoveryDiagnostics(options); } catch (error) {
    return { version: ERROR_RECOVERY_DIAGNOSTICS_VERSION, classicProUnchanged: true, run() { return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" }); } };
  }
}

export default { ERROR_RECOVERY_DIAGNOSTICS_VERSION, createErrorRecoveryDiagnostics, safeErrorRecoveryDiagnostics };

