# v28 REPO AUDIT

## 1. Přehled aktuálních souborů v repozitáři

Tento repozitář obsahuje následující hlavní složky a soubory:

- `.aider.conf.yml`
- `.aiderignore`
- `.gitignore`
- `CHANGELOG.md`
- `GIT_UPLOAD_INFO.txt`
- `PROJECT_STATE_UNIFIED.md`
- `README.md`
- `database/` (obsahuje sample-projects)
- `docs/` (obsahuje audit, handoff, roadmap)
- `preview/` (obsahuje HTML preview soubory)
- `prompts/` (obsahuje textové prompty)
- `scripts/` (obsahuje dávkové soubory pro spouštění)
- `package.json` (předpoklad pro React/Tauri)
- `src/` (předpoklad pro React/Tauri)
- `src-tauri/` (předpoklad pro Tauri)

## 2. Dostupnost preview souborů

V složce `preview/` jsou momentálně dostupné následující HTML preview soubory:
- `preview/LOSKOT_FVE_LPS_STUDIO_PRO_v20_UNIFIED_APP_FOUNDATION.html`
- `preview/LOSKOT_FVE_LPS_STUDIO_PRO_v21_SHARED_PROJECT_MODEL.html`

## 3. Konstatování o preview složce

V preview složce jsou dostupné pouze verze v20 a v21. Verze v27 nebo jiné novější verze preview nejsou v této složce přítomny.

## 4. Existující části projektu

Projekt obsahuje následující části:
- `docs/`: Dokumentace projektu (audit, handoff, roadmap).
- `scripts/`: Pomocné skripty pro různé operace.
- `prompts/`: Textové soubory s instrukcemi pro Aider.
- `preview/`: HTML soubory pro vizuální náhledy aplikací.
- `database/`: Obsahuje vzorové projekty ve formátu JSON.
- `package.json`: Předpoklad pro správu závislostí v React/Tauri projektu.
- `src/`: Předpokládaný adresář pro zdrojový kód aplikace (React).
- `src-tauri/`: Předpokládaný adresář pro Tauri build.

## 5. Rizika pro pokračování v28

Pokračování do verze v28 nese několik rizik:
- Chybějící verzovací kontinuita (v27 není v repozitáři).
- Riziko ztráty nebo poškození kódu při neopatrných změnách.
- Riziko narušení stávajícího vzhledu a funkčnosti.

## 6. Riziko změny Classic PRO vzhledu

Jakékoli úpravy, které by změnily "Classic PRO tmavý vzhled", jsou vysoce rizikové a musí být přísně zamítnuty. Tento vzhled je klíčovým prvkem uživatelského rozhraní.

## 7. Riziko bílé obrazovky

Prevence "bílé obrazovky" je zásadní. Všechny změny musí brát v potaz existující ochranné mechanismy (globální zachytávání chyb, bezpečné vykreslování modulů) a nesmí je narušit.

## 8. Riziko chybějící v27 HTML

Verze v27 není v repozitáři přítomna. To znamená, že nelze přímo kopírovat HTML z v27 pro vytvoření v28 preview. Všechny plány musí toto zohlednit.

## 9. Doporučení pro bezpečné pokračování

Pro bezpečné pokračování do v28 se doporučuje následující postup:
- Prioritizovat zachování stávající funkčnosti a vzhledu.
- Pečlivě zvážit a zdokumentovat všechny navrhované změny.
- Použít navržené plány pro v28 (např. z `docs/roadmap/v28_SAFE_CONTINUATION_PLAN.md`).
- V případě potřeby obnovit chybějící části z archivních záloh (ZIP balíky).
- Vytvořit v28 preview buď z v21 (jako fallback), nebo až po manuálním schválení vzhledu.
- Vždy dodržovat přísná pravidla definovaná v `prompts/v28_REPO_AUDIT_AND_PREVIEW_RECOVERY_PLAN.txt`.
