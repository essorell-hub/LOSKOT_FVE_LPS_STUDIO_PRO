import {
  UNIFIED_PROJECT_SCHEMA_VERSION,
  arrayOrEmpty,
  cloneJson,
  createUnifiedDefaults,
  objectOrEmpty,
} from "./unifiedProjectSchemaV501.js";

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function mergeObject(base, input) {
  return { ...objectOrEmpty(base), ...objectOrEmpty(input) };
}

export function cloneUnifiedProject(project) {
  return cloneJson(project);
}

export function createDefaultUnifiedProject(overrides = {}) {
  return normalizeUnifiedProject(overrides);
}

export function getUnifiedProjectSection(project = {}, sectionName, fallbackValue = {}) {
  if (!project || typeof project !== "object") return fallbackValue;
  return Object.prototype.hasOwnProperty.call(project, sectionName) ? project[sectionName] : fallbackValue;
}

export function normalizeUnifiedProject(input = {}) {
  const now = new Date().toISOString();
  const defaults = createUnifiedDefaults(now);
  const data = objectOrEmpty(input);
  const projectInfo = objectOrEmpty(data.projectInfo);
  const projectSection = objectOrEmpty(data.project);
  const metadata = objectOrEmpty(data.metadata);
  const sourceMetadata = objectOrEmpty(projectSection.metadata);
  const fve = objectOrEmpty(data.fve);
  const cad = objectOrEmpty(data.cad);
  const lps = objectOrEmpty(data.lps);
  const spd = objectOrEmpty(data.spd);
  const lpsSpdLpz = objectOrEmpty(data.lps_spd_lpz);
  const grounding = objectOrEmpty(data.grounding);
  const bonding = objectOrEmpty(data.bonding);
  const exportSection = objectOrEmpty(data.export || data.exports || data.export_package);

  const normalized = {
    ...defaults,
    schemaVersion: data.schemaVersion || data.schema_version || projectSection.schema_version || UNIFIED_PROJECT_SCHEMA_VERSION,
    appVersion: data.appVersion || data.app_version || defaults.appVersion,
    project: {
      ...defaults.project,
      ...projectSection,
      projectId: firstValue(projectSection.projectId, projectSection.id, projectSection.project_code, data.projectId, data.id, data.project_id, ""),
      projectName: firstValue(projectSection.projectName, projectSection.project_name, projectInfo.projectName, data.projectName, data.name, ""),
      customer: mergeObject(defaults.project.customer, data.customer || projectSection.customer),
      site: mergeObject(defaults.project.site, data.site || projectSection.site),
      metadata: {
        ...defaults.project.metadata,
        ...metadata,
        ...sourceMetadata,
        createdAt: firstValue(sourceMetadata.createdAt, metadata.createdAt, data.createdAt, data.created_at, now),
        updatedAt: now,
        sourceSchema: firstValue(sourceMetadata.sourceSchema, data.export_schema, projectSection.schema_version, data.dataModelVersion, ""),
      },
    },
    building: {
      ...defaults.building,
      ...objectOrEmpty(data.building || data.objekt),
    },
    roof: {
      ...defaults.roof,
      ...objectOrEmpty(data.roof || data.strecha),
      planes: arrayOrEmpty(data.roof?.planes || data.strecha?.planes || data.roofs),
      obstacles: arrayOrEmpty(data.roof?.obstacles || data.strecha?.obstacles),
    },
    designConditions: {
      ...defaults.designConditions,
      ...objectOrEmpty(data.designConditions || data.design_conditions),
    },
    fve: {
      ...defaults.fve,
      ...fve,
      modules: arrayOrEmpty(fve.modules || fve.moduleTypes || fve.pvModules),
      inverters: arrayOrEmpty(fve.inverters),
      mppts: arrayOrEmpty(fve.mppts),
      strings: arrayOrEmpty(fve.strings),
      dcRoutes: arrayOrEmpty(fve.dcRoutes || fve.dc_routes || fve.dc_circuits),
      acConnections: arrayOrEmpty(fve.acConnections || fve.ac_connections),
      panels: arrayOrEmpty(fve.panels),
    },
    cad: {
      ...defaults.cad,
      ...cad,
      layers: arrayOrEmpty(cad.layers),
      objects: arrayOrEmpty(cad.objects),
      symbols: arrayOrEmpty(cad.symbols),
      map: objectOrEmpty(cad.map),
    },
    lps: {
      ...defaults.lps,
      ...lps,
      objects: arrayOrEmpty(lps.objects || lps.components || lpsSpdLpz.lps_elements),
      downConductors: arrayOrEmpty(lps.downConductors || lps.down_conductors || lpsSpdLpz.down_conductors),
      airTermination: arrayOrEmpty(lps.airTermination || lps.air_termination),
      hviRoutes: arrayOrEmpty(lps.hviRoutes || lps.hvi_routes || lpsSpdLpz.hvi_routes),
      riskAssessment: {
        ...defaults.lps.riskAssessment,
        ...objectOrEmpty(lps.riskAssessment),
        placeholder: lps.riskAssessment?.placeholder !== false,
        normative: lps.riskAssessment?.normative === true ? false : false,
      },
    },
    spd: {
      ...defaults.spd,
      ...spd,
      devices: arrayOrEmpty(spd.devices || lpsSpdLpz.spd_devices).concat(arrayOrEmpty(lpsSpdLpz.spd_dc), arrayOrEmpty(lpsSpdLpz.spd_ac)),
      lpz: arrayOrEmpty(spd.lpz || spd.lpZones || data.lpz?.zones || lpsSpdLpz.lpz_zones),
    },
    grounding: {
      ...defaults.grounding,
      ...grounding,
      systems: arrayOrEmpty(grounding.systems || lpsSpdLpz.earthing_systems),
      connected: grounding.connected === true,
    },
    bonding: {
      ...defaults.bonding,
      ...bonding,
      connections: arrayOrEmpty(bonding.connections || lpsSpdLpz.bonding),
      connected: bonding.connected === true,
    },
    documents: arrayOrEmpty(data.documents || data.dokumenty || data.documents?.generated),
    bom: arrayOrEmpty(data.bom),
    qa: {
      ...defaults.qa,
      ...objectOrEmpty(data.qa),
      findings: arrayOrEmpty(data.qa?.findings || data.qa?.issues || data.qa?.results),
      summary: mergeObject(defaults.qa.summary, data.qa?.summary),
    },
    export: {
      ...defaults.export,
      ...exportSection,
      packages: arrayOrEmpty(exportSection.packages || data.exports || (data.export_package ? [data.export_package] : [])),
      files: arrayOrEmpty(exportSection.files),
      warnings: arrayOrEmpty(exportSection.warnings),
    },
  };

  return normalized;
}
