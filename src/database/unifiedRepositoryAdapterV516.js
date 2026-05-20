import { normalizeProjectRecord } from "./projectRepositoryPreview.js";
import { normalizeUnifiedProject } from "../data/unifiedProjectModelV501.js";

export const SQLITE_SCHEMA_PATH_V425 = "database/loskot_schema_v425.sql";

export function toRepositoryPreviewRecord(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  return normalizeProjectRecord({
    id: project.project.projectId,
    name: project.project.projectName,
    description: project.project.site?.address || "",
    building: project.building,
    roof: project.roof,
    fve: {
      panels: project.fve.panels,
      strings: project.fve.strings,
      inverters: project.fve.inverters,
      dc_circuits: project.fve.dcRoutes,
    },
    lps: {
      components: project.lps.objects,
      downConductors: project.lps.downConductors,
      airTermination: project.lps.airTermination,
    },
    spd: {
      devices: project.spd.devices,
    },
    lpz: {
      zones: project.spd.lpz,
    },
    cad: project.cad,
    dokumenty: project.documents,
    databaze: { bom: project.bom },
    exporty: project.export,
    qa: {
      status: project.qa.summary?.releaseGo === false ? "BLOCKED" : "READY",
      issues: project.qa.findings,
      summary: project.qa.summary,
    },
  }, false);
}

export function createSqliteMappingSummary(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  return {
    schemaPath: SQLITE_SCHEMA_PATH_V425,
    tables: {
      projects: 1,
      buildings: project.building ? 1 : 0,
      roofs: project.roof ? 1 : 0,
      pv_modules: project.fve.modules.length,
      inverters: project.fve.inverters.length,
      inverter_mppts: project.fve.mppts.length,
      pv_strings: project.fve.strings.length,
      dc_routes: project.fve.dcRoutes.length,
      lps_objects: project.lps.objects.length,
      spd_devices: project.spd.devices.length,
      grounding: project.grounding.systems.length || (project.grounding.connected ? 1 : 0),
      bonding: project.bonding.connections.length || (project.bonding.connected ? 1 : 0),
      documents: project.documents.length,
      qa_findings: project.qa.findings.length,
      export_packages: project.export.packages.length,
    },
  };
}
