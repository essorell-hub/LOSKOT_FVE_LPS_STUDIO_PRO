// LOSKOT V66/V76-V80 Project Migrator
// Pure runtime module. No DOM. No package dependency.

import { normalizeProjectV66, PROJECT_SCHEMA_VERSION_V66, PROJECT_EXPORT_SCHEMA_V66 } from "./projectStoreV66.js";

export function migrateProjectToV66(project) {
  const migrated = normalizeProjectV66(project || {});
  migrated.export_schema = PROJECT_EXPORT_SCHEMA_V66;
  migrated.project.schema_version = PROJECT_SCHEMA_VERSION_V66;
  migrated.migrated_at = new Date().toISOString();

  if (!Array.isArray(migrated.audit_log)) {
    migrated.audit_log = [];
  }
  migrated.audit_log.push({
    at: new Date().toISOString(),
    action: "MIGRATE_TO_V66_V80",
    detail: {
      target_schema: PROJECT_SCHEMA_VERSION_V66,
      export_schema: PROJECT_EXPORT_SCHEMA_V66,
    },
  });

  return migrated;
}

export function detectProjectSchemaV66(project) {
  return {
    exportSchema: project?.export_schema || "",
    schemaVersion: project?.project?.schema_version || "",
    needsMigration: project?.project?.schema_version !== PROJECT_SCHEMA_VERSION_V66,
  };
}

export function validateMigrationResultV66(project) {
  const errors = [];
  if (project?.export_schema !== PROJECT_EXPORT_SCHEMA_V66) {
    errors.push("export_schema is not V66/V80.");
  }
  if (project?.project?.schema_version !== PROJECT_SCHEMA_VERSION_V66) {
    errors.push("project.schema_version is not V66/V80.");
  }
  for (const key of ["project", "cad", "fve", "lps_spd_lpz", "qa", "documents", "export_package"]) {
    if (!project || !(key in project)) {
      errors.push(`Missing root key after migration: ${key}`);
    }
  }
  return {
    errors,
    status: errors.length === 0 ? "OK" : "BLOCKED",
  };
}
