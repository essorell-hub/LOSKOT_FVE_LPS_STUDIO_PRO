// MEGA PACK H — V101–V105 Equipment Catalog / Datasheet Engine - datasheetIndexV102
// Pure runtime helper. No DOM. No package dependency.

export function datasheetIndexV102(catalog = {}, options = {}) {
  const groups = Object.keys(catalog || {}).filter((key) => Array.isArray(catalog[key]));
  const items = groups.flatMap((group) => catalog[group].map((item) => ({ ...item, group })));
  const missingIds = items.filter((item) => !item.id).length;
  const missingDatasheets = items.filter((item) => !item.datasheet && !item.datasheet_url).length;

  return {
    pack: "H",
    module: "datasheetIndexV102",
    groups: groups.length,
    items: items.length,
    missingIds,
    missingDatasheets,
    status: missingIds > 0 ? "BLOCKED" : "OK",
    generatedAt: options.now || new Date().toISOString(),
  };
}
