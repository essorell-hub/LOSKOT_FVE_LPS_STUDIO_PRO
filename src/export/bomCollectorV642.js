import { normalizeBomItemV641 } from "./bomItemModelV641.js";

export const BOM_COLLECTOR_VERSION_V642 = "V642";

export function collectBomItemsV642(sources = []) {
  const items = [];
  for (const source of Array.isArray(sources) ? sources : []) {
    const sourceItems = Array.isArray(source) ? source : source?.items;
    for (const item of Array.isArray(sourceItems) ? sourceItems : []) {
      items.push(normalizeBomItemV641(item));
    }
  }
  return items.sort((a, b) =>
    [a.category, a.itemCode, a.sourceModule, a.sourceId].join("|").localeCompare(
      [b.category, b.itemCode, b.sourceModule, b.sourceId].join("|"),
    ),
  );
}

export function mergeBomItemsV642(items = []) {
  const map = new Map();
  for (const item of items.map(normalizeBomItemV641)) {
    const key = [item.itemCode, item.name, item.category, item.unit, item.sourceModule].join("|");
    const existing = map.get(key);
    if (existing) {
      existing.quantity += item.quantity;
      existing.sourceId = [existing.sourceId, item.sourceId].filter(Boolean).join(",");
      existing.notes.push(...item.notes);
      existing.qaFindings.push(...item.qaFindings);
    } else {
      map.set(key, { ...item, notes: [...item.notes], qaFindings: [...item.qaFindings] });
    }
  }
  return [...map.values()].sort((a, b) => a.itemCode.localeCompare(b.itemCode));
}
