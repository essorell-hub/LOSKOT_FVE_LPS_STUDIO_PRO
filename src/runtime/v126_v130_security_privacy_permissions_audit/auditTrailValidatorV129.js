// MEGA PACK M — V126–V130 Security / Privacy / Permissions Audit - auditTrailValidatorV129
// Pure runtime helper. No DOM. No package dependency.

export function auditTrailValidatorV129(project = {}, options = {}) {
  const raw = JSON.stringify(project || {});
  const emailHits = (raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []).length;
  const phoneHits = (raw.match(/\+?\d[\d\s]{7,}\d/g) || []).length;
  const allowSensitiveExport = Boolean(options.allowSensitiveExport);
  const findings = emailHits + phoneHits;

  return {
    pack: "M",
    module: "auditTrailValidatorV129",
    emailHits,
    phoneHits,
    findings,
    allowSensitiveExport,
    status: findings > 0 && !allowSensitiveExport ? "REVIEW_REQUIRED" : "OK",
    generatedAt: options.now || new Date().toISOString(),
  };
}
