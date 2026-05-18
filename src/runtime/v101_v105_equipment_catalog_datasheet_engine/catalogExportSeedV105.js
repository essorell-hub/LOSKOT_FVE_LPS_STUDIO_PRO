// MEGA PACK H — V101–V105 Equipment Catalog / Datasheet Engine - catalogExportSeedV105
// Pure runtime helper. No DOM. No package dependency.

export function catalogExportSeedV105(catalog = {}, options = {}) {
  const groups = Object.keys(catalog || {}).filter((key) => Array.isArray(catalog[key]));
  const items = groups.flatMap((group) => catalog[group].map((item) => ({ ...item, group })));
  const missingIds = items.filter((item) => !item.id).length;
  const missingDatasheets = items.filter((item) => !item.datasheet && !item.datasheet_url).length;

  return {
    pack: "H",
    module: "catalogExportSeedV105",
    groups: groups.length,
    items: items.length,
    missingIds,
    missingDatasheets,
    status: missingIds > 0 ? "BLOCKED" : "OK",
    generatedAt: options.now || new Date().toISOString(),
  };
}
