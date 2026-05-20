export function createProjectOperationHistoryV845(seed = []) {
  const entries = Array.isArray(seed) ? [...seed] : [];
  return {
    entries,
    append(entry = {}) {
      const normalized = {
        index: entries.length,
        timestamp: entry.timestamp || "V845_STABLE_TIMESTAMP",
        ...entry
      };
      entries.push(normalized);
      return normalized;
    },
    list() {
      return entries.map((entry) => ({ ...entry }));
    },
    clear() {
      entries.length = 0;
    }
  };
}
