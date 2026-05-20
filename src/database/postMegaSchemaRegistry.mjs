// POST-MEGA V4 NIGHT FACTORY
// Database schema registry draft. Source of truth for early SQLite planning.

export const POST_MEGA_SCHEMA_REGISTRY_VERSION = "post-mega-v4-schema-1";

export const POST_MEGA_TABLES = [
  { name: "projects", key: "id", fields: ["id", "name", "site_name", "created_at", "updated_at"] },
  { name: "buildings", key: "id", fields: ["id", "project_id", "name", "height_m", "length_m", "width_m"] },
  { name: "roof_planes", key: "id", fields: ["id", "building_id", "name", "azimuth_deg", "tilt_deg", "area_m2"] },
  { name: "fve_panels", key: "id", fields: ["id", "project_id", "roof_plane_id", "module_type", "string_id", "x", "y"] },
  { name: "fve_strings", key: "id", fields: ["id", "project_id", "inverter_id", "mppt", "module_count", "voc_v", "vmp_v"] },
  { name: "inverters", key: "id", fields: ["id", "project_id", "manufacturer", "model", "ac_power_kw", "max_dc_v"] },
  { name: "optimizers", key: "id", fields: ["id", "project_id", "panel_id", "manufacturer", "model"] },
  { name: "lps_air_termination", key: "id", fields: ["id", "project_id", "type", "height_m", "x", "y"] },
  { name: "down_conductors", key: "id", fields: ["id", "project_id", "name", "route_ref", "material"] },
  { name: "hvi_routes", key: "id", fields: ["id", "project_id", "name", "length_m", "separation_note"] },
  { name: "spd_devices", key: "id", fields: ["id", "project_id", "side", "type", "lpz_from", "lpz_to"] },
  { name: "documents", key: "id", fields: ["id", "project_id", "template_id", "status", "output_path"] },
  { name: "datasheets", key: "id", fields: ["id", "project_id", "device_type", "manufacturer", "model", "file_path"] },
  { name: "qa_findings", key: "id", fields: ["id", "project_id", "severity", "area", "message", "status"] },
  { name: "exports", key: "id", fields: ["id", "project_id", "export_type", "created_at", "package_path"] }
];

export function getPostMegaTableNames() {
  return POST_MEGA_TABLES.map((table) => table.name);
}

export function getPostMegaTableByName(name) {
  return POST_MEGA_TABLES.find((table) => table.name === name) || null;
}

export function createPostMegaSchemaSummary() {
  return {
    version: POST_MEGA_SCHEMA_REGISTRY_VERSION,
    tableCount: POST_MEGA_TABLES.length,
    tableNames: getPostMegaTableNames()
  };
}

export function createPostMegaSchemaSql() {
  return POST_MEGA_TABLES.map((table) => {
    const fields = ["  " + table.key + " TEXT PRIMARY KEY"].concat(
      table.fields.filter((field) => field !== table.key).map((field) => "  " + field + " TEXT")
    );
    return "CREATE TABLE IF NOT EXISTS " + table.name + " (\n" + fields.join(",\n") + "\n);";
  }).join("\n\n");
}
