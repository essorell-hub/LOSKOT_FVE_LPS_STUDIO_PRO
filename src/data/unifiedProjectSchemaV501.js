export const UNIFIED_PROJECT_SCHEMA_VERSION = "v501-v530-unified-project-model";

export const UNIFIED_SEVERITIES = Object.freeze({
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  BLOCKER: "BLOCKER",
});

export const UNIFIED_SECTIONS = Object.freeze([
  "project",
  "building",
  "roof",
  "designConditions",
  "fve",
  "cad",
  "lps",
  "spd",
  "grounding",
  "bonding",
  "documents",
  "bom",
  "qa",
  "export",
]);

export const REQUIRED_PROJECT_FIELDS = Object.freeze(["projectId", "projectName"]);

export function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

export function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function cloneJson(value) {
  return JSON.parse(JSON.stringify(value ?? null));
}

export function createUnifiedDefaults(now = new Date().toISOString()) {
  return {
    schemaVersion: UNIFIED_PROJECT_SCHEMA_VERSION,
    appVersion: "v501-v530-data-only",
    project: {
      projectId: "",
      projectName: "",
      customer: {},
      site: {},
      metadata: {
        createdAt: now,
        updatedAt: now,
        sourceSchema: "",
      },
    },
    building: {
      buildingId: "",
      name: "",
      address: "",
      usageType: "",
      heightM: null,
      hasLps: false,
    },
    roof: {
      roofId: "",
      planes: [],
      obstacles: [],
      tiltDeg: null,
      azimuthDeg: null,
      areaM2: null,
    },
    designConditions: {
      minTempC: -10,
      maxTempC: 70,
      windZone: "",
      snowZone: "",
      corrosionClass: "",
      lightningDensity: null,
    },
    fve: {
      modules: [],
      inverters: [],
      mppts: [],
      strings: [],
      dcRoutes: [],
      acConnections: [],
      panels: [],
    },
    cad: {
      layers: [],
      objects: [],
      symbols: [],
      map: {},
    },
    lps: {
      objects: [],
      downConductors: [],
      airTermination: [],
      hviRoutes: [],
      riskAssessment: {
        placeholder: true,
        normative: false,
        findings: [],
      },
    },
    spd: {
      devices: [],
      lpz: [],
    },
    grounding: {
      systems: [],
      connected: false,
      resistanceOhm: null,
    },
    bonding: {
      connections: [],
      connected: false,
    },
    documents: [],
    bom: [],
    qa: {
      findings: [],
      summary: {
        total: 0,
        bySeverity: { INFO: 0, WARN: 0, ERROR: 0, BLOCKER: 0 },
        byCode: {},
        releaseGo: true,
      },
    },
    export: {
      manifest: null,
      packages: [],
      files: [],
      warnings: [],
    },
  };
}
