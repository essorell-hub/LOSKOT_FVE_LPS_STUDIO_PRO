
import assert from "node:assert/strict";
import { ROOF_GEOMETRY_OBSTACLE_ENGINE_VERSION, createRoofGeometryObstacleEngine, safeRoofGeometryObstacleEngine } from "../../src/runtime/roofGeometryObstacleEngine.js";

assert.equal(ROOF_GEOMETRY_OBSTACLE_ENGINE_VERSION, "v57-roof-geometry-obstacle-engine");
const engine = createRoofGeometryObstacleEngine();

const project = {
  roof: {
    planes: [{ id: "R1", points: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 5 }, { x: 0, y: 5 }] }],
    obstacles: [{ id: "K1", x: 2, y: 2, width: 1, height: 1 }]
  },
  fve: { panels: [{ id: "P1", x: 2.2, y: 2.2, width: 2, height: 1 }] }
};

const areas = engine.calculateRoofAreas(project);
assert.equal(areas.ok, true);
assert.equal(areas.data.totalAreaM2, 50);

const conflicts = engine.detectPanelObstacleConflicts(project);
assert.equal(conflicts.ok, true);
assert.equal(conflicts.data.conflicts.length, 1);

const cad = engine.buildRoofCadObjects(project);
assert.equal(cad.ok, true);
assert.equal(cad.data.objects.length, 2);

assert.equal(engine.buildSqliteSyncPayload(project).ok, true);
assert.equal(engine.buildDocumentContext(project).ok, true);
assert.equal(engine.run("missing", {}).ok, false);
assert.equal(safeRoofGeometryObstacleEngine().run("calculateRoofAreas", {}).ok, true);

console.log("v57 roof geometry obstacle engine smoke test OK");

