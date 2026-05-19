
## V221-V260 NIGHT WORK CONTROLLED APP INTEGRATION

- Added controlled app integration and night-work runtime supervision models V221-V260.
- Added smoke and deep audit tests.
- Runner commits development block first and then keeps PC busy with minimum-time audit loop.
- No visual, CSS, HTML, image, JSX/TSX, package or scripts/verify changes.

## V206-V220 SAFE VISIBLE SHELL ATTACHMENT

- Added safe visible shell attachment models V206-V220.
- Added smoke and deep audit tests with repeated local audit support.
- Scope remains runtime/data attachment models only.
- No visual, CSS, HTML, image, JSX/TSX, package or scripts/verify changes.

## V191-V205 LONG WORK APP SHELL RUNTIME MODELS

- Added app shell runtime mount, route, module, menu, workspace, QA, inspector, synchronization, event, command, diagnostics, deep audit, release gate, work plan and milestone models.
- Added main smoke test and deeper route audit test.
- Long runner repeats deep audit locally to make the PC work longer while keeping one SHORT report.
- No visual, CSS, HTML, image, JSX/TSX, package or scripts/verify changes.

## V181-V190 LONG AUTO APP SHELL RUNTIME BINDING

- Added read-only runtime data binding chain for existing app shell regions.
- Added combined smoke test.
- No visual, CSS, HTML, image, JSX/TSX, package or scripts/verify changes.

## V172-V180 LONG AUTO VISIBLE SHELL READINESS

- Added read-only visible shell readiness chain V172-V180.
- Added combined smoke test.
- No visual, CSS, HTML, image, JSX/TSX, package or scripts/verify changes.

## V166-V170 AUTO FAST RUNTIME READINESS PIPELINE

- V166: Added app runtime composition controller.
- V167: Added read-only shell binding contract for visible shell attachment preparation.
- V168: Added module data availability matrix.
- V169: Added release candidate gate.
- V170: Added full runtime audit snapshot.
- Added combined smoke test for V166-V170.
- Auto runner applies, tests, exact-stages and locally commits the readiness pipeline.
- No change to approved Classic PRO visual style.
- No CSS/HTML/image/JSX/TSX visual file changes.
- No package.json changes.

## V160-V165 AUTO FAST RUNTIME PIPELINE

- V160: Added module runtime registry.
- V161: Added workspace runtime router.
- V162: Added QA runtime aggregator.
- V163: Added project persistence bridge contract.
- V164: Added export package manifest contract.
- V165: Added app readiness model.
- Added combined smoke test for V160-V165.
- Auto runner applies, tests, exact-stages and locally commits the mini-pipeline.
- No change to approved Classic PRO visual style.
- No CSS/HTML/image/JSX/TSX visual file changes.
- No package.json changes.

## V157-V159 FAST RUNTIME MINIPACK

- V157: Added runtime action dispatcher contract for state-driven shell operations.
- V158: Added project context bridge contract for active project metadata and shell context.
- V159: Added QA panel runtime feed contract for shell/state/project diagnostics.
- Added combined FAST smoke test for V157-V159 runtime minipack.
- No change to approved Classic PRO visual style.
- No CSS/HTML/image/JSX/TSX visual file changes.
- No package.json changes.
- Purpose: accelerate safe runtime wiring while keeping approved UI graphics locked.

## V156 FAST APP STATE SHELL CONNECTOR

- Added connector between V155 app runtime shell and existing app state/controller runtime metadata.
- Added FAST smoke test for active-route propagation, state snapshot, action contract, QA readiness and visual-lock policy.
- No change to approved Classic PRO visual style.
- No CSS/HTML/image/JSX/TSX visual file changes.
- No package.json changes.
- Purpose: prepare controlled state-driven runtime shell operation without touching approved graphics.

## V155 FAST APP RUNTIME SHELL

- Added app runtime shell view-model built on V154 unified integration binding.
- Added FAST smoke test for route state, runtime composition contract, visual-lock policy and shell readiness.
- No change to approved Classic PRO visual style.
- No CSS/HTML/image/JSX/TSX visual file changes.
- No package.json changes.
- Purpose: prepare the first real runtime shell contract for the application without touching the approved graphics.

