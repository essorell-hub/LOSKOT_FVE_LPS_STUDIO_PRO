# v39 STRICT TEST GATE

Cíl:
- odstranit falešně zelené testy,
- zachytit chyby i v textovém výstupu,
- necommitovat, pokud log obsahuje reálné chyby.

Pravidla:
1. Exit code 0 nestačí.
2. Log nesmí obsahovat:
   - test failed
   - FAILED
   - TypeError
   - ReferenceError
   - SyntaxError
   - Cannot read properties
   - is not a function
   - is not defined
   - Unsupported geometryType
3. Každý větší vývojový blok musí projít:
   - node --check,
   - smoke testy,
   - strict scan,
   - git diff --check,
   - commit + push pouze při čistém výsledku.

Toto je hlavní bezpečnostní brána pro další dlouhé vývojové úkoly.
