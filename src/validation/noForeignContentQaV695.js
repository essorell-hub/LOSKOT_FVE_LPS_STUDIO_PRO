const FORBIDDEN_TERMS = ["Veolia", "FQ1", "S01BHE03", "DA"];

function scan(value, path = "$", findings = []) {
  if (value === null || value === undefined) return findings;
  if (typeof value === "string") {
    for (const term of FORBIDDEN_TERMS) {
      if (value.includes(term)) {
        findings.push({
          id: "RELEASE-009",
          severity: "BLOCKER",
          sourceModule: "foreign-content",
          sourceId: path,
          message: "Foreign project content marker found",
          ruleId: "RELEASE-009",
        });
      }
    }
    return findings;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => scan(item, `${path}[${index}]`, findings));
    return findings;
  }
  if (typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => scan(child, `${path}.${key}`, findings));
  }
  return findings;
}

export function detectForeignContentQaV695(project = {}) {
  return scan(project);
}
