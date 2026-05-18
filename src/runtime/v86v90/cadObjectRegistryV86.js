// LOSKOT V86-V90 CAD / Map Deep Integration - Object Registry
// Pure runtime module. No DOM. No package dependency.

export function buildCadObjectRegistryV86(project) {
  const objects = Array.isArray(project?.cad?.objects) ? project.cad.objects : [];
  const registry = new Map();

  for (const object of objects) {
    if (!object.id) continue;
    registry.set(object.id, {
      id: object.id,
      layer: object.layer || "",
      objectType: object.object_type || "",
      linkedTable: object.linked_table || "",
      linkedId: object.linked_id || "",
      geometry: object.geometry || null,
      raw: object,
    });
  }

  return {
    count: registry.size,
    objects: Array.from(registry.values()),
    byId: Object.fromEntries(registry.entries()),
  };
}

export function getCadObjectByIdV86(project, objectId) {
  const registry = buildCadObjectRegistryV86(project);
  return registry.byId[objectId] || null;
}

export function listCadObjectsByLayerV86(project, layerId) {
  return buildCadObjectRegistryV86(project).objects.filter((object) => object.layer === layerId);
}
