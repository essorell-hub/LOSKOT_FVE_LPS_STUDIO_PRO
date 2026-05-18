import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";



export const CABLE_ROUTING_ENGINE_VERSION = "v58-cable-routing-engine";

const MODULE_NAME = "cableRoutingEngine";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: CABLE_ROUTING_ENGINE_VERSION,
      classicProUnchanged: true
    }
  });
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeRoute(route = {}) {
  const points = normalizeArray(route.points || route.path).map((point) => ({ x: finiteNumber(point.x, 0), y: finiteNumber(point.y, 0), z: finiteNumber(point.z, 0) }));
  return {
    id: normalizeString(route.id || route.routeId, ""),
    routeType: normalizeString(route.routeType || route.type, "dc"),
    fromId: normalizeString(route.fromId, ""),
    toId: normalizeString(route.toId, ""),
    points,
    cableType: normalizeString(route.cableType, ""),
    crossSectionMm2: finiteNumber(route.crossSectionMm2 ?? route.cross_section_mm2, 0),
    layerId: normalizeString(route.layerId, "fve.dcRoutes")
  };
}

function distance(a, b) {
  const dx = finiteNumber(b.x, 0) - finiteNumber(a.x, 0);
  const dy = finiteNumber(b.y, 0) - finiteNumber(a.y, 0);
  const dz = finiteNumber(b.z, 0) - finiteNumber(a.z, 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function routeLength(route) {
  let total = 0;
  route.points.forEach((point, index) => {
    if (index > 0) total += distance(route.points[index - 1], point);
  });
  return total;
}

export function createCableRoutingEngine(options = {}) {
  function normalizeRoutes(project = {}) {
    const fve = project.fve || {};
    const lps = project.lps || {};
    return [
      ...normalizeArray(fve.dcRoutes).map(normalizeRoute),
      ...normalizeArray(lps.hviRoutes).map((route) => normalizeRoute({ ...route, routeType: "hvi", layerId: "lps.hvi" })),
      ...normalizeArray(project.cableRoutes).map(normalizeRoute)
    ];
  }

  function calculateRouteLengths(project = {}) {
    const routes = normalizeRoutes(project).map((route) => ({ ...route, lengthM: routeLength(route) }));
    return createResult("calculateRouteLengths", { routes, totalLengthM: routes.reduce((sum, route) => sum + route.lengthM, 0), classicProUnchanged: true });
  }

  function validateCableRoutes(project = {}) {
    const calculated = calculateRouteLengths(project).data.routes;
    const issues = [];
    calculated.forEach((route) => {
      if (route.points.length < 2) issues.push({ key: "route.has_path", severity: "WARNING", status: "WARNING", routeId: route.id, message: `Trasa ${route.id} nemá dost bodů.` });
      if (!route.cableType && route.routeType === "dc") issues.push({ key: "route.cable_type", severity: "WARNING", status: "WARNING", routeId: route.id, message: `DC trasa ${route.id} nemá typ kabelu.` });
      if (!route.crossSectionMm2 && route.routeType === "dc") issues.push({ key: "route.cross_section", severity: "WARNING", status: "WARNING", routeId: route.id, message: `DC trasa ${route.id} nemá průřez kabelu.` });
    });
    return createResult("validateCableRoutes", { status: issues.length ? "WARNING" : "PASS", issues });
  }

  function buildCableCadObjects(project = {}) {
    const routes = calculateRouteLengths(project).data.routes;
    return createResult("buildCableCadObjects", { objects: routes.map((route) => ({ id: `route:${route.id}`, type: `${route.routeType}-route`, layerId: route.layerId, geometry: { points: route.points }, label: route.id, lengthM: route.lengthM })), classicProUnchanged: true });
  }

  function buildCableSchedule(project = {}) {
    const routes = calculateRouteLengths(project).data.routes;
    return createResult("buildCableSchedule", { rows: routes.map((route) => ({ id: route.id, routeType: route.routeType, fromId: route.fromId, toId: route.toId, cableType: route.cableType, crossSectionMm2: route.crossSectionMm2, lengthM: route.lengthM })) });
  }

  function buildSqliteSyncPayload(project = {}) {
    const routes = calculateRouteLengths(project).data.routes;
    return createResult("buildSqliteSyncPayload", { dc_routes: routes.filter((route) => route.routeType === "dc"), hvi_routes: routes.filter((route) => route.routeType === "hvi") });
  }

  function buildDocumentContext(project = {}) {
    const schedule = buildCableSchedule(project);
    const qa = validateCableRoutes(project);
    return createResult("buildDocumentContext", { schedule: schedule.data, qa: qa.data, classicProUnchanged: true });
  }

  function run(command, payload = {}) {
    if (command === "normalizeRoutes") return createResult("normalizeRoutes", normalizeRoutes(payload.project || payload));
    if (command === "calculateRouteLengths") return calculateRouteLengths(payload.project || payload);
    if (command === "validateCableRoutes") return validateCableRoutes(payload.project || payload);
    if (command === "buildCableCadObjects") return buildCableCadObjects(payload.project || payload);
    if (command === "buildCableSchedule") return buildCableSchedule(payload.project || payload);
    if (command === "buildSqliteSyncPayload") return buildSqliteSyncPayload(payload.project || payload);
    if (command === "buildDocumentContext") return buildDocumentContext(payload.project || payload);
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return { version: CABLE_ROUTING_ENGINE_VERSION, classicProUnchanged: true, normalizeRoutes, calculateRouteLengths, validateCableRoutes, buildCableCadObjects, buildCableSchedule, buildSqliteSyncPayload, buildDocumentContext, run };
}

export function safeCableRoutingEngine(options = {}) {
  try { return createCableRoutingEngine(options); } catch (error) {
    return { version: CABLE_ROUTING_ENGINE_VERSION, classicProUnchanged: true, run() { return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" }); } };
  }
}

export default { CABLE_ROUTING_ENGINE_VERSION, createCableRoutingEngine, safeCableRoutingEngine };

