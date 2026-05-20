export function evaluateSpdLpZones(input = {}) {
  const spd = input.spd || {};
  const zones = Array.isArray(spd.lpZones) ? spd.lpZones : [];
  const transitions = Array.isArray(spd.transitions) ? spd.transitions : [];
  const hasInvalidTransition = transitions.some((transition) => !transition.from || !transition.to);

  return {
    zones,
    transitions,
    clear: spd.lpzClear === true || (zones.length > 0 && !hasInvalidTransition),
    hasInvalidTransition,
  };
}
