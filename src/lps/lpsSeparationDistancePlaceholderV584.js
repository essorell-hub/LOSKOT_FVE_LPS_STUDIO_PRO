const DEFAULT_WARNING =
  'Placeholder dostatecne vzdalenosti neni finalni normovy vypocet podle norem; vysledek slouzi pouze pro praktickou QA kontrolu.';

export function evaluateLpsSeparationDistancePlaceholder(input = {}) {
  const separation = input.separationDistance || {};
  const requiredDistanceM = toNullableNumber(separation.requiredDistanceM);
  const availableDistanceM = toNullableNumber(separation.availableDistanceM);
  const verified = separation.verified === true;
  const hasCollision = input.pvArray?.collisionWithLps === true || separation.collisionWithPv === true;

  return {
    isPlaceholder: true,
    normative: false,
    warning: separation.warning || DEFAULT_WARNING,
    verified,
    requiredDistanceM,
    availableDistanceM,
    hasCollision,
    status: verified ? 'verified_by_external_design' : 'not_verified',
    marginM:
      requiredDistanceM === null || availableDistanceM === null
        ? null
        : round3(availableDistanceM - requiredDistanceM),
  };
}

function toNullableNumber(value) {
  return Number.isFinite(value) ? value : null;
}

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

export const LPS_SEPARATION_DISTANCE_PLACEHOLDER_WARNING = DEFAULT_WARNING;
