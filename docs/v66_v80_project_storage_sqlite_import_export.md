# LOSKOT V66 / V76–V80 Project Storage + SQLite + Import/Export Core

Tento MEGA PACK B připravuje základ pro:

- V66 Real Project Save / Load,
- V76–V80 SQLite foundation,
- JSON import/export,
- projektovou migraci,
- exportní manifest,
- katalog prvků jako SQL seed,
- demo SQLite databázi.

## Bezpečnost

Balík nesmí měnit:

- package.json,
- package-lock.json,
- preview HTML,
- Classic PRO UI,
- existující runtime API mimo nový namespace `src/runtime/v66v80`.

## Budoucí napojení

Tento balík je datová páteř. Po integraci umožní:

- normalizovat projektový JSON,
- migrovat staré/minimální projekty,
- připravit exportní balíček,
- importovat projekt z exportního balíčku,
- položit základ pro SQLite tabulky.
