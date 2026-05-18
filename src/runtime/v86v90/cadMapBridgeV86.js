// LOSKOT V86-V90 CAD / Map Deep Integration - Map Bridge
// Pure runtime module. No DOM. No package dependency.

export function buildMapBridgeViewModelV86(project, options = {}) {
  const site = project?.site || {};
  const objects = Array.isArray(project?.cad?.objects) ? project.cad.objects : [];
  const geoObjects = objects.filter((object) => object.geometry?.type || object.map?.lat);

  return {
    screen: "map_bridge",
    enabled: true,
    center: {
      lat: Number(site.lat ?? options.defaultLat ?? 49.1951),
      lon: Number(site.lon ?? options.defaultLon ?? 16.6068),
      zoom: Number(site.zoom ?? options.defaultZoom ?? 18),
    },
    objectCount: geoObjects.length,
    objects: geoObjects.map((object) => ({
      id: object.id,
      layer: object.layer,
      objectType: object.object_type,
      geometry: object.geometry || object.map || null,
      linkedTable: object.linked_table || "",
      linkedId: object.linked_id || "",
    })),
  };
}

export function hasMapCoordinatesV86(project) {
  return Boolean(project?.site?.lat && project?.site?.lon);
}
