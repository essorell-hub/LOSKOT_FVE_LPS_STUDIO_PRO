import { normalizeBomItemV641 } from "./bomItemModelV641.js";

function mapCollection(items, category, sourceModule, defaults = {}) {
  return (Array.isArray(items) ? items : []).map((item, index) =>
    normalizeBomItemV641({
      itemCode: item.itemCode || item.code || `${sourceModule.toUpperCase()}-${category.toUpperCase()}-${index + 1}`,
      name: item.name || defaults.name || category,
      category,
      unit: item.unit || defaults.unit || "pcs",
      quantity: item.quantity ?? item.count ?? defaults.quantity ?? 1,
      sourceModule,
      sourceId: item.id || item.sourceId || `${category}-${index + 1}`,
      notes: item.notes || [],
      qaFindings: item.qaFindings || [],
    }),
  );
}

export function createFveBomItemsV643(project = {}) {
  const fve = project.fve || project.pv || {};
  return [
    ...mapCollection(fve.panels, "fve-panel", "fve", { name: "FVE panel" }),
    ...mapCollection(fve.strings, "fve-string", "fve", { name: "FVE string" }),
    ...mapCollection(fve.dcRoutes, "dc-route", "fve", { name: "DC route", unit: "m" }),
    ...mapCollection(fve.inverters, "inverter", "fve", { name: "Inverter" }),
  ];
}
