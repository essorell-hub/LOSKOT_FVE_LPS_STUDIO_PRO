import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";

export const V65_UNIFIED_APP_INTEGRATION_FOUNDATION_VERSION = "v65-unified-app-integration-foundation";

const MODULE_NAME = "unifiedAppIntegration";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: V65_UNIFIED_APP_INTEGRATION_FOUNDATION_VERSION,
      classicProUnchanged: true,
      whiteScreenGuard: true
    }
  });
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function moduleStatus(project = {}) {
  const runtime = project.runtime || {};
  const modules = runtime.modules || project.modules || {};
  return {
    fve: Boolean(project.fve || modules.fve),
    cad: Boolean(project.cad || modules.cad),
    lps: Boolean(project.lps || modules.lps),
    documents: Boolean(project.documents || modules.documents),
    qa: Boolean(project.qa || modules.qa),
    export: Boolean(project.export || modules.export)
  };
}

export function createUnifiedAppIntegration(options = {}) {
  function getPurpose() {
    return createResult("getPurpose", {
      version: V65_UNIFIED_APP_INTEGRATION_FOUNDATION_VERSION,
      purpose: "Sjednocení runtime modulů V49–V64 do jednoho aplikačního orchestrace layeru.",
      classicProUnchanged: true
    });
  }

  function getIntegrationStatus(project = {}) {
    const status = moduleStatus(project);
    const readyCount = Object.values(status).filter(Boolean).length;
    return createResult("getIntegrationStatus", {
      status,
      readyCount,
      total: Object.keys(status).length,
      percent: Math.round((readyCount / Object.keys(status).length) * 100),
      classicProUnchanged: true
    });
  }

  function buildSafeUiPacket(project = {}, context = {}) {
    const integration = getIntegrationStatus(project).data;
    return createResult("buildSafeUiPacket", {
      screen: context.screen || "full-app",
      integration,
      panels: [
        { key: "project", title: "Projekt", enabled: true },
        { key: "cad", title: "CAD / mapa", enabled: integration.status.cad },
        { key: "fve", title: "FVE", enabled: integration.status.fve },
        { key: "lps", title: "LPS / SPD", enabled: integration.status.lps },
        { key: "documents", title: "Dokumenty", enabled: integration.status.documents },
        { key: "qa", title: "QA", enabled: integration.status.qa },
        { key: "export", title: "Export", enabled: integration.status.export }
      ],
      fallbackUiRequired: integration.readyCount === 0,
      classicProUnchanged: true
    });
  }

  function validateNoWhiteScreen(project = {}, context = {}) {
    const packet = buildSafeUiPacket(project, context);
    return createResult("validateNoWhiteScreen", {
      pass: packet.ok && Boolean(packet.data),
      fallbackAvailable: true,
      packet: packet.data,
      classicProUnchanged: true
    });
  }

  function buildNextStepPlan(project = {}, context = {}) {
    const integration = getIntegrationStatus(project).data;
    const missing = Object.entries(integration.status).filter(([, value]) => !value).map(([key]) => key);
    return createResult("buildNextStepPlan", {
      missing,
      next: missing[0] || "integration-smoke-test",
      stage: "V65",
      classicProUnchanged: true
    });
  }

  function run(command, payload = {}) {
    if (command === "getPurpose") return getPurpose();
    if (command === "getIntegrationStatus") return getIntegrationStatus(payload.project || payload);
    if (command === "buildSafeUiPacket") return buildSafeUiPacket(payload.project || payload, payload.context || {});
    if (command === "validateNoWhiteScreen") return validateNoWhiteScreen(payload.project || payload, payload.context || {});
    if (command === "buildNextStepPlan") return buildNextStepPlan(payload.project || payload, payload.context || {});
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return {
    version: V65_UNIFIED_APP_INTEGRATION_FOUNDATION_VERSION,
    classicProUnchanged: true,
    getPurpose,
    getIntegrationStatus,
    buildSafeUiPacket,
    validateNoWhiteScreen,
    buildNextStepPlan,
    run
  };
}

export function safeUnifiedAppIntegration(options = {}) {
  try {
    return createUnifiedAppIntegration(options);
  } catch (error) {
    return {
      version: V65_UNIFIED_APP_INTEGRATION_FOUNDATION_VERSION,
      classicProUnchanged: true,
      run() {
        return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" });
      }
    };
  }
}

export default {
  V65_UNIFIED_APP_INTEGRATION_FOUNDATION_VERSION,
  createUnifiedAppIntegration,
  safeUnifiedAppIntegration
};

