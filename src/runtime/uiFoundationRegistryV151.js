// LOSKOT FVE & LPS STUDIO PRO
// V151 UI Foundation Registry
//
// This file is a source-of-truth bridge between approved UI graphics and runtime implementation.
// It does not replace, redesign, or unlock the approved Classic PRO / electro-CAD style.

export const UI_FOUNDATION_REGISTRY_VERSION = 'v151-ui-foundation-registry';

export const APPROVED_UI_BASELINE = Object.freeze({
  id: 'APPROVED_UI_STYLE_BASELINE_01',
  name: 'LOSKOT FVE Studio PRO v3 / PREMIUM UI ENGINE',
  status: 'LOCKED_APPROVED',
  style: 'dark Classic PRO, elektro-CAD/EPLAN character, green accents',
  layout: {
    leftNavigation: true,
    centralWorkspace: true,
    rightQaPanel: true
  },
  constraints: [
    'Do not replace approved Classic PRO visual style.',
    'Do not introduce cartoon/generic AI icon style.',
    'Use Czech user-facing labels.',
    'Protect against white screen failures.',
    'Every screen must support real project data, QA, calculation, documentation, database, or export workflow.'
  ]
});

export const APPROVED_MAIN_SCREENS = Object.freeze([
  {
    order: 10,
    id: 'APPROVED_SCREEN_DASHBOARD_01_VARIANT_A',
    labelCs: 'Přehled zakázky / Dashboard',
    routeKey: 'dashboard',
    workMode: 'Zadání zakázky',
    locked: true
  },
  {
    order: 20,
    id: 'APPROVED_SCREEN_PROJECT_CARD_01_VARIANT_A_FINAL_STYLE_RENDER',
    labelCs: 'Karta zakázky',
    routeKey: 'project-card',
    workMode: 'Zadání zakázky',
    locked: true
  },
  {
    order: 30,
    id: 'APPROVED_SCREEN_ROOF_SITE_01_VARIANT_B_FINAL_STYLE_RENDER',
    labelCs: 'Střecha / areál',
    routeKey: 'roof-site',
    workMode: 'Návrh',
    locked: true
  },
  {
    order: 40,
    id: 'APPROVED_SCREEN_FVE_2D_LAYOUT_01_VARIANT_A',
    labelCs: 'Návrh FVE – 2D rozložení',
    routeKey: 'fve-2d-layout',
    workMode: 'Návrh',
    locked: true
  },
  {
    order: 50,
    id: 'APPROVED_SCREEN_FVE_3D_DESIGN_01_VARIANT_A',
    labelCs: 'Návrh FVE – 3D návrh',
    routeKey: 'fve-3d-design',
    workMode: 'Návrh',
    locked: true
  },
  {
    order: 60,
    id: 'APPROVED_SCREEN_FVE_SINGLE_LINE_01_VARIANT_C_BOTTOM',
    labelCs: 'Návrh FVE – Jednopólové schéma',
    routeKey: 'fve-single-line',
    workMode: 'Návrh',
    locked: true
  },
  {
    order: 70,
    id: 'APPROVED_SCREEN_LPS_LIGHTNING_PROTECTION_01_VARIANT_C',
    labelCs: 'Hromosvod / LPS',
    routeKey: 'lps-lightning-protection',
    workMode: 'Návrh',
    locked: true
  },
  {
    order: 80,
    id: 'APPROVED_SCREEN_ELECTRICAL_PART_01_VARIANT_C',
    labelCs: 'Elektro část',
    routeKey: 'electrical-part',
    workMode: 'Kontrola',
    locked: true
  },
  {
    order: 90,
    id: 'APPROVED_SCREEN_SURGE_PROTECTION_SPD_01_VARIANT_C',
    labelCs: 'Přepěťové ochrany / SPD',
    routeKey: 'surge-protection-spd',
    workMode: 'Kontrola',
    locked: true
  },
  {
    order: 100,
    id: 'APPROVED_SCREEN_BONDING_GROUNDING_01_VARIANT_B',
    labelCs: 'Pospojování / uzemnění',
    routeKey: 'bonding-grounding',
    workMode: 'Kontrola',
    locked: true
  },
  {
    order: 110,
    id: 'APPROVED_SCREEN_REPORTS_STATEMENTS_01_VARIANT_B',
    labelCs: 'Výkazy a sestavy',
    routeKey: 'reports-statements',
    workMode: 'Dokumentace',
    locked: true
  },
  {
    order: 120,
    id: 'APPROVED_SCREEN_DOCUMENTS_01_VARIANT_B',
    labelCs: 'Dokumenty',
    routeKey: 'documents',
    workMode: 'Dokumentace',
    locked: true
  },
  {
    order: 130,
    id: 'APPROVED_SCREEN_DATABASE_01_VARIANT_B',
    labelCs: 'Databáze',
    routeKey: 'database',
    workMode: 'Databáze',
    locked: true
  },
  {
    order: 140,
    id: 'APPROVED_SCREEN_EXPORTS_01_VARIANT_A',
    labelCs: 'Exporty',
    routeKey: 'exports',
    workMode: 'Export',
    locked: true
  },
  {
    order: 150,
    id: 'APPROVED_SCREEN_SETTINGS_01_VARIANT_A',
    labelCs: 'Nastavení',
    routeKey: 'settings',
    workMode: 'Nastavení',
    locked: true
  }
]);

