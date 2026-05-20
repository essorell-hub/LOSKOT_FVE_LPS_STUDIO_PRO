export const PROJECT_COMMAND_TYPES_V841 = Object.freeze({
  PROJECT_CREATE: "PROJECT_CREATE",
  PROJECT_LOAD: "PROJECT_LOAD",
  PROJECT_VALIDATE: "PROJECT_VALIDATE",
  PROJECT_UPDATE_SECTION: "PROJECT_UPDATE_SECTION",
  FVE_EVALUATE: "FVE_EVALUATE",
  LPS_EVALUATE: "LPS_EVALUATE",
  DOCS_BUILD: "DOCS_BUILD",
  BOM_BUILD: "BOM_BUILD",
  EXPORT_BUILD: "EXPORT_BUILD",
  QA_RUN_ALL: "QA_RUN_ALL",
  SNAPSHOT_CREATE: "SNAPSHOT_CREATE",
  SNAPSHOT_RESTORE: "SNAPSHOT_RESTORE"
});

export function createProjectCommandV841(type, payload = {}, meta = {}) {
  return {
    id: meta.id || `cmd-${type}-${meta.sequence ?? 1}`,
    type,
    payload,
    meta: {
      source: meta.source || "projectCommandModelV841",
      timestamp: meta.timestamp || "V841_STABLE_TIMESTAMP",
      ...meta
    }
  };
}

export function isKnownProjectCommandTypeV841(type) {
  return Object.values(PROJECT_COMMAND_TYPES_V841).includes(type);
}

export function normalizeProjectCommandV841(command = {}) {
  if (typeof command === "string") return createProjectCommandV841(command);
  return createProjectCommandV841(command.type, command.payload || {}, command.meta || {});
}
