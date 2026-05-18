// LOSKOT V66/V76-V80 Project Storage + SQLite + Import/Export Core exports

export {
  PROJECT_SCHEMA_VERSION_V66,
  PROJECT_EXPORT_SCHEMA_V66,
  createEmptyProjectV66,
  normalizeProjectV66,
  serializeProjectV66,
  parseProjectJsonV66,
  cloneProjectV66,
  addAuditLogV66,
} from "./projectStoreV66.js";

export {
  migrateProjectToV66,
  detectProjectSchemaV66,
  validateMigrationResultV66,
} from "./projectMigratorV66.js";

export {
  buildProjectExportPackageV66,
  buildExportManifestV66,
  importProjectPackageV66,
} from "./importExportCoreV66.js";

export {
  SQLITE_SCHEMA_VERSION_V80,
  SQLITE_SCHEMA_STATEMENTS_V80,
  getSqliteSchemaV80,
} from "./sqliteSchemaV80.js";
