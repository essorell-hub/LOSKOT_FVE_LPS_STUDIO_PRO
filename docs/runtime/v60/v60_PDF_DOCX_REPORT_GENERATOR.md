# V60 – PDF DOCX REPORT GENERATOR

## Účel

Plánování PDF/DOCX reportů, report context, DOCX/PDF jobs a readiness checks.

## Přidané soubory

- `src/runtime/pdfDocxReportGenerator.js`
- `tests/runtime/v60_pdf_docx_report_generator_smoke_test.js`
- `scripts/verify/verify_v60_pdf_docx_report_generator.sh`
- `docs/runtime/v60/v60_PDF_DOCX_REPORT_GENERATOR.md`

## Bezpečnost

- Nemění `package.json`.
- Nemění `package-lock.json`.
- Nemění preview HTML.
- Nemění Classic PRO vzhled.
- Vrací structured errors.
- Chyba modulu nesmí způsobit bílou obrazovku.

## Spuštění

Pouze přes SAFE RUN script a až po úspěšné předchozí verzi.
