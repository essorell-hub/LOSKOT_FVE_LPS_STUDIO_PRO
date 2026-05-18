-- POST-MEGA V4 NIGHT FACTORY
-- SQLite schema draft. This is a planning draft, not a migration yet.

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT,
  site_name TEXT,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS buildings (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  name TEXT,
  height_m TEXT,
  length_m TEXT,
  width_m TEXT
);

CREATE TABLE IF NOT EXISTS roof_planes (
  id TEXT PRIMARY KEY,
  building_id TEXT,
  name TEXT,
  azimuth_deg TEXT,
  tilt_deg TEXT,
  area_m2 TEXT
);

CREATE TABLE IF NOT EXISTS fve_panels (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  roof_plane_id TEXT,
  module_type TEXT,
  string_id TEXT,
  x TEXT,
  y TEXT
);

CREATE TABLE IF NOT EXISTS fve_strings (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  inverter_id TEXT,
  mppt TEXT,
  module_count TEXT,
  voc_v TEXT,
  vmp_v TEXT
);

CREATE TABLE IF NOT EXISTS inverters (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  manufacturer TEXT,
  model TEXT,
  ac_power_kw TEXT,
  max_dc_v TEXT
);

CREATE TABLE IF NOT EXISTS spd_devices (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  side TEXT,
  type TEXT,
  lpz_from TEXT,
  lpz_to TEXT
);

CREATE TABLE IF NOT EXISTS qa_findings (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  severity TEXT,
  area TEXT,
  message TEXT,
  status TEXT
);
