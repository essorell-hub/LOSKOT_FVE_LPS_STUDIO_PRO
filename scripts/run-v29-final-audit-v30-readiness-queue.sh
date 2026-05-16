#!/usr/bin/env bash
set -e

cd /d/Projekty/LOSKOT_FVE_LPS_STUDIO_PRO

echo "=== LOSKOT v29 final audit + v30 readiness queue ==="

if [ -n "$(git status --short)" ]; then
  echo "STOP: Git není čistý."
  git status
  exit 1
fi

mkdir -p docs/audit/v29 docs/roadmap docs/data-layer/v30 prompts

run_task () {
  local task_name="$1"
  local prompt_file="$2"
  shift 2

  echo ""
  echo "============================================================"
  echo "START: $task_name"
  echo "============================================================"

  aider --yes-always --config .aider.conf.yml "$@" "$prompt_file" --message-file "$prompt_file"

  if [ -n "$(git status --short)" ]; then
    echo "Aider nechal změny bez commitu, ukládám ručně..."
    git add "$@" "$prompt_file"
    git commit -m "$task_name" || true
  fi

  git push
  echo "HOTOVO: $task_name"
}

cat > prompts/v29_FINAL_DATA_FOUNDATION_AUDIT_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/audit/v29/v29_FINAL_DATA_FOUNDATION_AUDIT.md

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Piš česky, technicky a prakticky.
- Výstup max 220 řádků.

Zkontroluj a popiš stav těchto oblastí:
1. Datový model v29.
2. JSON schémata.
3. Sample projekty.
4. SQLite návrh.
5. Import/export kontrakty.
6. Validační pravidla.
7. QA pravidla.
8. Dokumentace.
9. Připravenost pro v30.
10. Rizika před implementací.
11. Co se nesmí při v30 rozbít.
12. Doporučený postup v30.

Po dokončení vytvoř commit:
v29 final data foundation audit
PROMPT

git add prompts/v29_FINAL_DATA_FOUNDATION_AUDIT_TASK.txt
git commit -m "Add v29 final data foundation audit prompt" || true

run_task "v29 final data foundation audit" prompts/v29_FINAL_DATA_FOUNDATION_AUDIT_TASK.txt \
  docs/audit/v29/v29_FINAL_DATA_FOUNDATION_AUDIT.md


cat > prompts/v29_SCHEMA_AUDIT_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/audit/v29/v29_SCHEMA_AUDIT.md

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Piš česky, technicky a prakticky.
- Výstup max 220 řádků.

Proveď audit existujících schémat:
- shared-definitions.schema.json
- project.schema.json
- building.schema.json
- roof.schema.json
- fve.schema.json
- lps.schema.json
- cad.schema.json
- documents.schema.json
- exports.schema.json
- qa.schema.json

Popiš:
1. Účel každého schématu.
2. Hlavní entity.
3. Vazby mezi schématy.
4. Chybějící nebo rizikové oblasti.
5. Doporučené opravy před implementací.
6. Co nechat až do v30.
7. Checklist validace.

Po dokončení vytvoř commit:
v29 schema audit
PROMPT

git add prompts/v29_SCHEMA_AUDIT_TASK.txt
git commit -m "Add v29 schema audit prompt" || true

run_task "v29 schema audit" prompts/v29_SCHEMA_AUDIT_TASK.txt \
  docs/audit/v29/v29_SCHEMA_AUDIT.md


cat > prompts/v30_DATA_LAYER_START_PLAN_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden Markdown dokument:
docs/data-layer/v30/v30_DATA_LAYER_START_PLAN.md

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Piš česky, technicky a prakticky.
- Výstup max 220 řádků.

Dokument musí být praktický plán pro první implementaci v30.

Obsah:
1. Cíl v30 data layer.
2. Co už poskytuje v29.
3. Povolené složky pro v30.
4. Zakázané zásahy pro v30.
5. Struktura src/data.
6. Struktura src/validation.
7. Struktura src/importExport.
8. Jak načíst sample project.
9. Jak validovat projekt.
10. Jak vracet QA status.
11. Jak zachovat JSON fallback.
12. Jak později napojit SQLite.
13. Jak později napojit UI.
14. Ochrana proti bílé obrazovce.
15. Testovací postup.
16. Doporučené první commity.

Po dokončení vytvoř commit:
v30 data layer start plan
PROMPT

git add prompts/v30_DATA_LAYER_START_PLAN_TASK.txt
git commit -m "Add v30 data layer start plan prompt" || true

run_task "v30 data layer start plan" prompts/v30_DATA_LAYER_START_PLAN_TASK.txt \
  docs/data-layer/v30/v30_DATA_LAYER_START_PLAN.md


cat > prompts/v30_FIRST_IMPLEMENTATION_QUEUE_PROMPT_TASK.txt <<'PROMPT'
Pracuješ na projektu LOSKOT FVE & LPS STUDIO PRO.

Úkol:
Vytvoř pouze jeden textový prompt pro další běh:
prompts/v30_FIRST_DATA_LAYER_IMPLEMENTATION_QUEUE.txt

Přísná pravidla:
- Neupravuj HTML.
- Neupravuj CSS.
- Neupravuj preview.
- Neupravuj JS/React.
- Neupravuj PROJECT_STATE_UNIFIED.md.
- Neupravuj CHANGELOG.md.
- Nemaž žádné soubory.
- Piš česky, technicky a prakticky.

Prompt musí připravit budoucí v30 implementační frontu, ale zatím ji nespouštět.

Budoucí fronta má obsahovat:
1. src/data/projectModel.js nebo .ts podle aktuální struktury.
2. src/data/loadSampleProject.
3. src/validation/basicProjectValidation.
4. src/validation/referenceValidation.
5. src/importExport/jsonImportPreview.
6. src/importExport/jsonExportProject.
7. tests/data/basic validation smoke test.
8. Dokumentaci k použití.

Prompt musí přísně zakázat:
- změnu UI,
- změnu HTML preview,
- změnu CSS,
- změnu přepínání obrazovek,
- zásah do Classic PRO vzhledu.

Po dokončení vytvoř commit:
v30 first implementation queue prompt
PROMPT

git add prompts/v30_FIRST_IMPLEMENTATION_QUEUE_PROMPT_TASK.txt
git commit -m "Add v30 first implementation queue prompt task" || true

run_task "v30 first implementation queue prompt" prompts/v30_FIRST_IMPLEMENTATION_QUEUE_PROMPT_TASK.txt \
  prompts/v30_FIRST_DATA_LAYER_IMPLEMENTATION_QUEUE.txt


echo ""
echo "=== HOTOVO: v29 final audit + v30 readiness queue ==="
git status
git log --oneline -20

echo ""
echo "Audit v29:"
ls docs/audit/v29 || true

echo ""
echo "Data layer v30:"
ls docs/data-layer/v30 || true

echo ""
echo "Prompty v30:"
ls prompts | grep v30 || true
