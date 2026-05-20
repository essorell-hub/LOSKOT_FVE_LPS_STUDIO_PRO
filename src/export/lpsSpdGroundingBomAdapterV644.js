import { normalizeBomItemV641 } from "./bomItemModelV641.js";

function mapItems(items, category, sourceModule, fallbackName, fallbackUnit = "pcs") {
  return (Array.isArray(items) ? items : []).map((item, index) =>
    normalizeBomItemV641({
      itemCode: item.itemCode || item.code || `${sourceModule.toUpperCase()}-${category.toUpperCase()}-${index + 1}`,
      name: item.name || fallbackName,
      category,
      unit: item.unit || fallbackUnit,
      quantity: item.quantity ?? item.lengthM ?? item.count ?? 1,
      sourceModule,
      sourceId: item.id || `${category}-${index + 1}`,
      notes: item.notes || [],
      qaFindings: item.qaFindings || [],
    }),
  );
}

export function createLpsSpdGroundingBomItemsV644(project = {}) {
  const lps = project.lps || {};
  const spd = project.spd || {};
  const grounding = project.grounding || {};
  const bonding = project.bonding || {};
  return [
    ...mapItems(lps.elements, "lps-element", "lps", "LPS element"),
    ...mapItems(lps.airTerminals, "air-terminal", "lps", "Air terminal"),
    ...mapItems(lps.downConductors, "down-conductor", "lps", "Down conductor", "m"),
    ...mapItems(spd.devices, "spd-device", "spd", "SPD device"),
    ...mapItems(grounding.electrodes, "grounding-electrode", "grounding", "Grounding electrode"),
    ...mapItems(grounding.conductors, "grounding-conductor", "grounding", "Grounding conductor", "m"),
    ...mapItems(bonding.connections, "bonding-connection", "bonding", "Bonding connection"),
  ];
}
