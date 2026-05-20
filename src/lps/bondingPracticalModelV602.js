export function evaluateBondingPracticalModel(input = {}) {
  const bonding = input.bonding || {};
  const bondedParts = Array.isArray(bonding.bondedParts) ? bonding.bondedParts : [];
  const unbondedMetalParts = Array.isArray(bonding.metalParts)
    ? bonding.metalParts.filter((part) => part.bonded !== true)
    : [];

  return {
    mainEquipotentialBusbarPresent: bonding.mainEquipotentialBusbarPresent === true,
    pvFramesBonded: bonding.pvFramesBonded === true,
    spdPePasLinked: bonding.spdPePasLinked === true,
    lpsGroundingLinked: bonding.lpsGroundingLinked === true,
    material: bonding.material || null,
    crossSectionMm2: Number.isFinite(bonding.crossSectionMm2) ? bonding.crossSectionMm2 : null,
    bondedPartsCount: bondedParts.length,
    unbondedMetalParts,
  };
}
