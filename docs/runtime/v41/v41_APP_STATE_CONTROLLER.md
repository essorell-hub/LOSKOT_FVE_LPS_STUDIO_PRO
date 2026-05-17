# v41 App State Controller

App State Controller sjednocuje stav aplikace nad v40 Runtime Bridge.

Nevytváří nové UI a nemění Classic PRO vzhled.

Hlavní odpovědi zůstávají ve formátu:

{ ok, data, warnings, errors }

Řídí:
- aktivní obrazovku,
- zvolený modul,
- projektová data,
- výběry CAD/FVE/LPS objektů,
- stav UI bez změny schváleného vzhledu.

Soubory:
- src/runtime/appStateController.js
- tests/runtime/v41_app_state_controller_smoke_test.js
- scripts/verify/verify_v41_app_state_controller.sh
