import { normalizeUnifiedProject } from "../data/unifiedProjectModelV501.js";
import { createQaFinding, runQaFeed } from "../validation/qaFeedEngine.js";

function routeId(route, index) {
  return route.routeId || route.id || `dc-route-${index + 1}`;
}

export function normalizeFveDcRoutes(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const routes = project.fve.dcRoutes.map((route, index) => ({
    routeId: routeId(route, index),
    stringId: route.stringId || null,
    from: route.from || route.fromId || null,
    to: route.to || route.toId || null,
    lengthM: Number(route.lengthM || route.length_m || 0),
    pending: route.pending === true || route.status === "pending",
    hasSupplementarySpd: route.hasSupplementarySpd === true,
    source: route,
  }));

  return {
    routes,
    qaFindings: evaluateFveDcRouteQa({ ...project, fve: { ...project.fve, dcRoutes: routes } }),
  };
}

export function evaluateFveDcRouteQa(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const findings = [];

  project.fve.dcRoutes.forEach((route, index) => {
    const lengthM = Number(route.lengthM || route.length_m || 0);
    if (lengthM <= 0 && route.pending !== true && route.status !== "pending") {
      findings.push(createQaFinding("FVE-DC-001", "WARN", "DC route must have positive length or be marked as pending.", {
        source: "FVE_DC_ROUTE_V534",
        routeId: routeId(route, index),
      }));
    }
  });

  return findings;
}

export function createFveDcRouteSummary(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const normalized = normalizeFveDcRoutes(project);
  const totalLengthM = normalized.routes.reduce((sum, route) => sum + (Number.isFinite(route.lengthM) ? route.lengthM : 0), 0);
  const feed = runQaFeed({ fveFindings: normalized.qaFindings, project });

  return {
    routeCount: normalized.routes.length,
    totalLengthM,
    pendingCount: normalized.routes.filter((route) => route.pending).length,
    routes: normalized.routes,
    qaFindings: feed.qaFindings,
    qaSummary: feed.qaSummary,
  };
}
