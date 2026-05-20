import { normalizeBomItemV641 } from "./bomItemModelV641.js";

export function createBomSummaryV645(items = []) {
  const normalized = items.map(normalizeBomItemV641);
  const byCategory = normalized.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.quantity;
    return acc;
  }, {});
  const bySourceModule = normalized.reduce((acc, item) => {
    acc[item.sourceModule] = (acc[item.sourceModule] || 0) + item.quantity;
    return acc;
  }, {});
  return {
    modelVersion: "V645",
    itemCount: normalized.length,
    totalQuantity: normalized.reduce((sum, item) => sum + item.quantity, 0),
    byCategory,
    bySourceModule,
  };
}
