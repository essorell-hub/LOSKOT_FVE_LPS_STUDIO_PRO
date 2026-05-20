import { normalizeBomItemV641 } from "./bomItemModelV641.js";

export function createBomQaV646(items = []) {
  const findings = [];
  items.map(normalizeBomItemV641).forEach((item) => {
    if (!item.itemCode || item.itemCode === "UNSPECIFIED") {
      findings.push({ id: "BOM-001", severity: "ERROR", sourceModule: "bom", sourceId: item.sourceId, message: "Missing BOM item code" });
    }
    if (item.quantity <= 0) {
      findings.push({ id: "BOM-002", severity: "ERROR", sourceModule: "bom", sourceId: item.sourceId, message: "BOM quantity must be positive" });
    }
    findings.push(...item.qaFindings);
  });
  return {
    modelVersion: "V646",
    findings,
    hasErrors: findings.some((finding) => String(finding.severity).toUpperCase() === "ERROR"),
    hasBlockers: findings.some((finding) => String(finding.severity).toUpperCase() === "BLOCKER"),
  };
}
