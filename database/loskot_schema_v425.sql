PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY,
  project_id TEXT NOT NULL UNIQUE,
  project_name TEXT NOT NULL,
  version TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buildings (
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  name TEXT,
  address TEXT,
  usage_type TEXT,
  height_m REAL CHECK (height_m IS NULL OR height_m >= 0),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS roofs (
  id INTEGER PRIMARY KEY,
  building_id INTEGER NOT NULL,
  roof_type TEXT,
  tilt_deg REAL CHECK (tilt_deg IS NULL OR (tilt_deg >= 0 AND tilt_deg <= 90)),
  azimuth_deg REAL CHECK (azimuth_deg IS NULL OR (azimuth_deg >= 0 AND azimuth_deg < 360)),
  area_m2 REAL CHECK (area_m2 IS NULL OR area_m2 >= 0),
  FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS design_conditions (
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  min_temp_c REAL,
  max_temp_c REAL,
  wind_zone TEXT,
  snow_zone TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS manufacturers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  country TEXT
);

CREATE TABLE IF NOT EXISTS datasheets (
  id INTEGER PRIMARY KEY,
  manufacturer_id INTEGER,
  name TEXT NOT NULL,
  document_uri TEXT,
  version TEXT,
  FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pv_modules (
  id INTEGER PRIMARY KEY,
  manufacturer_id INTEGER,
  datasheet_id INTEGER,
  model TEXT NOT NULL,
  voc_stc REAL NOT NULL CHECK (voc_stc > 0),
  vmp_stc REAL NOT NULL CHECK (vmp_stc > 0),
  isc_stc REAL NOT NULL CHECK (isc_stc > 0),
  imp_stc REAL NOT NULL CHECK (imp_stc > 0),
  temp_coeff_voc_pct_per_c REAL NOT NULL,
  temp_coeff_vmp_pct_per_c REAL NOT NULL,
  FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id) ON DELETE SET NULL,
  FOREIGN KEY (datasheet_id) REFERENCES datasheets(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS inverters (
  id INTEGER PRIMARY KEY,
  manufacturer_id INTEGER,
  datasheet_id INTEGER,
  model TEXT NOT NULL,
  max_dc_voltage REAL NOT NULL CHECK (max_dc_voltage > 0),
  ac_power_w REAL CHECK (ac_power_w IS NULL OR ac_power_w >= 0),
  FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id) ON DELETE SET NULL,
  FOREIGN KEY (datasheet_id) REFERENCES datasheets(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS inverter_mppts (
  id INTEGER PRIMARY KEY,
  inverter_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  min_voltage REAL NOT NULL CHECK (min_voltage > 0),
  max_voltage REAL NOT NULL CHECK (max_voltage > min_voltage),
  max_input_current REAL NOT NULL CHECK (max_input_current > 0),
  FOREIGN KEY (inverter_id) REFERENCES inverters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pv_strings (
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  module_id INTEGER,
  inverter_mppt_id INTEGER,
  label TEXT NOT NULL,
  module_count INTEGER NOT NULL CHECK (module_count > 0),
  voc_cold REAL CHECK (voc_cold IS NULL OR voc_cold >= 0),
  vmp_hot REAL CHECK (vmp_hot IS NULL OR vmp_hot >= 0),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES pv_modules(id) ON DELETE SET NULL,
  FOREIGN KEY (inverter_mppt_id) REFERENCES inverter_mppts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS dc_routes (
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  pv_string_id INTEGER,
  label TEXT NOT NULL,
  length_m REAL CHECK (length_m IS NULL OR length_m >= 0),
  has_supplementary_spd INTEGER NOT NULL DEFAULT 0 CHECK (has_supplementary_spd IN (0, 1)),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (pv_string_id) REFERENCES pv_strings(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ac_connections (
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  inverter_id INTEGER,
  label TEXT NOT NULL,
  voltage_v REAL CHECK (voltage_v IS NULL OR voltage_v > 0),
  current_a REAL CHECK (current_a IS NULL OR current_a >= 0),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (inverter_id) REFERENCES inverters(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS lps_objects (
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  building_id INTEGER,
  label TEXT NOT NULL,
  lpz_from TEXT,
  lpz_to TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS spd_devices (
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  spd_type TEXT NOT NULL CHECK (spd_type IN ('T1', 'T2', 'T3')),
  side TEXT CHECK (side IS NULL OR side IN ('AC', 'DC')),
  location TEXT,
  up_kv REAL CHECK (up_kv IS NULL OR up_kv > 0),
  uc_v REAL CHECK (uc_v IS NULL OR uc_v > 0),
  grounded INTEGER NOT NULL DEFAULT 0 CHECK (grounded IN (0, 1)),
  bonded INTEGER NOT NULL DEFAULT 0 CHECK (bonded IN (0, 1)),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grounding (
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  system_type TEXT,
  resistance_ohm REAL CHECK (resistance_ohm IS NULL OR resistance_ohm >= 0),
  connected INTEGER NOT NULL DEFAULT 0 CHECK (connected IN (0, 1)),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bonding (
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  connected INTEGER NOT NULL DEFAULT 0 CHECK (connected IN (0, 1)),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  document_type TEXT NOT NULL,
  title TEXT NOT NULL,
  file_uri TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS qa_findings (
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('INFO', 'WARN', 'ERROR', 'BLOCKER')),
  source TEXT,
  message TEXT NOT NULL,
  details_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS export_packages (
  id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL,
  version TEXT NOT NULL,
  manifest_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_buildings_project_id ON buildings(project_id);
CREATE INDEX IF NOT EXISTS idx_roofs_building_id ON roofs(building_id);
CREATE INDEX IF NOT EXISTS idx_design_conditions_project_id ON design_conditions(project_id);
CREATE INDEX IF NOT EXISTS idx_datasheets_manufacturer_id ON datasheets(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_pv_modules_manufacturer_id ON pv_modules(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_inverter_mppts_inverter_id ON inverter_mppts(inverter_id);
CREATE INDEX IF NOT EXISTS idx_pv_strings_project_id ON pv_strings(project_id);
CREATE INDEX IF NOT EXISTS idx_dc_routes_project_id ON dc_routes(project_id);
CREATE INDEX IF NOT EXISTS idx_ac_connections_project_id ON ac_connections(project_id);
CREATE INDEX IF NOT EXISTS idx_lps_objects_project_id ON lps_objects(project_id);
CREATE INDEX IF NOT EXISTS idx_spd_devices_project_id ON spd_devices(project_id);
CREATE INDEX IF NOT EXISTS idx_grounding_project_id ON grounding(project_id);
CREATE INDEX IF NOT EXISTS idx_bonding_project_id ON bonding(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_qa_findings_project_id ON qa_findings(project_id);
CREATE INDEX IF NOT EXISTS idx_qa_findings_code ON qa_findings(code);
CREATE INDEX IF NOT EXISTS idx_export_packages_project_id ON export_packages(project_id);
