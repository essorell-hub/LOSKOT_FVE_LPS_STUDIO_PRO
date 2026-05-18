// LOSKOT V74-V85 Classic PRO UI Binding - QA Panel View Model
// Pure runtime view-model builder. No DOM. No React. No package dependency.

export function buildQaPanelViewModelV74(qaResults = []) {
  const items = Array.isArray(qaResults) ? qaResults : [];
  const normalized = items.map((item, index) => ({
    id: item.id || `${item.checkId || item.check_id || "QA"}_${index}`,
    severity: normalizeSeverity(item.severity),
    checkId: item.checkId || item.check_id || "",
    message: item.message || "",
    blocksExport: Boolean(item.blocksExport ?? item.blocks_export),
    objectType: item.objectType || item.object_type || "",
    objectId: item.objectId || item.object_id || "",
    status: item.status || "ACTIVE",
  }));

  const errors = normalized.filter((item) => item.severity === "ERROR").length;
  const warnings = normalized.filter((item) => item.severity === "WARNING").length;
  const infos = normalized.filter((item) => item.severity === "INFO").length;
  const blocksExport = normalized.filter((item) => item.blocksExport).length;

  return {
    screen: "qa",
    title: "QA kontrola projektu",
    summary: {
      total: normalized.length,
      errors,
      warnings,
      infos,
      blocksExport,
      status: blocksExport > 0 ? "BLOCKED" : errors > 0 ? "ERROR" : warnings > 0 ? "WARNING" : "OK",
    },
    filters: [
      { id: "all", label: "Vše", count: normalized.length },
      { id: "errors", label: "Chyby", count: errors },
      { id: "warnings", label: "Varování", count: warnings },
      { id: "blocking", label: "Blokující", count: blocksExport },
    ],
    items: normalized,
  };
}

export function getBlockingQaItemsV74(qaResults = []) {
  return (Array.isArray(qaResults) ? qaResults : []).filter((item) => Boolean(item.blocksExport ?? item.blocks_export));
}

function normalizeSeverity(value) {
  const s = String(value || "INFO").toUpperCase();
  if (["ERROR", "WARNING", "INFO"].includes(s)) return s;
  return "INFO";
}
