# FVE - Poznámky k editoru panelů (v31)

## Projekt: LOSKOT FVE & LPS STUDIO PRO

## Verze: v31 - Integrace databáze a pokročilých modulů

## Datum: 2026-05-16

## Současný stav

Editor FVE panelů je v této verzi základním stavebním kamenem pro správu fotovoltaických panelů v rámci projektu. Jeho hlavním cílem je umožnit uživateli definovat a spravovat jednotlivé panely, které budou součástí FVE systému.

### Funkční části

*   **Definice panelu**: Možnost zadat základní parametry panelu, jako je výrobce, model, výkon (Wp), napětí (Voc, Vmp), proud (Isc, Imp) a rozměry.
*   **Výběr z databáze (placeholder)**: Předpokládá se budoucí integrace s rozsáhlou databází panelů, která umožní snadný výběr a automatické načtení parametrů. V současné verzi je tato databáze pouze ve formě placeholderu, kde uživatel zadává parametry ručně.
*   **Přiřazení k projektu**: Možnost přiřadit vybrané panely k aktuálně spravovanému projektu.
*   **Základní validace**: Kontrola vyplnění povinných polí (např. výkon panelu).

### Placeholdery a budoucí vývoj

*   **Rozsáhlá databáze panelů**: Plná integrace s externí nebo interní databází pro automatický výběr panelů.
*   **Pokročilé parametry**: Zahrnutí dalších parametrů jako teplotní koeficienty, účinnost, Tolerance, NOCT atd.
*   **Grafické znázornění**: Možnost vizuálního zobrazení panelu (náhled) a jeho rozložení na střeše.
*   **Editace rozložení**: Nástroje pro intuitivní rozmístění panelů na střeše (napojení na CAD modul).
*   **Stringing logiky**: Automatické nebo manuální seskupování panelů do stringů s kontrolou limitů napětí a proudu.
*   **Integrace s měniči**: Propojení s modulem pro výběr a konfiguraci měničů.

## Rizika

*   **Neúplná databáze**: Bez rozsáhlé databáze panelů bude ruční zadávání parametrů náchylné k chybám a časově náročné.
*   **Správa verzí panelů**: Zajištění správné verze parametrů panelu, pokud výrobci mění specifikace.
*   **Výkon při velkém počtu panelů**: Efektivní správa a vykreslování velkého množství panelů v rámci projektu.

## Další kroky

1.  Implementovat propojení s databází panelů.
2.  Přidat možnost editace rozložení panelů v rámci CAD modulu.
3.  Vyvinout logiku pro automatické seskupování panelů do stringů.
4.  Zahrnout pokročilé parametry panelů a jejich vliv na výpočty.
