// LOSKOT FVE & LPS STUDIO PRO
// V160 Module Runtime Registry

import {
  QA_PANEL_RUNTIME_FEED_VERSION,
  createQaPanelRuntimeFeed,
  validateQaPanelRuntimeFeed
} from './qaPanelRuntimeFeedV159.js';

export const MODULE_RUNTIME_REGISTRY_VERSION = 'v160-module-runtime-registry';

export const MODULE_RUNTIME_IDS = Object.freeze({
  DASHBOARD: 'dashboard',
  PROJECT_CARD: 'project-card',
  ROOF_SITE: 'roof-site',
  FVE: 'fve',
  LPS: 'lps',
  ELECTRICAL: 'electrical',
  SPD: 'spd',
  GROUNDING: 'grounding',
  REPORTS: 'reports',
  DOCUMENTS: 'documents',
  DATABASE: 'database',
  EXPORTS: 'exports',
  SETTINGS: 'settings'
});

export function createModuleRuntimeRegistry(options = {}) {
  const feed = createQaPanelRuntimeFeed({ activeRouteKey: options.activeRouteKey, projectContext: options.projectContext });
  const feedValidation = validateQaPanelRuntimeFeed(feed);

  const modules = [
    { id: MODULE_RUNTIME_IDS.DASHBOARD, labelCs: 'Přehled zakázky', routes: ['dashboard'], ready: true },
    { id: MODULE_RUNTIME_IDS.PROJECT_CARD, labelCs: 'Karta zakázky', routes: ['project-card'], ready: true },
    { id: MODULE_RUNTIME_IDS.ROOF_SITE, labelCs: 'Střecha / areál', routes: ['roof-site'], ready: true },
    { id: MODULE_RUNTIME_IDS.FVE, labelCs: 'FVE návrh', routes: ['fve-2d-layout', 'fve-3d-design', 'fve-single-line'], ready: true },
    { id: MODULE_RUNTIME_IDS.LPS, labelCs: 'Hromosvod / LPS', routes: ['lps-lightning-protection'], ready: true },
    { id: MODULE_RUNTIME_IDS.ELECTRICAL, labelCs: 'Elektro část', routes: ['electrical-part'], ready: true },
    { id: MODULE_RUNTIME_IDS.SPD, labelCs: 'Přepěťové ochrany / SPD', routes: ['surge-protection-spd'], ready: true },
    { id: MODULE_RUNTIME_IDS.GROUNDING, labelCs: 'Pospojování / uzemnění', routes: ['bonding-grounding'], ready: true },
    { id: MODULE_RUNTIME_IDS.REPORTS, labelCs: 'Výkazy a sestavy', routes: ['reports-statements'], ready: true },
    { id: MODULE_RUNTIME_IDS.DOCUMENTS, labelCs: 'Dokumenty', routes: ['documents'], ready: true },
    { id: MODULE_RUNTIME_IDS.DATABASE, labelCs: 'Databáze', routes: ['database'], ready: true },
    { id: MODULE_RUNTIME_IDS.EXPORTS, labelCs: 'Exporty', routes: ['exports'], ready: true },
    { id: MODULE_RUNTIME_IDS.SETTINGS, labelCs: 'Nastavení', routes: ['settings'], ready: true }
  ];

  return {
    registryVersion: MODULE_RUNTIME_REGISTRY_VERSION,
    feedVersion: QA_PANEL_RUNTIME_FEED_VERSION,
    ready: feedValidation.ok,
    visualMutationAllowed: false,
    activeRouteKey: feed.activeRouteKey,
    modules,
    feed,
    qa: {
      ok: feedValidation.ok,
      moduleCount: modules.length,
      readyModuleCount: modules.filter((module) => module.ready).length,
      errors: feedValidation.errors
    }
  };
}

export function resolveModuleForRoute(routeKey, registry = createModuleRuntimeRegistry({ activeRouteKey: routeKey })) {
  const module = registry.modules.find((item) => item.routes.includes(registry.activeRouteKey)) || registry.modules[0];
  return {
    registryVersion: registry.registryVersion,
    requestedRouteKey: routeKey,
    resolvedRouteKey: registry.activeRouteKey,
    moduleId: module.id,
    moduleLabelCs: module.labelCs,
    moduleReady: module.ready
  };
}

export function validateModuleRuntimeRegistry(registry = createModuleRuntimeRegistry()) {
  const errors = [];
  if (registry.registryVersion !== MODULE_RUNTIME_REGISTRY_VERSION) errors.push('Unexpected V160 registry version.');
  if (registry.visualMutationAllowed !== false) errors.push('Module registry must not allow visual mutation.');
  if (!Array.isArray(registry.modules) || registry.modules.length !== 13) errors.push('Module registry must contain 13 module groups.');
  if (!registry.qa || registry.qa.ok !== true) errors.push('Module registry QA is not OK.');
  return { ok: errors.length === 0, registryVersion: registry.registryVersion, moduleCount: registry.modules?.length || 0, activeRouteKey: registry.activeRouteKey, errors };
}
