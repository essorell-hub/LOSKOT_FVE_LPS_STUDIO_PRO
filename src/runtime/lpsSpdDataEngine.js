import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";



export const LPS_SPD_DATA_ENGINE_VERSION = "v56-lps-spd-data-engine";

const MODULE_NAME = "lpsSpdDataEngine";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: LPS_SPD_DATA_ENGINE_VERSION,
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

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

const LPS_TYPES = ["airTerminal", "downConductor", "hviRoute", "grounding", "bonding", "spd", "lpz"];
const SPD_TYPES = ["T1", "T1+T2", "T2", "T2+T3", "T3"];

function normalizeLpsComponent(component = {}) {
  return {
    id: normalizeString(component.id || component.componentId, ""),
    componentType: normalizeString(component.componentType || component.type, "unknown"),
    label: normalizeString(component.label || component.name, "LPS prvek"),
    x: finiteNumber(component.x, 0),
    y: finiteNumber(component.y, 0),
    z: finiteNumber(component.z, 0),
    material: normalizeString(component.material, ""),
    manufacturer: normalizeString(component.manufacturer, ""),
    model: normalizeString(component.model, ""),
    layerId: normalizeString(component.layerId, "lps.components"),
    payload: component.payload || component
  };
}

function normalizeSpd(spd = {}) {
  return {
    id: normalizeString(spd.id || spd.spdId, ""),
    side: normalizeString(spd.side, "UNKNOWN"),
    spdType: normalizeString(spd.spdType || spd.type, "UNKNOWN"),
    lpzFrom: normalizeString(spd.lpzFrom, ""),
    lpzTo: normalizeString(spd.lpzTo, ""),
    manufacturer: normalizeString(spd.manufacturer, ""),
    model: normalizeString(spd.model, ""),
    status: normalizeString(spd.status, "DRAFT")
  };
}

export function createLpsSpdDataEngine(options = {}) {
  function normalizeProject(project = {}) {
    const lps = project.lps || {};
    return {
      ...project,
      lps: {
        ...lps,
        components: normalizeArray(lps.components || lps.objects).map(normalizeLpsComponent),
        spdDevices: normalizeArray(lps.spdDevices || lps.spd).map(normalizeSpd),
        lpzZones: normalizeArray(lps.lpzZones || lps.lpz),
        groundingSystems: normalizeArray(lps.groundingSystems || lps.grounding),
        riskAssessmentNormative: lps.riskAssessmentNormative === true
      }
    };
  }

  function listLpsTypes() {
    return createResult("listLpsTypes", { lpsTypes: LPS_TYPES, spdTypes: SPD_TYPES });
  }

  function buildLpsSummary(project = {}) {
    const normalized = normalizeProject(project);
    const components = normalized.lps.components;
    const spdDevices = normalized.lps.spdDevices;
    const byType = {};
    components.forEach((item) => {
      byType[item.componentType] = (byType[item.componentType] || 0) + 1;
    });
    return createResult("buildLpsSummary", {
      componentCount: components.length,
      spdCount: spdDevices.length,
      lpzCount: normalized.lps.lpzZones.length,
      groundingCount: normalized.lps.groundingSystems.length,
      byType,
      riskAssessmentNormative: normalized.lps.riskAssessmentNormative,
      classicProUnchanged: true
    }, normalized.lps.riskAssessmentNormative ? [] : ["LPS risk assessment je zatím placeholder, ne finální normový výpočet."]);
  }

  function validateSpdCoordination(project = {}) {
    const normalized = normalizeProject(project);
    const issues = [];
    normalized.lps.spdDevices.forEach((spd) => {
      if (!SPD_TYPES.includes(spd.spdType)) {
        issues.push({ key: "spd.type.valid", severity: "WARNING", status: "WARNING", spdId: spd.id, message: `SPD ${spd.id || "unknown"} má neznámý typ.` });
      }
      if (!spd.lpzFrom || !spd.lpzTo) {
        issues.push({ key: "spd.lpz.boundary", severity: "WARNING", status: "WARNING", spdId: spd.id, message: `SPD ${spd.id || "unknown"} nemá LPZ hranici.` });
      }
    });
    return createResult("validateSpdCoordination", { status: issues.length ? "WARNING" : "PASS", issues });
  }

  function buildDehnDeviceCandidates(project = {}) {
    const normalized = normalizeProject(project);
    const candidates = normalized.lps.spdDevices.map((spd) => ({
      spdId: spd.id,
      side: spd.side,
      requiredType: spd.spdType,
      manufacturerPreferred: spd.manufacturer || "DEHN",
      note: "Kandidát zařízení, ne finální normový výběr."
    }));
    return createResult("buildDehnDeviceCandidates", { candidates }, ["DEHN výběr je zatím datový kandidát, ne finální normový návrh."]);
  }

  function buildSqliteSyncPayload(project = {}) {
    const normalized = normalizeProject(project);
    return createResult("buildSqliteSyncPayload", {
      lps_components: normalized.lps.components,
      spd_devices: normalized.lps.spdDevices,
      lpz_zones: normalized.lps.lpzZones,
      grounding_systems: normalized.lps.groundingSystems
    });
  }

  function buildDocumentContext(project = {}) {
    const summary = buildLpsSummary(project);
    const spd = validateSpdCoordination(project);
    return createResult("buildDocumentContext", {
      summary: summary.data,
      spdValidation: spd.data,
      normativeWarning: summary.warnings[0] || null,
      classicProUnchanged: true
    }, [...summary.warnings, ...spd.warnings]);
  }

  function run(command, payload = {}) {
    if (command === "normalizeProject") return createResult("normalizeProject", normalizeProject(payload.project || payload));
    if (command === "listLpsTypes") return listLpsTypes();
    if (command === "buildLpsSummary") return buildLpsSummary(payload.project || payload);
    if (command === "validateSpdCoordination") return validateSpdCoordination(payload.project || payload);
    if (command === "buildDehnDeviceCandidates") return buildDehnDeviceCandidates(payload.project || payload);
    if (command === "buildSqliteSyncPayload") return buildSqliteSyncPayload(payload.project || payload);
    if (command === "buildDocumentContext") return buildDocumentContext(payload.project || payload);
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return { version: LPS_SPD_DATA_ENGINE_VERSION, classicProUnchanged: true, normalizeProject, listLpsTypes, buildLpsSummary, validateSpdCoordination, buildDehnDeviceCandidates, buildSqliteSyncPayload, buildDocumentContext, run };
}

export function safeLpsSpdDataEngine(options = {}) {
  try { return createLpsSpdDataEngine(options); } catch (error) {
    return { version: LPS_SPD_DATA_ENGINE_VERSION, classicProUnchanged: true, run() { return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" }); } };
  }
}

export default { LPS_SPD_DATA_ENGINE_VERSION, createLpsSpdDataEngine, safeLpsSpdDataEngine };

