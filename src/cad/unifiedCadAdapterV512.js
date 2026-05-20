import { createLayer, normalizeCadLayers } from "./layerModel.js";
import { createCadObject, normalizeCadObject } from "./objectModel.js";
import { normalizeUnifiedProject } from "../data/unifiedProjectModelV501.js";
import { validateUnifiedProjectRelations } from "../data/unifiedProjectRelationsV505.js";

export function normalizeUnifiedCad(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const layers = normalizeCadLayers(project.cad.layers.map((layer) => createLayer({
    id: layer.layerId || layer.id,
    name: layer.name,
    visible: layer.visible,
    locked: layer.locked,
    metadata: layer.metadata,
  })));
  const objects = project.cad.objects.map((object) => {
    try {
      return normalizeCadObject(createCadObject(object), false);
    } catch (error) {
      return {
        id: object.id || object.cadObjectId || "",
        name: object.name || "Invalid CAD object",
        geometryType: null,
        layerId: object.layerId || null,
        properties: { error: error.message },
        selected: false,
        visible: true,
        locked: false,
      };
    }
  });
  const relations = validateUnifiedProjectRelations({ ...project, cad: { ...project.cad, layers, objects } });

  return {
    layers,
    objects,
    qaFindings: relations.findings,
    qaSummary: relations.qaSummary,
  };
}
