import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "dist", "verify");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "v48_app_entrypoint_candidates.txt");
const rootsToScan = ["src", "public", "app", "pages"].map((item) => path.join(root, item)).filter((item) => fs.existsSync(item));
const exts = new Set([".js", ".jsx", ".ts", ".tsx", ".html", ".vue", ".svelte"]);
const markers = [
  "data-loskot-fve-cad-root",
  "data-loskot-cad-preview",
  "data-cad-preview",
  "cad-preview",
  "CAD",
  "Project Inspector",
  "activeScreen",
  "Classic",
  "fve",
  "FVE"
];
const results = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!exts.has(path.extname(entry.name))) continue;
    const content = fs.readFileSync(full, "utf8");
    const hits = markers.filter((marker) => content.includes(marker));
    if (!hits.length) continue;
    const rel = path.relative(root, full).replace(/\\/g, "/");
    const score = hits.reduce((acc, marker) => acc + (marker.includes("cad") || marker.includes("CAD") ? 3 : 1), 0);
    results.push({ rel, score, hits });
  }
}

for (const dir of rootsToScan) walk(dir);
results.sort((a, b) => b.score - a.score || a.rel.localeCompare(b.rel));
const lines = [
  "===== v48 APP ENTRYPOINT SCAN =====",
  `ROOT=${root}`,
  `CANDIDATES=${results.length}`,
  "",
  ...results.slice(0, 30).map((item, index) => `${index + 1}. ${item.rel} | score=${item.score} | hits=${item.hits.join(", ")}`),
  "",
  "Poznámka: tento scan je informativní. Neprovádí automatický zásah do UI, pokud není jednoznačný bezpečný mount target.",
  "==================================="
];
fs.writeFileSync(outFile, `${lines.join("\n")}\n`, "utf8");
console.log(lines.join("\n"));
