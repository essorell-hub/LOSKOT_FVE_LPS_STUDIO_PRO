export const CAD_SYMBOL_REGISTRY_VERSION = "v49-cad-symbol-registry";

const DEFAULT_STATES = Object.freeze(["normal", "selected", "warning", "error", "disabled", "printBw"]);
const DEFAULT_PROFILES = Object.freeze(["cad", "documentation", "map", "ui"]);

const FALLBACK_SYMBOL = Object.freeze({
  id: "fallback.missing_symbol",
  name: "Missing CAD symbol",
  category: "fallback",
  usage: ["cad", "documentation", "map", "ui"],
  layerId: "system.fallback",
  state: "warning",
  svgPath: null,
  png: {},
  viewBox: "0 0 64 64",
  tags: ["fallback", "missing", "safe"],
  fallback: true,
  classicProUnchanged: true
});

const SAMPLE_SYMBOLS = Object.freeze([
  {
    id: "fve.panel.basic",
    name: "FVE panel basic",
    category: "fve",
    usage: ["cad", "documentation"],
    layerId: "fve.panels",
    state: "normal",
    svgPath: "src/assets/cad/symbols/fve/fve_panel_basic.svg",
    png: { "32": "src/assets/cad/png/32/fve_panel_basic.png", "64": "src/assets/cad/png/64/fve_panel_basic.png" },
    viewBox: "0 0 64 64",
    tags: ["panel", "pv", "module"],
    fallback: false
  },
  {
    id: "lps.air_terminal.basic",
    name: "LPS air terminal basic",
    category: "lps",
    usage: ["cad", "documentation"],
    layerId: "lps.airTerminals",
    state: "normal",
    svgPath: "src/assets/cad/symbols/lps/lps_air_terminal_basic.svg",
    png: { "32": "src/assets/cad/png/32/lps_air_terminal_basic.png", "64": "src/assets/cad/png/64/lps_air_terminal_basic.png" },
    viewBox: "0 0 64 64",
    tags: ["jimaci tyc", "air terminal", "lps"],
    fallback: false
  },
  {
    id: "electro.spd.dc.basic",
    name: "SPD DC basic",
    category: "electro",
    usage: ["cad", "documentation"],
    layerId: "electro.spd",
    state: "normal",
    svgPath: "src/assets/cad/symbols/electro/spd_dc_basic.svg",
    png: { "32": "src/assets/cad/png/32/spd_dc_basic.png", "64": "src/assets/cad/png/64/spd_dc_basic.png" },
    viewBox: "0 0 64 64",
    tags: ["spd", "dc", "surge protection"],
    fallback: false
  }
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeSymbol(raw, index = 0) {
  if (!raw || typeof raw !== "object") return null;
  const id = normalizeString(raw.id, `unnamed.symbol.${index + 1}`);
  const category = normalizeString(raw.category, "uncategorized");
  const usage = asArray(raw.usage).map((item) => normalizeString(item)).filter(Boolean);
  const tags = asArray(raw.tags).map((item) => normalizeString(item)).filter(Boolean);
  const png = raw.png && typeof raw.png === "object" && !Array.isArray(raw.png) ? { ...raw.png } : {};

  return {
    id,
    name: normalizeString(raw.name, id),
    category,
    usage: usage.length ? usage : ["cad"],
    layerId: normalizeString(raw.layerId, `${category}.default`),
    state: normalizeString(raw.state, "normal"),
    svgPath: typeof raw.svgPath === "string" ? raw.svgPath : null,
    png,
    viewBox: normalizeString(raw.viewBox, "0 0 64 64"),
    tags,
    fallback: Boolean(raw.fallback),
    classicProUnchanged: true
  };
}

function normalizeIndex(inputIndex = {}) {
  const sourceSymbols = Array.isArray(inputIndex.symbols) ? inputIndex.symbols : SAMPLE_SYMBOLS;
  const normalizedSymbols = sourceSymbols.map((symbol, index) => normalizeSymbol(symbol, index)).filter(Boolean);
  const map = new Map();
  const duplicates = [];

  for (const symbol of normalizedSymbols) {
    if (map.has(symbol.id)) {
      duplicates.push(symbol.id);
      continue;
    }
    map.set(symbol.id, symbol);
  }

  return {
    version: normalizeString(inputIndex.version, "v49-inline-symbol-index"),
    source: normalizeString(inputIndex.source, "runtime inline symbol index"),
    profiles: asArray(inputIndex.profiles).length ? asArray(inputIndex.profiles) : [...DEFAULT_PROFILES],
    states: asArray(inputIndex.states).length ? asArray(inputIndex.states) : [...DEFAULT_STATES],
    symbols: [...map.values()],
    duplicates,
    classicProUnchanged: true
  };
}

function createError(code, message, detail = {}) {
  return { ok: false, code, message, detail, classicProUnchanged: true };
}

export function createCadSymbolRegistry(options = {}) {
  const normalizedIndex = normalizeIndex(options.index || {});
  const fallbackSymbol = normalizeSymbol(options.fallbackSymbol || FALLBACK_SYMBOL, 0) || clone(FALLBACK_SYMBOL);
  const symbolsById = new Map(normalizedIndex.symbols.map((symbol) => [symbol.id, symbol]));

  function listSymbols(filters = {}) {
    let result = normalizedIndex.symbols;
    if (filters.category) result = result.filter((symbol) => symbol.category === filters.category);
    if (filters.usage) result = result.filter((symbol) => symbol.usage.includes(filters.usage));
    if (filters.state) result = result.filter((symbol) => symbol.state === filters.state);
    if (filters.layerId) result = result.filter((symbol) => symbol.layerId === filters.layerId);
    if (filters.search) {
      const search = String(filters.search).toLowerCase();
      result = result.filter((symbol) => [symbol.id, symbol.name, symbol.category, symbol.layerId, ...symbol.tags].join(" ").toLowerCase().includes(search));
    }
    return clone(result);
  }

  function getSymbol(id, opts = {}) {
    const normalizedId = normalizeString(id);
    if (!normalizedId) return opts.strict ? null : clone(fallbackSymbol);
    const symbol = symbolsById.get(normalizedId);
    if (!symbol) return opts.strict ? null : { ...clone(fallbackSymbol), missingId: normalizedId };
    return clone(symbol);
  }

  function hasSymbol(id) {
    return symbolsById.has(normalizeString(id));
  }

  function getCategories() {
    return [...new Set(normalizedIndex.symbols.map((symbol) => symbol.category))].sort();
  }

  function getLayers() {
    return [...new Set(normalizedIndex.symbols.map((symbol) => symbol.layerId))].sort();
  }

  function getProfiles() {
    return clone(normalizedIndex.profiles);
  }

  function getStates() {
    return clone(normalizedIndex.states);
  }

  function getAssetReference(id, opts = {}) {
    const symbol = getSymbol(id, { strict: false });
    const size = String(opts.size || "64");
    const prefer = opts.prefer || "svg";
    if (prefer === "png" && symbol.png && symbol.png[size]) {
      return { ok: true, type: "png", id: symbol.id, path: symbol.png[size], size, fallback: Boolean(symbol.fallback), classicProUnchanged: true };
    }
    if (symbol.svgPath) {
      return { ok: true, type: "svg", id: symbol.id, path: symbol.svgPath, size: null, fallback: Boolean(symbol.fallback), classicProUnchanged: true };
    }
    return { ok: true, type: "fallback", id: symbol.id, path: null, size: null, fallback: true, classicProUnchanged: true };
  }

  function validateIndex() {
    const errors = [];
    const warnings = [];
    if (normalizedIndex.duplicates.length) warnings.push({ code: "DUPLICATE_SYMBOL_IDS_SKIPPED", ids: clone(normalizedIndex.duplicates) });
    for (const symbol of normalizedIndex.symbols) {
      if (!symbol.id) errors.push({ code: "MISSING_ID", symbol });
      if (!symbol.category) warnings.push({ code: "MISSING_CATEGORY", id: symbol.id });
      if (!symbol.svgPath && (!symbol.png || Object.keys(symbol.png).length === 0)) warnings.push({ code: "MISSING_ASSET_REFERENCE", id: symbol.id });
    }
    return { ok: errors.length === 0, errors, warnings, count: normalizedIndex.symbols.length, duplicateCount: normalizedIndex.duplicates.length, classicProUnchanged: true };
  }

  function getSummary() {
    return { ok: true, version: CAD_SYMBOL_REGISTRY_VERSION, indexVersion: normalizedIndex.version, source: normalizedIndex.source, count: normalizedIndex.symbols.length, categories: getCategories(), layers: getLayers(), states: getStates(), profiles: getProfiles(), validation: validateIndex(), classicProUnchanged: true };
  }

  function run(command, payload = {}) {
    try {
      switch (command) {
        case "listSymbols": return { ok: true, symbols: listSymbols(payload), classicProUnchanged: true };
        case "getSymbol": return { ok: true, symbol: getSymbol(payload.id, payload), classicProUnchanged: true };
        case "hasSymbol": return { ok: true, hasSymbol: hasSymbol(payload.id), classicProUnchanged: true };
        case "getCategories": return { ok: true, categories: getCategories(), classicProUnchanged: true };
        case "getLayers": return { ok: true, layers: getLayers(), classicProUnchanged: true };
        case "getAssetReference": return getAssetReference(payload.id, payload);
        case "validateIndex": return validateIndex();
        case "getSummary": return getSummary();
        default: return createError("UNSUPPORTED_COMMAND", `Unsupported CAD symbol registry command: ${command}`, { command });
      }
    } catch (error) {
      return createError("REGISTRY_COMMAND_FAILED", error?.message || "CAD symbol registry command failed", { command });
    }
  }

  return { version: CAD_SYMBOL_REGISTRY_VERSION, listSymbols, getSymbol, hasSymbol, getCategories, getLayers, getProfiles, getStates, getAssetReference, validateIndex, getSummary, run, classicProUnchanged: true };
}

export function safeCadSymbolRegistry(options = {}) {
  try {
    return createCadSymbolRegistry(options);
  } catch (error) {
    const fallback = clone(FALLBACK_SYMBOL);
    return {
      version: CAD_SYMBOL_REGISTRY_VERSION,
      listSymbols: () => [],
      getSymbol: (id) => ({ ...fallback, missingId: normalizeString(id) || null }),
      hasSymbol: () => false,
      getCategories: () => ["fallback"],
      getLayers: () => ["system.fallback"],
      getProfiles: () => [...DEFAULT_PROFILES],
      getStates: () => [...DEFAULT_STATES],
      getAssetReference: (id) => ({ ok: true, type: "fallback", id: normalizeString(id) || fallback.id, path: null, fallback: true, classicProUnchanged: true }),
      validateIndex: () => ({ ok: false, errors: [{ code: "REGISTRY_INIT_FAILED", message: error?.message || "Unknown error" }], warnings: [], count: 0, classicProUnchanged: true }),
      getSummary: () => ({ ok: false, version: CAD_SYMBOL_REGISTRY_VERSION, count: 0, error: error?.message || "Unknown error", classicProUnchanged: true }),
      run: (command) => createError("REGISTRY_INIT_FAILED", "CAD symbol registry is running in fallback mode", { command }),
      classicProUnchanged: true
    };
  }
}

export default { CAD_SYMBOL_REGISTRY_VERSION, createCadSymbolRegistry, safeCadSymbolRegistry };
