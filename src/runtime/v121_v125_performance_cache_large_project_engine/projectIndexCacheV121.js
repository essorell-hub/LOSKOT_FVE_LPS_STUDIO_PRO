// MEGA PACK L — V121–V125 Performance / Cache / Large Project Engine - projectIndexCacheV121
// Pure runtime helper. No DOM. No package dependency.

export function projectIndexCacheV121(project = {}, options = {}) {
  const cadObjects = Array.isArray(project?.cad?.objects) ? project.cad.objects : [];
  const panels = Array.isArray(project?.fve?.panels) ? project.fve.panels : [];
  const strings = Array.isArray(project?.fve?.strings) ? project.fve.strings : [];
  const qa = Array.isArray(project?.qa?.results) ? project.qa.results : [];

  const objectTotal = cadObjects.length + panels.length + strings.length + qa.length;
  const warningLimit = Number(options.warningLimit ?? 2500);
  const hardLimit = Number(options.hardLimit ?? 10000);

  return {
    pack: "L",
    module: "projectIndexCacheV121",
    cadObjects: cadObjects.length,
    panels: panels.length,
    strings: strings.length,
    qaResults: qa.length,
    objectTotal,
    cacheRecommended: objectTotal > warningLimit,
    status: objectTotal > hardLimit ? "LIMIT_EXCEEDED" : "OK",
    generatedAt: options.now || new Date().toISOString(),
  };
}
