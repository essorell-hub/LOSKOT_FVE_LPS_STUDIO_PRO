import { calculateFveStringSet } from "./stringCalculatorV422.js";
import { normalizeUnifiedProject } from "../data/unifiedProjectModelV501.js";
import { runQaFeed } from "../validation/qaFeedEngine.js";

function firstNumber(source, keys, fallback = 0) {
  for (const key of keys) {
    const value = Number(source?.[key]);
    if (Number.isFinite(value)) return value;
  }
  return fallback;
}

function findById(items, id, keys = ["id"]) {
  return (Array.isArray(items) ? items : []).find((item) => keys.some((key) => item?.[key] === id)) || null;
}

export function createFveStringCalculationInput(project, string) {
  const module = findById(project.fve.modules, string.moduleId, ["moduleId", "id"]) || project.fve.modules[0] || {};
  const mppt = findById(project.fve.mppts, string.mpptId, ["mpptId", "id"]) || project.fve.mppts[0] || {};
  const inverter = findById(project.fve.inverters, mppt.inverterId || string.inverterId, ["inverterId", "id"]) || project.fve.inverters[0] || {};

  return {
    moduleCount: firstNumber(string, ["moduleCount", "modules", "panelCount"], 0),
    Voc_STC: firstNumber(module, ["Voc_STC", "vocStc", "voc_stc"], 0),
    Vmp_STC: firstNumber(module, ["Vmp_STC", "vmpStc", "vmp_stc"], 0),
    Isc_STC: firstNumber(module, ["Isc_STC", "iscStc", "isc_stc"], 0),
    Imp_STC: firstNumber(module, ["Imp_STC", "impStc", "imp_stc"], 0),
    tempCoeffVocPctPerC: firstNumber(module, ["tempCoeffVocPctPerC", "temp_coeff_voc_pct_per_c"], 0),
    tempCoeffVmpPctPerC: firstNumber(module, ["tempCoeffVmpPctPerC", "temp_coeff_vmp_pct_per_c"], 0),
    minTempC: firstNumber(project.designConditions, ["minTempC", "min_temp_c"], 25),
    maxTempC: firstNumber(project.designConditions, ["maxTempC", "max_temp_c"], 25),
    inverterLimits: {
      maxDcVoltage: firstNumber(inverter, ["maxDcVoltage", "max_dc_voltage"], 0),
      mpptMinVoltage: firstNumber(mppt, ["mpptMinVoltage", "minVoltage", "min_voltage"], 0),
      mpptMaxVoltage: firstNumber(mppt, ["mpptMaxVoltage", "maxVoltage", "max_voltage"], 0),
      maxMpptInputCurrent: firstNumber(mppt, ["maxMpptInputCurrent", "maxInputCurrent", "max_input_current"], 0),
    },
  };
}

export function evaluateUnifiedFve(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const strings = project.fve.strings.map((string) => {
    const input = createFveStringCalculationInput(project, string);
    return {
      stringId: string.stringId || string.id || "",
      input,
      result: calculateFveStringSet(input),
    };
  });
  const findings = strings.flatMap((item) => item.result.qaFindings || []);
  const feed = runQaFeed({ fveFindings: findings, project });

  return {
    strings,
    qaFindings: feed.qaFindings,
    qaSummary: feed.qaSummary,
    releaseGo: feed.releaseGo,
  };
}
