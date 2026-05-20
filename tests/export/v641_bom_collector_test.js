import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { collectBomItemsV642, mergeBomItemsV642 } from "../../src/export/bomCollectorV642.js";
import { createFveBomItemsV643 } from "../../src/export/fveBomAdapterV643.js";
import { createLpsSpdGroundingBomItemsV644 } from "../../src/export/lpsSpdGroundingBomAdapterV644.js";

const project = JSON.parse(
  readFileSync(new URL("../fixtures/v631_v760/project_docs_export_ok.json", import.meta.url), "utf8"),
);

const collected = collectBomItemsV642([
  createFveBomItemsV643(project),
  createLpsSpdGroundingBomItemsV644(project),
]);
const merged = mergeBomItemsV642(collected);

assert.ok(collected.length >= 8);
assert.ok(merged.length >= 8);
assert.ok(merged.every((item) => item.itemCode && item.name && item.category && item.unit));
assert.ok(merged.every((item) => Number.isFinite(item.quantity) && item.quantity > 0));
assert.ok(merged.some((item) => item.sourceModule === "fve"));
assert.ok(merged.some((item) => item.sourceModule === "lps"));
assert.ok(merged.some((item) => item.sourceModule === "spd"));
assert.ok(merged.some((item) => item.sourceModule === "grounding"));
assert.ok(merged.some((item) => item.sourceModule === "bonding"));

console.log("V641_BOM_COLLECTOR_TEST=PASS");
