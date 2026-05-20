import assert from "node:assert/strict";
import { POST_MEGA_TABLES, createPostMegaSchemaSql, createPostMegaSchemaSummary, getPostMegaTableByName } from "../../src/database/postMegaSchemaRegistry.mjs";

assert.ok(POST_MEGA_TABLES.length >= 10);
assert.ok(getPostMegaTableByName("projects"));
assert.ok(getPostMegaTableByName("fve_panels"));
assert.ok(getPostMegaTableByName("spd_devices"));
const sql = createPostMegaSchemaSql();
assert.equal(sql.includes("CREATE TABLE IF NOT EXISTS projects"), true);
assert.equal(sql.includes("CREATE TABLE IF NOT EXISTS fve_panels"), true);
const summary = createPostMegaSchemaSummary();
assert.equal(summary.tableNames.includes("qa_findings"), true);
console.log("POST-MEGA V4 schema registry smoke PASS");
