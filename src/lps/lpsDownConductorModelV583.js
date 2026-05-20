export function evaluateLpsDownConductors(input = {}) {
  const downConductors = input.downConductors || {};
  const items = Array.isArray(downConductors.items) ? downConductors.items : [];
  const connectedCount = items.filter((item) => item.connected === true).length;

  return {
    present: downConductors.present === true || items.length > 0,
    count: items.length,
    connectedCount,
    allConnected: items.length > 0 && connectedCount === items.length,
    material: downConductors.material || firstDefined(items, 'material'),
    crossSectionMm2: Number.isFinite(downConductors.crossSectionMm2)
      ? downConductors.crossSectionMm2
      : firstFiniteNumber(items, 'crossSectionMm2'),
    routing: downConductors.routing || null,
    connectedToGrounding: downConductors.connectedToGrounding === true,
  };
}

function firstDefined(items, key) {
  const found = items.find((item) => item && item[key]);
  return found ? found[key] : null;
}

function firstFiniteNumber(items, key) {
  const found = items.find((item) => item && Number.isFinite(item[key]));
  return found ? found[key] : null;
}
