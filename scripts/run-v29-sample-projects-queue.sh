#!/usr/bin/env bash
set -e

cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

echo "=== LOSKOT v29 sample projects queue ==="
echo "Kontrola čistého Gitu..."
if [ -n "$(git status --short)" ]; then
  echo "STOP: Git není čistý. Nejdřív ukliď změny."
  git status
  exit 1
fi

mkdir -p database/sample-projects/v29 docs/database/v29 docs/qa/v29 prompts

run_task () {
  local task_name="$1"
  local prompt_file="$2"
  shift 2

  echo ""
  echo "============================================================"
  echo "START: $task_name"
  echo "============================================================"

  aider --yes-always --config .aider.conf.yml "$@" "$prompt_file" --message-file "$prompt_file"

  echo "Kontrola Gitu po úkolu: $task_name"
  git status --short

  if [ -n "$(git status --short)" ]; then
    echo "Aider nechal změny bez commitu, ukládám ručně..."
    git add "$@"
    git commit -m "$task_name" || true
  fi

  git push

  echo "HOTOVO: $task_name"
}

echo "=== ÚKOL 1: minimal sample project ==="
cat > prompts/v29_SAMPLE_MINIMAL_PROJECT_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON soubor:
database/sample-projects/v29/v29_minimal_project.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Data musí být fiktivní.
- Nepoužívej osobní údaje skutečných osob.
- Výstup drž přiměřeně krátký.

Projekt musí obsahovat:
- projectId
- dataModelVersion: "v29"
- appVersion
- createdAt
- updatedAt
- projectInfo
- building
- roofs
- fve
- lps
- cad
- documents
- exports
- qa
- migrationHistory

Minimal project:
- jedna fiktivní stavba,
- jedna jednoduchá sedlová nebo plochá střecha,
- FVE modul prázdný, ale strukturálně připravený,
- LPS modul prázdný, ale strukturálně připravený,
- CAD vrstvy prázdné nebo základní,
- QA status pending.

Po dokončení vytvoř commit:
v29 sample minimal project
PROMPT

git add prompts/v29_SAMPLE_MINIMAL_PROJECT_TASK.txt
git commit -m "Add v29 minimal sample project prompt" || true

run_task "v29 sample minimal project" prompts/v29_SAMPLE_MINIMAL_PROJECT_TASK.txt \
  database/sample-projects/v29/v29_minimal_project.json


echo "=== ÚKOL 2: full FVE LPS sample project ==="
cat > prompts/v29_SAMPLE_FULL_FVE_LPS_PROJECT_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON soubor:
database/sample-projects/v29/v29_full_fve_lps_project.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Data musí být realistická, ale fiktivní.
- Nepoužívej osobní údaje skutečných osob.
- Výstup drž přiměřeně krátký.

Projekt musí obsahovat:
- projectId
- dataModelVersion: "v29"
- appVersion
- projectInfo
- building
- roofs
- fve
- lps
- cad
- documents
- exports
- qa
- migrationHistory

FVE část:
- minimálně 12 panelů,
- 2 stringy,
- 1 střídač,
- DC trasy,
- AC trasa,
- SPD DC,
- SPD AC,
- datasheet reference,
- základní výpočtové hodnoty.

LPS část:
- lpsClass,
- riskAssessment,
- airTerminals,
- downConductors,
- hvi,
- earthing,
- spd,
- lpz,
- normativeChecks.

CAD část:
- vrstvy pro střechu, panely, LPS, DC trasy, poznámky,
- objekty navázané na entity.

QA část:
- několik OK kontrol,
- několik warning kontrol,
- celkový stav warning.

Po dokončení vytvoř commit:
v29 sample full fve lps project
PROMPT

git add prompts/v29_SAMPLE_FULL_FVE_LPS_PROJECT_TASK.txt
git commit -m "Add v29 full fve lps sample project prompt" || true

run_task "v29 sample full fve lps project" prompts/v29_SAMPLE_FULL_FVE_LPS_PROJECT_TASK.txt \
  database/sample-projects/v29/v29_full_fve_lps_project.json


echo "=== ÚKOL 3: roof geometry sample project ==="
cat > prompts/v29_SAMPLE_ROOF_GEOMETRY_PROJECT_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON soubor:
database/sample-projects/v29/v29_roof_geometry_project.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Data musí být fiktivní.
- Výstup drž přiměřeně krátký.

Projekt má být zaměřený na geometrii:
- budova s jasnou geometrií,
- minimálně 2 střešní roviny,
- polygon bodů pro každou rovinu,
- hřeben,
- okapy,
- překážka na střeše,
- safety zone,
- CAD vrstvy,
- CAD objekty,
- několik FVE panelů umístěných na roofPlane,
- několik LPS prvků navázaných na roofPlane.

