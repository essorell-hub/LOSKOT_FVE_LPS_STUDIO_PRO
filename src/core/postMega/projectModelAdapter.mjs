// POST-MEGA RUNTIME INTEGRATION A
// Guarded project model adapter.
// This file is intentionally UI-neutral and does not change Classic PRO layout.

export const POST_MEGA_PROJECT_MODEL_VERSION = "post-mega-runtime-integration-a";

const emptyArray = () => [];

export function createEmptyProjectModel(overrides = {}) {
  const base = {
    meta: {
      schemaVersion: POST_MEGA_PROJECT_MODEL_VERSION,
      app: "LOSKOT FVE and LPS STUDIO PRO",
      createdBy: "post-mega-runtime-integration-a"
    },
    site: {},
    building: {
      footprint: [],
      facades: [],
      levels: []
    },
    roof: {
      planes: [],
      ridgeLines: [],
      eaves: [],
      obstacles: []
    },
    layers: {
      cad: true,
      map: true,
      fve: true,
      lps: true,
      documents: true
    },
    cadMap: {
      view: {},
      geometry: {},
      objects: []
    },
    fve: {
      panels: [],
      strings: [],
      dcRoutes: [],
      inverters: [],
      optimizers: [],
      spd: []
    },
    lps: {
      rods: [],
      downConductors: [],
      hviRoutes: [],
      earthing: [],
      spd: [],
      lpz: []
    },
    documents: {
      reports: [],
      datasheets: [],
      exports: []
    },
    database: {
      sqliteReady: false,
      catalogs: []
    },
    qa: {
      status: "not_checked",
      findings: []
    },
    exports: {
      json: null,
      pdf: null,
      docx: null
    },
    uiRuntime: {
      safeMode: true,
      lastError: null
    }
  };

  return mergeProjectModel(base, overrides);
}

export function normalizeProjectModel(input = {}) {
  const model = mergeProjectModel(createEmptyProjectModel(), input || {});
  model.fve.panels = asArray(model.fve.panels);
  model.fve.strings = asArray(model.fve.strings);
  model.fve.dcRoutes = asArray(model.fve.dcRoutes);
  model.fve.inverters = asArray(model.fve.inverters);
  model.fve.optimizers = asArray(model.fve.optimizers);
  model.fve.spd = asArray(model.fve.spd);
  model.lps.rods = asArray(model.lps.rods);
  model.lps.downConductors = asArray(model.lps.downConductors);
  model.lps.hviRoutes = asArray(model.lps.hviRoutes);
  model.lps.earthing = asArray(model.lps.earthing);
  model.lps.spd = asArray(model.lps.spd);
  model.lps.lpz = asArray(model.lps.lpz);
  model.cadMap.objects = asArray(model.cadMap.objects);
  model.documents.reports = asArray(model.documents.reports);
  model.documents.datasheets = asArray(model.documents.datasheets);
  model.documents.exports = asArray(model.documents.exports);
  model.qa.findings = asArray(model.qa.findings);
  model.database.catalogs = asArray(model.database.catalogs);
  return model;
}

export function mergeProjectModel(base = {}, patch = {}) {
  if (!isPlainObject(base)) base = {};
  if (!isPlainObject(patch)) patch = {};
  const output = { ...base };
  for (const key of Object.keys(patch)) {
    const nextValue = patch[key];
    const currentValue = output[key];
    if (Array.isArray(nextValue)) {
      output[key] = nextValue.slice();
    } else if (isPlainObject(nextValue) && isPlainObject(currentValue)) {
      output[key] = mergeProjectModel(currentValue, nextValue);
    } else if (isPlainObject(nextValue)) {
      output[key] = mergeProjectModel({}, nextValue);
    } else {
      output[key] = nextValue;
    }
  }
  return output;
}

export function safeGetProjectModel(source) {
  try {
    if (!source) return createEmptyProjectModel();
    if (source.projectModel) return normalizeProjectModel(source.projectModel);
    if (source.project) return normalizeProjectModel(source.project);
    return normalizeProjectModel(source);
  } catch (err) {
    const fallback = createEmptyProjectModel();
    fallback.uiRuntime.lastError = err && err.message ? err.message : "Unknown project model adapter error";
    fallback.qa.status = "adapter_fallback";
    fallback.qa.findings = [{
      severity: "warning",
      code: "PROJECT_MODEL_ADAPTER_FALLBACK",
      message: "Project model adapter returned a safe fallback model."
    }];
    return fallback;
  }
}

export function getVisibleLayerNames(model) {
  const safe = normalizeProjectModel(model);
  return Object.keys(safe.layers).filter((key) => safe.layers[key] === true);
}

function asArray(value) {
  return Array.isArray(value) ? value : emptyArray();
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
