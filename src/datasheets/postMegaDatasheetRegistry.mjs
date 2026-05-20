// POST-MEGA V4 NIGHT FACTORY
// Datasheet registry model.

export const POST_MEGA_DATASHEET_REGISTRY_VERSION = "post-mega-v4-datasheets-1";

export const REQUIRED_DATASHEET_FIELDS = [
  "id",
  "deviceType",
  "manufacturer",
  "model",
  "filePath",
  "source",
  "status"
];

export const DEVICE_DATASHEET_TYPES = [
  "pv_module",
  "inverter",
  "optimizer",
  "dc_spd",
  "ac_spd",
  "lps_component",
  "hvi_component",
  "metering",
  "switchgear"
];

export function createDatasheetRecord(input = {}) {
  const record = {};
  for (const field of REQUIRED_DATASHEET_FIELDS) {
    record[field] = input[field] ?? "";
  }
  record.status = record.status || "missing";
  return record;
}

export function validateDatasheetRecord(record = {}) {
  const missing = REQUIRED_DATASHEET_FIELDS.filter((field) => !record[field]);
  return {
    ok: missing.length === 0,
    missing,
    deviceTypeKnown: DEVICE_DATASHEET_TYPES.includes(record.deviceType)
  };
}

export function createDatasheetRegistrySummary(records = []) {
  const byType = {};
  for (const record of records) {
    const type = record.deviceType || "unknown";
    byType[type] = (byType[type] || 0) + 1;
  }
  return { version: POST_MEGA_DATASHEET_REGISTRY_VERSION, count: records.length, byType };
}