FVE a LPS nemusejí být úplně plné, ale musí ukázat vazbu na geometrii.

Po dokončení vytvoř commit:
v29 sample roof geometry project
PROMPT

git add prompts/v29_SAMPLE_ROOF_GEOMETRY_PROJECT_TASK.txt
git commit -m "Add v29 roof geometry sample project prompt" || true

run_task "v29 sample roof geometry project" prompts/v29_SAMPLE_ROOF_GEOMETRY_PROJECT_TASK.txt \
  database/sample-projects/v29/v29_roof_geometry_project.json


echo "=== ÚKOL 4: QA warning sample project ==="
cat > prompts/v29_SAMPLE_QA_WARNING_PROJECT_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden JSON soubor:
database/sample-projects/v29/v29_qa_warning_project.json

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- JSON musí být validní.
- Data musí být fiktivní.
- Výstup drž přiměřeně krátký.

Projekt má být validní JSON, ale záměrně má obsahovat QA varování:
- chybějící datasheet panelu,
- neuzavřená kontrola SPD,
- string s upozorněním na kontrolu napětí,
- LPS riskAssessment ve stavu review,
- CAD objekt bez finálního ověření,
- export package ve stavu draft,
- QA status warning.

Důležité:
- nesmí to být rozbitý JSON,
- cílem je testovat QA semafor,
- chyby popiš v qa.warnings nebo qa.checks.

Po dokončení vytvoř commit:
v29 sample qa warning project
PROMPT

git add prompts/v29_SAMPLE_QA_WARNING_PROJECT_TASK.txt
git commit -m "Add v29 qa warning sample project prompt" || true

run_task "v29 sample qa warning project" prompts/v29_SAMPLE_QA_WARNING_PROJECT_TASK.txt \
  database/sample-projects/v29/v29_qa_warning_project.json


echo "=== ÚKOL 5: sample projects guide ==="
cat > prompts/v29_SAMPLE_PROJECTS_GUIDE_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/database/v29/v29_SAMPLE_PROJECTS_GUIDE.md

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Piš česky, technicky a prakticky.
- Výstup max 160 řádků.

Dokument musí popsat:
1. Účel sample projektů.
2. v29_minimal_project.json.
3. v29_full_fve_lps_project.json.
4. v29_roof_geometry_project.json.
5. v29_qa_warning_project.json.
6. Jak sample projekty použít pro import.
7. Jak sample projekty použít pro export.
8. Jak sample projekty použít pro SQLite.
9. Jak sample projekty použít pro QA semafor.
10. Jak sample projekty použít pro test CAD/mapa.
11. Očekávané výsledky.
12. Rizika a omezení.
13. Doporučení pro další vývoj.

Po dokončení vytvoř commit:
v29 sample projects guide
PROMPT

git add prompts/v29_SAMPLE_PROJECTS_GUIDE_TASK.txt
git commit -m "Add v29 sample projects guide prompt" || true

run_task "v29 sample projects guide" prompts/v29_SAMPLE_PROJECTS_GUIDE_TASK.txt \
  docs/database/v29/v29_SAMPLE_PROJECTS_GUIDE.md


echo "=== ÚKOL 6: sample projects QA checklist ==="
cat > prompts/v29_SAMPLE_PROJECTS_QA_CHECKLIST_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/qa/v29/v29_SAMPLE_PROJECTS_QA_CHECKLIST.md

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Piš česky, technicky a prakticky.
- Výstup max 160 řádků.

Dokument musí obsahovat:
1. Kontrola existence všech sample projektů.
2. Kontrola validity JSON.
3. Kontrola dataModelVersion.
4. Kontrola projectInfo.
5. Kontrola building.
6. Kontrola roofs.
7. Kontrola FVE.
8. Kontrola LPS.
9. Kontrola CAD.
10. Kontrola documents.
11. Kontrola exports.
12. Kontrola qa.
13. Kontrola referencí mezi entitami.
14. Kontrola warning projektu.
15. Kontrola importu.
16. Kontrola exportu.
17. Kontrola SQLite mapování.
18. Tabulka: test / očekávaný výsledek / výsledek / stav.

Po dokončení vytvoř commit:
v29 sample projects qa checklist
PROMPT

git add prompts/v29_SAMPLE_PROJECTS_QA_CHECKLIST_TASK.txt
git commit -m "Add v29 sample projects qa checklist prompt" || true

run_task "v29 sample projects qa checklist" prompts/v29_SAMPLE_PROJECTS_QA_CHECKLIST_TASK.txt \
  docs/qa/v29/v29_SAMPLE_PROJECTS_QA_CHECKLIST.md


echo ""
echo "=== HOTOVO: v29 sample projects queue ==="
git status
git log --oneline -20
echo ""
echo "Sample projekty:"
ls database/sample-projects/v29
