import { asArray, collectProjectQaFindings, createDocumentTemplateV631 } from "./documentTemplateModelV631.js";

export function createGroundingBondingProtocolV635(project = {}) {
  const grounding = project.grounding || {};
  const bonding = project.bonding || {};
  return createDocumentTemplateV631({
    project,
    documentType: "groundingBondingProtocol",
    title: "Grounding and bonding protocol",
    qaFindings: [
      ...collectProjectQaFindings(project),
      ...asArray(grounding.qaFindings),
      ...asArray(bonding.qaFindings),
    ],
    sections: [
      { id: "grounding-electrodes", title: "Grounding electrodes", data: asArray(grounding.electrodes) },
      { id: "grounding-conductors", title: "Grounding conductors", data: asArray(grounding.conductors) },
      { id: "bonding-connections", title: "Bonding connections", data: asArray(bonding.connections) },
      {
        id: "measurements",
        title: "Measurements",
        data: {
          resistanceOhm: grounding.resistanceOhm ?? null,
          continuityChecks: asArray(bonding.continuityChecks),
        },
      },
    ],
  });
}
