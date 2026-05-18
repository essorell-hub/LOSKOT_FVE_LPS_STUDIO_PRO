
import assert from "node:assert/strict";
import { CABLE_ROUTING_ENGINE_VERSION, createCableRoutingEngine, safeCableRoutingEngine } from "../../src/runtime/cableRoutingEngine.js";

assert.equal(CABLE_ROUTING_ENGINE_VERSION, "v58-cable-routing-engine");
const engine = createCableRoutingEngine();
const project = { fve: { dcRoutes: [{ id: "DC1", cableType: "H1Z2Z2-K", crossSectionMm2: 6, points: [{ x: 0, y: 0 }, { x: 3, y: 4 }] }] } };

const lengths = engine.calculateRouteLengths(project);
assert.equal(lengths.ok, true);
assert.equal(lengths.data.totalLengthM, 5);

const qa = engine.validateCableRoutes(project);
assert.equal(qa.ok, true);
assert.equal(qa.data.status, "PASS");

assert.equal(engine.buildCableCadObjects(project).data.objects.length, 1);
assert.equal(engine.buildCableSchedule(project).data.rows[0].lengthM, 5);
assert.equal(engine.buildSqliteSyncPayload(project).data.dc_routes.length, 1);
assert.equal(engine.buildDocumentContext(project).ok, true);
assert.equal(engine.run("missing", {}).ok, false);
assert.equal(safeCableRoutingEngine().run("calculateRouteLengths", {}).ok, true);

console.log("v58 cable routing engine smoke test OK");