## V154 UI UNIFIED INTEGRATION BINDING

- Added additive runtime adapter connecting V153 UI bootstrap binding to the existing unifiedAppIntegration module.
- Added smoke test validating unified integration metadata, app-shell route propagation, visual-lock contract, and QA readiness.
- No change to approved Classic PRO visual style.
- No CSS/HTML/image/JSX/TSX visual file changes.
- No package.json changes.
- Purpose: prepare the real unified application runtime composition while keeping approved UI graphics locked.

## V153 UI BOOTSTRAP BINDING

- Added runtime bootstrap binding adapter built from V152 app-shell binding and existing runtimeBootstrap module.
- Added smoke test validating bootstrap bridge metadata, active-route propagation, visual-lock contract, and runtime module availability.
- No change to approved Classic PRO visual style.
- No CSS/HTML/image/JSX/TSX visual file changes.
- No package.json changes.
- Purpose: prepare safe integration between approved UI app-shell binding and the existing runtime bootstrap layer.

## V152 UI APP SHELL BINDING

- Added app-shell binding view-model built from V151 approved UI foundation registry.
- Added smoke test for navigation order, active route resolution, locked screen policy, and QA panel contract.
- No change to approved Classic PRO visual style.
- No package.json changes.
- Purpose: connect approved UI registry to future real app shell without touching visual implementation.

## V151 UI FOUNDATION REGISTRY

- Added runtime registry for approved UI baseline and approved main screens.
- Added smoke test validating locked UI baseline identifiers and main-screen order.
- No package.json changes.
- No change to approved Classic PRO visual style.
- Purpose: create a safe source-of-truth bridge for upcoming real UI implementation.
# CHANGELOG

## v21 SHARED PROJECT MODEL

- Navázáno na `v20 UNIFIED APP FOUNDATION`.
- Zachován Classic PRO tmavý vzhled.
- Zachováno levé menu a funkční přepínání obrazovek.
- Zvýrazněno, že aplikace je společný FVE + LPS program, ne pouze LPS/hromosvodový nástroj.
- Přidán sdílený projektový datový model.
- Datový model rozdělen na části: zakázka, objekt, střecha, FVE, LPS, SPD, LPZ, CAD, dokumenty, databáze a exporty.
- Přidána samostatná obrazovka `Sdílený model`.
- Přidána ukázková data projektu.
- Přidán JSON vzor projektu do `/database/sample-projects`.
- Doplněn JSON import s kontrolou povinných sekcí.
- Zachován JSON export projektu.
- Project Inspector je napojený na sdílený model.
- QA semafor byl upraven pro v21.
- CAD preview nově popisuje společné vrstvy FVE + LPS + LPZ + zemnění.
- Doplněna příprava SQLite tabulek.
- Doplněna příprava budoucí React/Tauri struktury.
- Zachována ochrana proti bílé obrazovce pomocí globálního zachytávání chyb a bezpečného vykreslení modulu.

## v20 UNIFIED APP FOUNDATION

- Vytvořen první sjednocený základ programu LOSKOT FVE & LPS STUDIO PRO.
- Přidán samostatný HTML preview soubor na dvojklik.
- Zachován směr Classic PRO tmavého rozhraní.
- Přidáno levé modulové menu.
- Přidán Dashboard.
- Přidán Project Inspector.
- Přidán QA semafor.
- Přidán FVE modul se základním výpočtem kWp.
- Přidán LPS / DEHN modul jako základ pro další migraci.
- Přidán SPD / LPZ modul.
- Přidán CAD / Mapa modul.
- Obnovena mapa alespoň jako technický placeholder.
- Přidán JSON export projektu.
- Přidána ochrana proti bílé obrazovce.

## v22 REACT TAURI SCAFFOLD - plán

- Převést HTML preview do čisté React struktury.
- Oddělit datový model do samostatného modulu.
- Oddělit FVE/LPS/SPD/LPZ/CAD moduly.
- Připravit Tauri-ready adresářovou strukturu.
- Připravit SQLite adapter bez ostrého zápisu do databáze.
