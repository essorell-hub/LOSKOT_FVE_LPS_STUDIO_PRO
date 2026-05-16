# v28 SAFE CONTINUATION PLAN

## 1. Bezpečný plán pokračování do v28

Tento plán popisuje bezpečný postup pro přechod na verzi v28 projektu LOSKOT FVE & LPS STUDIO PRO s ohledem na existující omezení a rizika.

## 2. Varianta A: Obnovení nebo doplnění v27 preview ze ZIP balíku

Pokud existuje archivní ZIP balík s verzí v27, nejbezpečnější cestou je:
1. Obnovit obsah v27 z tohoto ZIP balíku do repozitáře.
2. Použít tyto obnovené soubory jako základ pro v28.
3. Postupovat podle instrukcí pro migraci z v27 na v28.

## 3. Varianta B: Vytvoření v28 z posledního dostupného v21 preview (Fallback)

Pokud není možné obnovit v27, je možné použít poslední dostupnou verzi (v21) jako fallback:
1. Zkopírovat soubory z `preview/LOSKOT_FVE_LPS_STUDIO_PRO_v21_SHARED_PROJECT_MODEL.html`.
2. Označit tento zdroj jako fallback verzi pro v28.
3. Vytvořit a upravit tento soubor pro v28 s jasným označením, že se jedná o fallback.
4. Všechny další kroky pro v28 budou vycházet z této v21 verze, s vědomím potenciálních omezení.

## 4. Varianta C: Vytvoření nového v28 preview po ručním schválení vzhledu

Tato varianta je nejbezpečnější z hlediska vzhledu, ale může být časově náročnější:
1. Po důkladném auditu a schválení stávajícího vzhledu (Classic PRO) provést změny pro v28.
2. Nové v28 preview vytvořit až poté, co je vzhled ručně potvrzen.
3. Tento postup vyžaduje úzkou spolupráci s designérem nebo zodpovědnou osobou.

## 5. Přesný postup pro neprogramátora

1. **Seznamte se s auditem:** Přečtěte si dokument `docs/audit/v28_REPO_AUDIT.md`, abyste pochopili stav repozitáře a rizika.
2. **Vyberte variantu:** Rozhodněte se pro jednu z variant A, B nebo C. Pokud máte zálohu v27 (Varianta A), je to nejlepší volba. Pokud ne, zvažte Variantu C, pokud je možné ruční schválení vzhledu, jinak použijte Variantu B.
3. **Postupujte podle zvolené varianty:**
    - **Varianta A:** Pokud máte ZIP s v27, extrahujte ho do projektu a pokračujte s ním.
    - **Varianta B:** Zkopírujte `preview/LOSKOT_FVE_LPS_STUDIO_PRO_v21_SHARED_PROJECT_MODEL.html` a přejmenujte ho na `preview/LOSKOT_FVE_LPS_STUDIO_PRO_v28_FALLBACK.html`. Otevřete ho a vizuálně ověřte, že se podobá původnímu vzhledu.
    - **Varianta C:** Počkejte na pokyny pro ruční schválení vzhledu.
4. **Použijte skripty:** Pro otevírání preview souborů použijte `scripts/open-v28-html-preview.bat`.
5. **Dodržujte pravidla:** Nikdy neměňte CSS, HTML preview soubory (kromě případu vytvoření v28 fallback), ani `PROJECT_STATE_UNIFIED.md`, `CHANGELOG.md`.

## 6. Git kroky

1. **Ujistěte se, že jste na správné větvi:** `git checkout main` (nebo odpovídající vývojová větev).
2. **Stáhněte nejnovější změny:** `git pull origin main`
3. **Proveďte změny podle zvolené varianty (A, B, nebo C).**
4. **Přidejte nové nebo upravené soubory:** `git add .`
5. **Vytvořte commit:** `git commit -m "v28 repo audit and safe continuation plan"`
6. **Nahrajte změny:** `git push origin main` (nebo odpovídající vývojová větev)

## 7. Kontrolní checklist před commitem

- [ ] Byl proveden důkladný audit repozitáře?
- [ ] Byl zvolen bezpečný plán pokračování (A, B, nebo C)?
- [ ] Jsou všechny změny v souladu s pravidly (žádné úpravy CSS, HTML preview, PROJECT_STATE_UNIFIED.md, CHANGELOG.md)?
- [ ] Jsou všechny navržené soubory vytvořeny nebo aktualizovány?
- [ ] Byl vytvořen srozumitelný commit message?
- [ ] Jsou všechny změny přidány do gitu?
- [ ] Byl proveden `git push`?

## 8. Co se nesmí měnit

- Žádné HTML preview soubory (kromě explicitního vytvoření v28 fallback).
- Žádné CSS soubory.
- `PROJECT_STATE_UNIFIED.md`
- `CHANGELOG.md`
- Žádné soubory nesmí být smazány.
- Klasický PRO vzhled nesmí být přepsán.
- Aplikace nesmí být v této fázi nijak zásadně upravována.

## 9. Doporučené další úkoly pro Aider po malých částech

Po dokončení auditu a plánu pokračování, Aider může postupně řešit tyto úkoly:
- Vytvoření nebo aktualizace dalších dokumentů v `docs/`.
- Příprava skriptů pro automatizaci procesů souvisejících s v28.
- Pomoc s obnovením chybějících dat (pokud je to možné).
- Postupné převádění funkcionality do React/Tauri (po schválení architektury).
