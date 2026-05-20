export function evaluateLpsAirTermination(input = {}) {
  const airTermination = input.airTermination || {};
  const rods = Array.isArray(airTermination.rods) ? airTermination.rods : [];
  const conductors = Array.isArray(airTermination.conductors) ? airTermination.conductors : [];
  const meshes = Array.isArray(airTermination.meshes) ? airTermination.meshes : [];

  return {
    present: airTermination.present === true || rods.length > 0 || conductors.length > 0 || meshes.length > 0,
    method: airTermination.method || null,
    material: airTermination.material || null,
    crossSectionMm2: Number.isFinite(airTermination.crossSectionMm2) ? airTermination.crossSectionMm2 : null,
    rodsCount: rods.length,
    conductorsCount: conductors.length,
    meshesCount: meshes.length,
    protectsPvArray: airTermination.protectsPvArray === true,
    connectedToDownConductors: airTermination.connectedToDownConductors === true,
  };
}
