# Struktur einer App

Vuex schränkt die Wahl der Code-Struktur nicht ein. Es setzt eher hochwertige Prinzipien durch:

1. App-Level-State ist zentralisiert im Store.

2. Die einzige Möglichkeit den State zu verändern ist durch **Mutations-Commiting**, welche synchrone Transaktionen sind.

3. Asynchrone Logik sollte in Actions eingekapselt und kann mit Actions zusammengesetzt werden.

Solange diese Schritte beachtet werden, ist es die eigene Entscheidung wie man das Projekt strukturiert. Sollte die Store-Datei zu groß werden, beginne diese aufzuteilen in Actions-, Mutations- und Getters-Dateien.

Für jede nicht-triviale App sollten Module in Anbetracht gezogen werden. Hier ist ein Beispiel einer Projektstruktur:

``` bash
├── index.html
├── main.js
├── api
│   └── ... # Abstraktionen für Tätigen von API-Anfragen
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js  # wo Module zusammengesetzt werden und Store exportieren
    ├── actions.js      # Root-Actions
    ├── mutations.js    # Root-Mutations
    └── modules
        ├── cart.js     # Modul des Einkaufswagens
        └── products.js # Modul der Produkte
```

Als Referenz siehe das [Shopping Card-Beispiel](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart).
