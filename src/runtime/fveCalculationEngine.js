import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";



export const FVE_CALCULATION_ENGINE_VERSION = "v55-fve-calculation-engine-foundation";

const MODULE_NAME = "fveCalculationEngine";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: FVE_CALCULATION_ENGINE_VERSION,
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

function normalizePanel(panel = {}) {
  return {
    id: panel.id || panel.panelId || "",
    wattPeak: finiteNumber(panel.wattPeak ?? panel.watt_peak, 0),
    vocV: finiteNumber(panel.vocV ?? panel.voc_v, 0),
    vmpV: finiteNumber(panel.vmpV ?? panel.vmp_v, 0),
    iscA: finiteNumber(panel.iscA ?? panel.isc_a, 0),
    impA: finiteNumber(panel.impA ?? panel.imp_a, 0),
    stringId: panel.stringId || null,
    optimizerId: panel.optimizerId || null
  };
}

function normalizeStringModel(string = {}) {
  return {
    id: string.id || string.stringId || "",
    panelIds: normalizeArray(string.panelIds),
    inverterId: string.inverterId || null,
    mpptIndex: Number.isInteger(Number(string.mpptIndex)) ? Number(string.mpptIndex) : null
  };
}

function normalizeInverter(inverter = {}) {
  return {
    id: inverter.id || inverter.inverterId || "",
    acPowerKw: finiteNumber(inverter.acPowerKw ?? inverter.ac_power_kw, 0),
    dcMaxVoltageV: finiteNumber(inverter.dcMaxVoltageV ?? inverter.dc_max_voltage_v, 0),
    mpptCount: finiteNumber(inverter.mpptCount ?? inverter.mppt_count, 0),
    mpptMinVoltageV: finiteNumber(inverter.mpptMinVoltageV ?? inverter.mppt_min_voltage_v, 0),
    mpptMaxVoltageV: finiteNumber(inverter.mpptMaxVoltageV ?? inverter.mppt_max_voltage_v, 0),
    maxInputCurrentA: finiteNumber(inverter.maxInputCurrentA ?? inverter.max_input_current_a, 0),
    mpptMaxCurrentA: finiteNumber(inverter.mpptMaxCurrentA ?? inverter.mppt_max_current_a ?? inverter.maxInputCurrentA, 0)
  };
}

