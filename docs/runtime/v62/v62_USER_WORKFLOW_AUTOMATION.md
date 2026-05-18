# V62 – USER WORKFLOW AUTOMATION

## Účel

Uživatelský workflow engine, progress projektu, další doporučená akce a checklist operátora.

## Přidané soubory

- `src/runtime/userWorkflowAutomation.js`
- `tests/runtime/v62_user_workflow_automation_smoke_test.js`
- `scripts/verify/verify_v62_user_workflow_automation.sh`
- `docs/runtime/v62/v62_USER_WORKFLOW_AUTOMATION.md`

## Bezpečnost

- Nemění `package.json`.
- Nemění `package-lock.json`.
- Nemění preview HTML.
- Nemění Classic PRO vzhled.
- Vrací structured errors.
- Chyba modulu nesmí způsobit bílou obrazovku.
