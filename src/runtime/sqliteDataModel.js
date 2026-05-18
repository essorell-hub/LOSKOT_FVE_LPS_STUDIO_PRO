import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";



export const SQLITE_DATA_MODEL_VERSION = "v53-sqlite-data-model-foundation";

const MODULE_NAME = "sqliteDataModel";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: SQLITE_DATA_MODEL_VERSION,
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

const TABLES = [
  "schema_migrations",
  "projects",
  "project_sites",
  "buildings",
  "roofs",
  "roof_planes",
  "manufacturers",
  "device_catalog",
  "fve_panels",
  "fve_strings",
  "fve_string_panels",
  "inverters",
  "optimizers",
  "dc_routes",
  "lps_components",
  "hvi_routes",
  "grounding_systems",
  "spd_devices",
  "lpz_zones",
  "cad_layers",
  "cad_objects",
  "graphic_symbols",
  "documents",
  "datasheets",
  "export_packages",
  "qa_checks",
  "audit_log"
];

export function getV53InitialSchemaSql() {
  return `PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  customer_name TEXT,
  status TEXT DEFAULT 'DRAFT',
  created_at TEXT,
  updated_at TEXT,
  payload_json TEXT
);

CREATE TABLE IF NOT EXISTS project_sites (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  address TEXT,
  cadastral_area TEXT,
  parcel_numbers TEXT,
  region TEXT,
  gps_lat REAL,
  gps_lng REAL,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS buildings (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  label TEXT,
  building_type TEXT,
  height_m REAL,
  payload_json TEXT,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS roofs (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  building_id TEXT,
  roof_type TEXT,
  payload_json TEXT,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS roof_planes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  roof_id TEXT,
  slope_deg REAL,
  azimuth_deg REAL,
  area_m2 REAL,
  geometry_json TEXT,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS manufacturers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS device_catalog (
  id TEXT PRIMARY KEY,
  manufacturer_id TEXT,
  category TEXT NOT NULL,
  model TEXT NOT NULL,
  parameters_json TEXT,
  FOREIGN KEY(manufacturer_id) REFERENCES manufacturers(id)
);

CREATE TABLE IF NOT EXISTS fve_panels (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  roof_plane_id TEXT,
  device_catalog_id TEXT,
  string_id TEXT,
  watt_peak REAL,
  voc_v REAL,
  vmp_v REAL,
  isc_a REAL,
  imp_a REAL,
  x REAL,
  y REAL,
  rotation_deg REAL,
  status TEXT DEFAULT 'OK',
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fve_strings (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  inverter_id TEXT,
  mppt_index INTEGER,
  label TEXT,
  status TEXT DEFAULT 'OK',
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fve_string_panels (
  string_id TEXT NOT NULL,
  panel_id TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  PRIMARY KEY(string_id, panel_id)
);

CREATE TABLE IF NOT EXISTS inverters (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  device_catalog_id TEXT,
  ac_power_kw REAL,
  dc_max_voltage_v REAL,
  mppt_count INTEGER,
  mppt_min_voltage_v REAL,
  mppt_max_voltage_v REAL,
  max_input_current_a REAL,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS optimizers (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  panel_id TEXT,
  device_catalog_id TEXT,
  status TEXT DEFAULT 'OK',
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dc_routes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  string_id TEXT,
  inverter_id TEXT,
  length_m REAL,
  cable_type TEXT,
  cross_section_mm2 REAL,
  path_json TEXT,
  status TEXT DEFAULT 'OK',
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lps_components (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  component_type TEXT NOT NULL,
  label TEXT,
  x REAL,
  y REAL,
  z REAL,
  material TEXT,
  payload_json TEXT,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hvi_routes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  length_m REAL,
  path_json TEXT,
  status TEXT DEFAULT 'OK',
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grounding_systems (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  resistance_ohm REAL,
  payload_json TEXT,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS spd_devices (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  side TEXT,
  spd_type TEXT,
  lpz_from TEXT,
  lpz_to TEXT,
  payload_json TEXT,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lpz_zones (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  lpz_key TEXT,
  boundary_json TEXT,
  note TEXT,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cad_layers (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  label TEXT,
  visible INTEGER DEFAULT 1,
  locked INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cad_objects (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  layer_id TEXT,
  object_type TEXT,
  source_table TEXT,
  source_id TEXT,
  symbol_key TEXT,
  geometry_json TEXT,
  style_json TEXT,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS graphic_symbols (
  symbol_key TEXT PRIMARY KEY,
  category TEXT,
  layer_id TEXT,
  label TEXT,
  svg_path TEXT,
  png_path TEXT,
  metadata_json TEXT
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  document_key TEXT,
  title TEXT,
  status TEXT,
  path TEXT,
  generated_at TEXT,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS datasheets (
  id TEXT PRIMARY KEY,
  device_catalog_id TEXT,
  manufacturer TEXT,
  model TEXT,
  path TEXT,
  url TEXT,
  language TEXT,
  revision TEXT
);

CREATE TABLE IF NOT EXISTS export_packages (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  package_type TEXT,
  status TEXT,
  manifest_json TEXT,
  created_at TEXT,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS qa_checks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  check_key TEXT,
  category TEXT,
  severity TEXT,
  status TEXT,
  message TEXT,
  source_table TEXT,
  source_id TEXT,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  action TEXT,
  message TEXT,
  created_at TEXT,
  payload_json TEXT
);`;
}

