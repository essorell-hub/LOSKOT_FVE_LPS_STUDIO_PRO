export function createLocalId(prefix = "id") {
  const safePrefix = String(prefix || "id").replace(/[^a-zA-Z0-9_-]/g, "-");
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${safePrefix}-${time}-${random}`;
}

export default createLocalId;
