# V54 – DOCUMENTS EXPORT QA

## Účel

Dokumentové definice, QA pravidla a exportní manifest.

## Přidané soubory

- `src/runtime/documentsExportQa.js`
- `tests/runtime/v54_documents_export_qa_smoke_test.js`
- `scripts/verify/verify_v54_documents_export_qa.sh`
- `docs/runtime/v54/v54_DOCUMENTS_EXPORT_QA.md`

## Bezpečnost

- Nemění `package.json`.
- Nemění `package-lock.json`.
- Nemění preview HTML.
- Nemění Classic PRO vzhled.
- Všechny chyby vrací jako structured errors.
- Chyba modulu nesmí způsobit bílou obrazovku.

## Další krok

Pokračovat až po úspěšném výsledku tohoto balíku a po kontrole `===== LOSKOT RESULT =====`.