export const PRIMARY_WORKFLOW_ORDER = Object.freeze([
  'dashboard',
  'project-card',
  'roof-site',
  'fve-2d-layout',
  'fve-3d-design',
  'fve-single-line',
  'lps-lightning-protection',
  'electrical-part',
  'surge-protection-spd',
  'bonding-grounding',
  'reports-statements',
  'documents',
  'database',
  'exports',
  'settings'
]);

export function getApprovedUiBaseline() {
  return APPROVED_UI_BASELINE;
}

export function getApprovedMainScreens() {
  return APPROVED_MAIN_SCREENS.map((screen) => ({ ...screen }));
}

export function getApprovedScreenByRoute(routeKey) {
  return getApprovedMainScreens().find((screen) => screen.routeKey === routeKey) || null;
}

export function validateUiFoundationRegistry() {
  const errors = [];
  const warnings = [];

  if (APPROVED_UI_BASELINE.id !== 'APPROVED_UI_STYLE_BASELINE_01') {
    errors.push('Approved UI baseline identifier mismatch.');
  }

  const routeKeys = new Set();
  const ids = new Set();

  for (const screen of APPROVED_MAIN_SCREENS) {
    if (!screen.id || !screen.labelCs || !screen.routeKey) {
      errors.push('Approved screen is missing id, Czech label, or route key.');
    }

    if (!screen.locked) {
      errors.push('Approved screen is not locked: ' + screen.id);
    }

    if (routeKeys.has(screen.routeKey)) {
      errors.push('Duplicate route key: ' + screen.routeKey);
    }

    if (ids.has(screen.id)) {
      errors.push('Duplicate approved screen id: ' + screen.id);
    }

    routeKeys.add(screen.routeKey);
    ids.add(screen.id);
  }

  const actualOrder = APPROVED_MAIN_SCREENS.map((screen) => screen.routeKey);
  if (JSON.stringify(actualOrder) !== JSON.stringify(PRIMARY_WORKFLOW_ORDER)) {
    errors.push('Primary workflow order does not match approved screen order.');
  }

  if (APPROVED_MAIN_SCREENS.length < 15) {
    warnings.push('Approved main screen registry has fewer screens than expected.');
  }

  return {
    ok: errors.length === 0,
    registryVersion: UI_FOUNDATION_REGISTRY_VERSION,
    baselineId: APPROVED_UI_BASELINE.id,
    screenCount: APPROVED_MAIN_SCREENS.length,
    routeCount: routeKeys.size,
    lockedCount: APPROVED_MAIN_SCREENS.filter((screen) => screen.locked).length,
    errors,
    warnings
  };
}