export function createSqliteDataModel(options = {}) {
  const schemaSql = options.schemaSql || getV53InitialSchemaSql();

  function getSchemaInfo() {
    return createResult("getSchemaInfo", {
      version: SQLITE_DATA_MODEL_VERSION,
      tableCount: TABLES.length,
      tables: TABLES,
      classicProUnchanged: true
    });
  }

  function validateSchema(sql = schemaSql) {
    const missing = TABLES.filter((table) => !new RegExp(`CREATE TABLE IF NOT EXISTS\\s+${table}\\s*\\(`, "i").test(sql));
    return createResult("validateSchema", {
      valid: missing.length === 0,
      missingTables: missing,
      checkedTables: TABLES.length
    }, missing.length ? [`Chybí tabulky: ${missing.join(", ")}`] : []);
  }

  function listMigrations() {
    return createResult("listMigrations", [
      { version: "001_v53_initial_schema", description: "Initial normalized LOSKOT schema" }
    ]);
  }

  function buildProjectRows(project = {}) {
    const id = project.id || project.projectId || "project-preview";
    return {
      projects: [{
        id,
        name: project.name || "Nový projekt",
        customer_name: project.customer?.name || "",
        status: project.status || "DRAFT",
        payload_json: JSON.stringify(project)
      }],
      fve_panels: normalizeArray(project.fve?.panels).map((panel) => ({
        id: panel.id || panel.panelId,
        project_id: id,
        watt_peak: panel.wattPeak || panel.watt_peak || null,
        voc_v: panel.vocV || null,
        vmp_v: panel.vmpV || null,
        isc_a: panel.iscA || null,
        imp_a: panel.impA || null
      }))
    };
  }

  function exportProjectJson(project = {}) {
    return createResult("exportProjectJson", {
      version: SQLITE_DATA_MODEL_VERSION,
      project,
      exportedAt: new Date().toISOString()
    });
  }

  function importProjectJson(payload = {}) {
    const project = payload.project || payload;
    if (!project || typeof project !== "object") {
      return createResult("importProjectJson", null, [], [{ message: "Invalid project payload." }]);
    }
    return createResult("importProjectJson", {
      project,
      importWarnings: [],
      accepted: true
    });
  }

  function buildSqliteSyncPayload(project = {}) {
    return createResult("buildSqliteSyncPayload", buildProjectRows(project));
  }

  function run(command, payload = {}) {
    if (command === "getSchemaInfo") return getSchemaInfo();
    if (command === "validateSchema") return validateSchema(payload.sql || schemaSql);
    if (command === "listMigrations") return listMigrations();
    if (command === "exportProjectJson") return exportProjectJson(payload.project || payload);
    if (command === "importProjectJson") return importProjectJson(payload);
    if (command === "buildSqliteSyncPayload") return buildSqliteSyncPayload(payload.project || payload);
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return {
    version: SQLITE_DATA_MODEL_VERSION,
    classicProUnchanged: true,
    getSchemaInfo,
    validateSchema,
    listMigrations,
    exportProjectJson,
    importProjectJson,
    buildSqliteSyncPayload,
    run
  };
}

export function safeSqliteDataModel(options = {}) {
  try {
    return createSqliteDataModel(options);
  } catch (error) {
    return {
      version: SQLITE_DATA_MODEL_VERSION,
      classicProUnchanged: true,
      run() {
        return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" });
      }
    };
  }
}

export default {
  SQLITE_DATA_MODEL_VERSION,
  getV53InitialSchemaSql,
  createSqliteDataModel,
  safeSqliteDataModel
};

