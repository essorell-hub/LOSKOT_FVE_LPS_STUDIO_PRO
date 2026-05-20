import {
  asArray,
  collectProjectQaFindings,
  createDocumentTemplateV631,
  getProjectIdentity,
} from "./documentTemplateModelV631.js";

export function createProjectTechnicalReportV632(project = {}) {
  const identity = getProjectIdentity(project);
  return createDocumentTemplateV631({
    project,
    documentType: "projectTechnicalReport",
    title: "Project technical report",
    qaFindings: collectProjectQaFindings(project),
    sections: [
      { id: "identity", title: "Project identity", data: identity },
      {
        id: "scope",
        title: "Project scope",
        data: {
          hasFve: Boolean(project.fve || project.pv),
          hasLps: Boolean(project.lps),
          hasSpd: Boolean(project.spd),
          hasGrounding: Boolean(project.grounding),
          hasBonding: Boolean(project.bonding),
        },
      },
      {
        id: "modules",
        title: "Module overview",
        data: asArray(project.modules).map((module) => ({
          id: module.id || module.moduleId || "",
          type: module.type || module.moduleType || "",
          status: module.status || "draft",
        })),
      },
    ],
  });
}
