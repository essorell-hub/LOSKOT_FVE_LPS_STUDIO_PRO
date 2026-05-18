import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";



export const ROOF_GEOMETRY_OBSTACLE_ENGINE_VERSION = "v57-roof-geometry-obstacle-engine";

const MODULE_NAME = "roofGeometryObstacleEngine";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: ROOF_GEOMETRY_OBSTACLE_ENGINE_VERSION,
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

function normalizePoint(point = {}) {
  return { x: finiteNumber(point.x, 0), y: finiteNumber(point.y, 0) };
}

function normalizePlane(plane = {}) {
  const points = normalizeArray(plane.points || plane.polygon).map(normalizePoint);
  return {
    id: normalizeString(plane.id || plane.planeId, ""),
    label: normalizeString(plane.label, "Střešní rovina"),
    points,
    slopeDeg: finiteNumber(plane.slopeDeg ?? plane.slope_deg, 0),
    azimuthDeg: finiteNumber(plane.azimuthDeg ?? plane.azimuth_deg, 0),
    areaM2: finiteNumber(plane.areaM2 ?? plane.area_m2, points.length ? polygonArea(points) : 0),
    layerId: normalizeString(plane.layerId, "roof.geometry")
  };
}

function normalizeObstacle(obstacle = {}) {
  return {
    id: normalizeString(obstacle.id || obstacle.obstacleId, ""),
    type: normalizeString(obstacle.type, "unknown"),
    label: normalizeString(obstacle.label || obstacle.name, "Překážka"),
    x: finiteNumber(obstacle.x ?? obstacle.bounds?.x, 0),
    y: finiteNumber(obstacle.y ?? obstacle.bounds?.y, 0),
    width: finiteNumber(obstacle.width ?? obstacle.bounds?.width, 0),
    height: finiteNumber(obstacle.height ?? obstacle.bounds?.height, 0),
    clearanceM: finiteNumber(obstacle.clearanceM ?? obstacle.clearance_m, 0)
  };
}

function polygonArea(points = []) {
  if (points.length < 3) return 0;
  let sum = 0;
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    sum += point.x * next.y - next.x * point.y;
  });
  return Math.abs(sum) / 2;
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function createRoofGeometryObstacleEngine(options = {}) {
  function normalizeRoof(project = {}) {
    const roof = project.roof || project.roofs?.[0] || {};
    return {
      planes: normalizeArray(roof.planes || roof.roofPlanes || project.roofPlanes).map(normalizePlane),
      obstacles: normalizeArray(roof.obstacles || project.obstacles).map(normalizeObstacle),
      setbacks: normalizeArray(roof.setbacks || project.setbacks)
    };
  }

  function calculateRoofAreas(project = {}) {
    const roof = normalizeRoof(project);
    const totalAreaM2 = roof.planes.reduce((sum, plane) => sum + plane.areaM2, 0);
    return createResult("calculateRoofAreas", { planeCount: roof.planes.length, totalAreaM2, planes: roof.planes, classicProUnchanged: true });
  }

  function detectPanelObstacleConflicts(project = {}) {
    const roof = normalizeRoof(project);
    const panels = normalizeArray(project.fve?.panels).map((panel) => ({
      id: panel.id || panel.panelId,
      x: finiteNumber(panel.x ?? panel.bounds?.x, 0),
      y: finiteNumber(panel.y ?? panel.bounds?.y, 0),
      width: finiteNumber(panel.width ?? panel.bounds?.width, 0),
      height: finiteNumber(panel.height ?? panel.bounds?.height, 0)
    }));
    const conflicts = [];
    panels.forEach((panel) => {
      roof.obstacles.forEach((obstacle) => {
        if (rectsOverlap(panel, obstacle)) {
          conflicts.push({ key: "roof.panel.obstacle_conflict", severity: "WARNING", status: "WARNING", panelId: panel.id, obstacleId: obstacle.id, message: `Panel ${panel.id} koliduje s překážkou ${obstacle.id}.` });
        }
      });
    });
    return createResult("detectPanelObstacleConflicts", { conflicts, status: conflicts.length ? "WARNING" : "PASS" });
  }

  function buildRoofCadObjects(project = {}) {
    const roof = normalizeRoof(project);
    return createResult("buildRoofCadObjects", {
      objects: [
        ...roof.planes.map((plane) => ({ id: `roof-plane:${plane.id}`, type: "roof-plane", layerId: "roof.geometry", geometry: { points: plane.points }, label: plane.label })),
        ...roof.obstacles.map((obstacle) => ({ id: `roof-obstacle:${obstacle.id}`, type: "roof-obstacle", layerId: "roof.obstacles", bounds: obstacle, label: obstacle.label }))
      ],
      classicProUnchanged: true
    });
  }

  function buildSqliteSyncPayload(project = {}) {
    const roof = normalizeRoof(project);
    return createResult("buildSqliteSyncPayload", { roof_planes: roof.planes, roof_obstacles: roof.obstacles });
  }

  function buildDocumentContext(project = {}) {
    const areas = calculateRoofAreas(project);
    const conflicts = detectPanelObstacleConflicts(project);
    return createResult("buildDocumentContext", { roofSummary: areas.data, conflicts: conflicts.data, classicProUnchanged: true }, conflicts.warnings || []);
  }

  function run(command, payload = {}) {
    if (command === "normalizeRoof") return createResult("normalizeRoof", normalizeRoof(payload.project || payload));
    if (command === "calculateRoofAreas") return calculateRoofAreas(payload.project || payload);
    if (command === "detectPanelObstacleConflicts") return detectPanelObstacleConflicts(payload.project || payload);
    if (command === "buildRoofCadObjects") return buildRoofCadObjects(payload.project || payload);
    if (command === "buildSqliteSyncPayload") return buildSqliteSyncPayload(payload.project || payload);
    if (command === "buildDocumentContext") return buildDocumentContext(payload.project || payload);
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return { version: ROOF_GEOMETRY_OBSTACLE_ENGINE_VERSION, classicProUnchanged: true, normalizeRoof, calculateRoofAreas, detectPanelObstacleConflicts, buildRoofCadObjects, buildSqliteSyncPayload, buildDocumentContext, run };
}

export function safeRoofGeometryObstacleEngine(options = {}) {
  try { return createRoofGeometryObstacleEngine(options); } catch (error) {
    return { version: ROOF_GEOMETRY_OBSTACLE_ENGINE_VERSION, classicProUnchanged: true, run() { return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" }); } };
  }
}

export default { ROOF_GEOMETRY_OBSTACLE_ENGINE_VERSION, createRoofGeometryObstacleEngine, safeRoofGeometryObstacleEngine };

