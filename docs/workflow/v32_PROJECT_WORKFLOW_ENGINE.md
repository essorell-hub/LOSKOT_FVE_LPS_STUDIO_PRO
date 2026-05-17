# Projektový Workflow Engine v32

Tento dokument popisuje **Project Workflow Engine**, jehož cílem je propojit různé moduly aplikace LOSKOT FVE & LPS STUDIO PRO do uceleného pracovního postupu. Engine slouží jako orchestrátor pro správu dat, validaci, výpočty a exporty.

## Co Workflow Engine Propojuje

Workflow Engine je navržen tak, aby propojoval klíčové části aplikace:

-   **FVE Modul**: Zpracování dat týkajících se fotovoltaických elektráren (panely, stringy, měniče).
-   **CAD/Mapa Modul**: Správa a vizualizace objektů v technickém výkresu a mapě.
-   **LPS/DEHN Modul**: Zpracování dat pro ochranu proti blesku a přepětí, včetně posouzení rizika.
-   **Dokumentace**: Správa technických zpráv, protokolů a dalších dokumentů souvisejících s projektem.
-   **Exporty**: Generování exportních balíčků projektu.
-   **Validace (QA)**: Provádění kontrol a validací napříč moduly.
-   **Perzistence dat**: Ukládání a načítání stavu projektu pomocí `projectRepositoryPreview`.

## Co je Reálně Funkční (v21)

Současná verze Workflow Engine (v21) poskytuje následující funkčnosti:

-   **`createWorkflowProject`**: Vytvoření nového projektu se základní strukturou pro workflow.
-   **`normalizeWorkflowProject`**: Normalizace existujícího projektu do standardizovaného formátu pro engine.
-   **`runWorkflowQa`**: Základní Quality Assurance (QA) kontroly napříč moduly. Detekuje chybějící klíčové komponenty (např. FVE panely, LPS objekty, CAD vrstvy/objekty) a kontroluje přítomnost povinných dokumentů a validitu exportního manifestu.
-   **`createWorkflowSummary`**: Generování souhrnu stavu workflow na základě výsledků QA a modulových statusů.
-   **`saveWorkflowProject` / `loadWorkflowProject`**: Základní funkce pro ukládání a načítání projektu pomocí `projectRepositoryPreview` (simulovaná databáze v paměti).
-   **`createWorkflowExportManifest`**: Vytvoření manifestu pro exportní balíček na základě dat projektu. Zahrnuje informace o obsažených modulech.
-   **`runFullWorkflowPreview`**: Simulace kompletního průběhu workflow. Tato funkce orchestrací volá ostatní části enginu (normalizaci, QA, simulace výpočtů modulů) a aktualizuje stav projektu. Je navržena tak, aby při dalším vývoji mohla integrovat skutečné výpočetní a renderovací enginy.

## Co je Preview / Placeholder

Některé části Workflow Engine jsou v současné verzi pouze zástupné symboly (placeholdery) nebo představují preview funkcionalitu:

-   **Skutečné výpočty FVE, LPS, CAD**: V `runFullWorkflowPreview` jsou výpočty a zpracování dat pro jednotlivé moduly (FVE, CAD, LPS) pouze simulovány. Nejsou zde integrovány plnohodnotné normové výpočty ani renderovací enginy.
-   **`LPS_RISK_PLACEHOLDER`**: Výpočet LPS Risk Assessment je nahrazen statickým placeholderem.
-   **Stavy modulů v `createWorkflowSummary`**: `fveStatus`, `cadStatus`, `lpsStatus` jsou často "N/A" nebo závisí na základní přítomnosti dat, nikoliv na výsledcích skutečných výpočtů.
-   **`projectRepositoryPreview`**: Databáze je pouze v paměti a slouží pro testovací účely. Nejedná se o persistentní databázové řešení (např. SQLite).

## Další Kroky k Plné Verzi (v22 a dále)

Pro dosažení plnohodnotného Workflow Engine je plánováno:

1.  **Integrace Skutečných Výpočetních Enginů**:
    *   Nahradit simulace v `runFullWorkflowPreview` voláními skutečných FVE, LPS a CAD výpočetních a renderovacích funkcí (např. z modulů `fve/calculations`, `lps/calculations`, `cad/renderer`).
2.  **Persistentní Databáze**:
    *   Implementovat ukládání a načítání projektů do skutečné databáze (např. SQLite) pomocí nového databázového adaptéru, který nahradí `projectRepositoryPreview`.
3.  **Rozšířené QA a Validace**:
    *   Zpřesnit a rozšířit kontroly v `runWorkflowQa` tak, aby zahrnovaly komplexnější normové požadavky a validační pravidla pro každý modul.
4.  **Vylepšení Exportů**:
    *   Rozšířit `createWorkflowExportManifest` a související exportní logiku pro podporu různých formátů a detailnějších dat.
5.  **Uživatelské Rozhraní (UI) a Frontend**:
    *   V návaznosti na `v22 REACT TAURI SCAFFOLD` integrovat Workflow Engine s React frontendem a Tauri wrapperem pro plnohodnotnou desktopovou aplikaci.
6.  **Správa Dokumentů a Šablon**:
    *   Implementovat pokročilé funkce pro správu dokumentů, včetně generování šablon (DOCX/PDF).
