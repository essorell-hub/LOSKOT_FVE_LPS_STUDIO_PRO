// LOSKOT V76-V80 SQLite Schema Runtime Descriptor
// Pure JS descriptor for future SQLite implementation.

export const SQLITE_SCHEMA_VERSION_V80 = "v80_sqlite_foundation";

export const SQLITE_SCHEMA_STATEMENTS_V80 = [
  `CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    project_code TEXT NOT NULL,
    project_name TEXT NOT NULL,
    schema_version TEXT NOT NULL,
    data_json TEXT NOT NULL,
    created_at TEXT,
    updated_at TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS cad_objects (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    layer TEXT,
    object_type TEXT,
    linked_table TEXT,
    linked_id TEXT,
    data_json TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS pv_panels (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    module_type_id TEXT,
    roof_plane_id TEXT,
    string_id TEXT,
    data_json TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS pv_strings (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    module_count_series INTEGER,
    mppt_id TEXT,
    data_json TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS spd_devices (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    device_side TEXT NOT NULL,
    spd_type TEXT,
    data_json TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS qa_results (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    check_id TEXT,
    severity TEXT,
    message TEXT,
    blocks_export INTEGER DEFAULT 0,
    data_json TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS equipment_catalog (
    id TEXT PRIMARY KEY,
    group_name TEXT NOT NULL,
    manufacturer TEXT,
    model TEXT,
    data_json TEXT NOT NULL
  );`,
];

export function getSqliteSchemaV80() {
  return {
    version: SQLITE_SCHEMA_VERSION_V80,
    statements: [...SQLITE_SCHEMA_STATEMENTS_V80],
  };
}