export function createFveCalculationEngine(options = {}) {
  function normalizeProject(project = {}) {
    const fve = project.fve || {};
    return {
      ...project,
      fve: {
        ...fve,
        panels: normalizeArray(fve.panels).map(normalizePanel),
        strings: normalizeArray(fve.strings).map(normalizeStringModel),
        inverters: normalizeArray(fve.inverters).map(normalizeInverter),
        optimizers: normalizeArray(fve.optimizers),
        dcRoutes: normalizeArray(fve.dcRoutes)
      }
    };
  }

  function calculatePanelSummary(project = {}) {
    const normalized = normalizeProject(project);
    const panels = normalized.fve.panels;
    const totalWp = panels.reduce((sum, panel) => sum + panel.wattPeak, 0);
    return createResult("calculatePanelSummary", {
      panelCount: panels.length,
      totalWp,
      totalKwp: totalWp / 1000,
      missingElectricalData: panels.filter((panel) => !panel.vocV || !panel.vmpV || !panel.iscA || !panel.impA).map((panel) => panel.id)
    });
  }

  function calculateStringElectricals(project = {}) {
    const normalized = normalizeProject(project);
    const panelsById = new Map(normalized.fve.panels.map((panel) => [panel.id, panel]));
    const warnings = [];
    const strings = normalized.fve.strings.map((string) => {
      const panels = string.panelIds.map((id) => panelsById.get(id)).filter(Boolean);
      if (!panels.length) warnings.push(`String ${string.id} nemá žádné panely.`);
      const stringVoc = panels.reduce((sum, panel) => sum + panel.vocV, 0);
      const stringVmp = panels.reduce((sum, panel) => sum + panel.vmpV, 0);
      const stringIsc = panels.reduce((max, panel) => Math.max(max, panel.iscA), 0);
      const stringImp = panels.reduce((max, panel) => Math.max(max, panel.impA), 0);
      const totalWp = panels.reduce((sum, panel) => sum + panel.wattPeak, 0);
      return {
        id: string.id,
        panelCount: panels.length,
        panelIds: string.panelIds,
        inverterId: string.inverterId,
        mpptIndex: string.mpptIndex,
        stringVoc,
        stringVmp,
        stringIsc,
        stringImp,
        totalWp,
        totalKwp: totalWp / 1000
      };
    });
    return createResult("calculateStringElectricals", { strings }, warnings);
  }

  function calculateInverterChecks(project = {}) {
    const normalized = normalizeProject(project);
    const strings = calculateStringElectricals(normalized).data.strings;
    const inverters = new Map(normalized.fve.inverters.map((inverter) => [inverter.id, inverter]));
    const checks = [];

    strings.forEach((string) => {
      const inverter = inverters.get(string.inverterId);
      if (!inverter) {
        checks.push({ key: "fve.string.has_inverter", severity: "ERROR", status: "FAIL", stringId: string.id, message: `String ${string.id} nemá platný střídač.` });
        return;
      }
      if (inverter.dcMaxVoltageV && string.stringVoc > inverter.dcMaxVoltageV) {
        checks.push({ key: "fve.string.voc_within_inverter_limit", severity: "ERROR", status: "FAIL", stringId: string.id, message: `String ${string.id} překračuje max DC napětí střídače.` });
      }
      if (inverter.mpptMinVoltageV && string.stringVmp < inverter.mpptMinVoltageV) {
        checks.push({ key: "fve.string.vmp_min_mppt", severity: "WARNING", status: "WARNING", stringId: string.id, message: `String ${string.id} je pod MPPT minimem.` });
      }
      if (inverter.mpptMaxVoltageV && string.stringVmp > inverter.mpptMaxVoltageV) {
        checks.push({ key: "fve.string.vmp_max_mppt", severity: "WARNING", status: "WARNING", stringId: string.id, message: `String ${string.id} je nad MPPT maximem.` });
      }
      if (inverter.mpptMaxCurrentA && string.stringIsc > inverter.mpptMaxCurrentA) {
        checks.push({ key: "fve.string.current_limit", severity: "ERROR", status: "FAIL", stringId: string.id, message: `String ${string.id} překračuje MPPT proud.` });
      }
      if (inverter.mpptCount && string.mpptIndex && string.mpptIndex > inverter.mpptCount) {
        checks.push({ key: "fve.string.mppt_index_range", severity: "ERROR", status: "FAIL", stringId: string.id, message: `String ${string.id} má MPPT mimo rozsah.` });
      }
    });

    return createResult("calculateInverterChecks", { checks });
  }

  function calculateFveSummary(project = {}) {
    const panelSummary = calculatePanelSummary(project);
    const strings = calculateStringElectricals(project);
    const normalized = normalizeProject(project);
    return createResult("calculateFveSummary", {
      panelCount: panelSummary.data.panelCount,
      stringCount: normalized.fve.strings.length,
      inverterCount: normalized.fve.inverters.length,
      totalWp: panelSummary.data.totalWp,
      totalKwp: panelSummary.data.totalKwp,
      classicProUnchanged: true
    }, [...(panelSummary.warnings || []), ...(strings.warnings || [])]);
  }

  function runFveQa(project = {}) {
    const issues = [];
    const normalized = normalizeProject(project);
    if (!normalized.fve.panels.length) issues.push({ key: "fve.has_panels", severity: "ERROR", status: "FAIL", message: "Projekt nemá FVE panely." });
    normalized.fve.panels.forEach((panel) => {
      if (!panel.wattPeak) issues.push({ key: "fve.panel.has_watt_peak", severity: "WARNING", status: "WARNING", panelId: panel.id, message: `Panel ${panel.id} nemá výkon Wp.` });
      if (!panel.vocV) issues.push({ key: "fve.panel.has_voc", severity: "WARNING", status: "WARNING", panelId: panel.id, message: `Panel ${panel.id} nemá Voc.` });
    });
    const inverterChecks = calculateInverterChecks(normalized).data.checks;
    issues.push(...inverterChecks);
    const status = issues.some((item) => item.severity === "ERROR") ? "FAIL" : issues.some((item) => item.severity === "WARNING") ? "WARNING" : "PASS";
    return createResult("runFveQa", { status, issues });
  }

  function buildDocumentContext(project = {}) {
    const summary = calculateFveSummary(project);
    const strings = calculateStringElectricals(project);
    const qa = runFveQa(project);
    return createResult("buildDocumentContext", {
      summary: summary.data,
      strings: strings.data.strings,
      qa: qa.data,
      classicProUnchanged: true
    }, [...summary.warnings, ...strings.warnings]);
  }

  function buildSqliteSyncPayload(project = {}) {
    const normalized = normalizeProject(project);
    return createResult("buildSqliteSyncPayload", {
      fve_panels: normalized.fve.panels,
      fve_strings: normalized.fve.strings,
      inverters: normalized.fve.inverters,
      dc_routes: normalized.fve.dcRoutes
    });
  }

  function run(command, payload = {}) {
    if (command === "normalizeProject") return createResult("normalizeProject", normalizeProject(payload.project || payload));
    if (command === "calculatePanelSummary") return calculatePanelSummary(payload.project || payload);
    if (command === "calculateStringElectricals") return calculateStringElectricals(payload.project || payload);
    if (command === "calculateInverterChecks") return calculateInverterChecks(payload.project || payload);
    if (command === "calculateFveSummary") return calculateFveSummary(payload.project || payload);
    if (command === "runFveQa") return runFveQa(payload.project || payload);
    if (command === "buildDocumentContext") return buildDocumentContext(payload.project || payload);
    if (command === "buildSqliteSyncPayload") return buildSqliteSyncPayload(payload.project || payload);
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return {
    version: FVE_CALCULATION_ENGINE_VERSION,
    classicProUnchanged: true,
    normalizeProject,
    calculatePanelSummary,
    calculateStringElectricals,
    calculateInverterChecks,
    calculateFveSummary,
    runFveQa,
    buildDocumentContext,
    buildSqliteSyncPayload,
    run
  };
}

export function safeFveCalculationEngine(options = {}) {
  try {
    return createFveCalculationEngine(options);
  } catch (error) {
    return {
      version: FVE_CALCULATION_ENGINE_VERSION,
      classicProUnchanged: true,
      run() {
        return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" });
      }
    };
  }
}

export default {
  FVE_CALCULATION_ENGINE_VERSION,
  createFveCalculationEngine,
  safeFveCalculationEngine
};

