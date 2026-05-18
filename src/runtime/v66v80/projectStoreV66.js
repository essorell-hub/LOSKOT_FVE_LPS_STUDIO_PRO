// LOSKOT V66/V76-V80 Project Storage Core
// Pure runtime module. No DOM. No package dependency.

export const PROJECT_SCHEMA_VERSION_V66 = "v66-v80";
export const PROJECT_EXPORT_SCHEMA_V66 = "loskot.project.schema.v66_v80";

export function createEmptyProjectV66(overrides = {}) {
  const now = new Date().toISOString();
  return normalizeProjectV66({
    export_schema: PROJECT_EXPORT_SCHEMA_V66,
    app_version: "v80-project-storage-core",
    created_at: now,
    updated_at: now,
    project: {
      id: "project_auto",
      project_code: "PROJECT-AUTO",
      project_name: "Nový projekt",
      schema_version: PROJECT_SCHEMA_VERSION_V66,
    },
    building: { has_lps: false },
    roof: { planes: [], obstacles: [] },
    cad: { layers: [], objects: [], symbols: [] },
    fve: {
      module_type: null,
      inverter_type: null,
      panels: [],
      strings: [],
      inverters: [],
      mppts: [],
      dc_routes: [],
      optimizers: [],
    },
    lps_spd_lpz: {
      lpz_zones: [],
      spd_dc: [],
      spd_ac: [],
      lps_elements: [],
      hvi_routes: [],
      down_conductors: [],
      earthing_systems: [],
      bonding: [],
    },
    qa: { results: [], summary: { info: 0, warning: 0, error: 0, blocks_export: 0 } },
    documents: { templates: [], generated: [] },
    export_package: { status: "draft", files: [] },
    audit_log: [],
    ...overrides,
  });
}

export function normalizeProjectV66(project) {
  const p = structuredCloneSafe(project || {});
  p.export_schema = p.export_schema || PROJECT_EXPORT_SCHEMA_V66;
  p.app_version = p.app_version || "v80-project-storage-core";
  p.project = p.project || {};
  p.project.id = p.project.id || "project_auto";
  p.project.project_code = p.project.project_code || "PROJECT-AUTO";
  p.project.project_name = p.project.project_name || "Migrovaný projekt";
  p.project.schema_version = PROJECT_SCHEMA_VERSION_V66;

  p.building = p.building || { has_lps: false };
  p.roof = p.roof || {};
  p.roof.planes = arrayOrEmpty(p.roof.planes);
  p.roof.obstacles = arrayOrEmpty(p.roof.obstacles);

  p.cad = p.cad || {};
  p.cad.layers = arrayOrEmpty(p.cad.layers);
  p.cad.objects = arrayOrEmpty(p.cad.objects);
  p.cad.symbols = arrayOrEmpty(p.cad.symbols);

  p.fve = p.fve || {};
  p.fve.panels = arrayOrEmpty(p.fve.panels);
  p.fve.strings = arrayOrEmpty(p.fve.strings);
  p.fve.inverters = arrayOrEmpty(p.fve.inverters);
  p.fve.mppts = arrayOrEmpty(p.fve.mppts);
  p.fve.dc_routes = arrayOrEmpty(p.fve.dc_routes);
  p.fve.optimizers = arrayOrEmpty(p.fve.optimizers);

  p.lps_spd_lpz = p.lps_spd_lpz || {};
  for (const key of ["lpz_zones", "spd_dc", "spd_ac", "lps_elements", "hvi_routes", "down_conductors", "earthing_systems", "bonding"]) {
    p.lps_spd_lpz[key] = arrayOrEmpty(p.lps_spd_lpz[key]);
  }

  p.qa = p.qa || {};
  p.qa.results = arrayOrEmpty(p.qa.results);
  p.qa.summary = p.qa.summary || { info: 0, warning: 0, error: 0, blocks_export: 0 };

  p.documents = p.documents || {};
  p.documents.templates = arrayOrEmpty(p.documents.templates);
  p.documents.generated = arrayOrEmpty(p.documents.generated);

  p.export_package = p.export_package || {};
  p.export_package.status = p.export_package.status || "draft";
  p.export_package.files = arrayOrEmpty(p.export_package.files);

  p.audit_log = arrayOrEmpty(p.audit_log);
  p.updated_at = new Date().toISOString();
  return p;
}

export function serializeProjectV66(project) {
  const normalized = normalizeProjectV66(project);
  return JSON.stringify(normalized, null, 2);
}

export function parseProjectJsonV66(jsonText) {
  if (typeof jsonText !== "string") {
    throw new Error("Project JSON input must be a string.");
  }
  const parsed = JSON.parse(jsonText);
  return normalizeProjectV66(parsed);
}

export function cloneProjectV66(project) {
  return normalizeProjectV66(structuredCloneSafe(project));
}

export function addAuditLogV66(project, action, detail = {}) {
  const p = normalizeProjectV66(project);
  p.audit_log.push({
    at: new Date().toISOString(),
    action,
    detail,
  });
  return p;
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value ?? {}));
}
