# v43 Safe Runtime Bootstrap

v43 přidává bezpečnou bootstrap vrstvu runtime části aplikace.

Zásady této verze:
- nemění Classic PRO vzhled,
- nemění preview HTML,
- nemění package.json,
- navazuje na v42 Classic UI Runtime Adapter,
- vrací jednotný runtime výsledek ve formátu ok, data, warnings, errors,
- chyba bootstrapu se převádí na strukturovaný výsledek a nesmí způsobit bílou obrazovku.
