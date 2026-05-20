export const BOM_ITEM_VERSION_V641 = "V641";

export function normalizeBomItemV641(item = {}) {
  return {
    modelVersion: BOM_ITEM_VERSION_V641,
    itemCode: String(item.itemCode || item.code || "UNSPECIFIED").trim(),
    name: String(item.name || "Unspecified item").trim(),
    category: String(item.category || "general").trim(),
    unit: String(item.unit || "pcs").trim(),
    quantity: Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 0,
    sourceModule: String(item.sourceModule || "project").trim(),
    sourceId: String(item.sourceId || item.id || "").trim(),
    notes: Array.isArray(item.notes) ? item.notes.map(String) : item.notes ? [String(item.notes)] : [],
    qaFindings: Array.isArray(item.qaFindings) ? item.qaFindings : [],
  };
}

export function createBomItemV641(input = {}) {
  return normalizeBomItemV641(input);
}
