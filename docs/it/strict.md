# Modalità Strict

Per Abilitare la modalità strict basta passare `strict: true` quando si crea uno Store in Vuex:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

Quando si è in modalità strict, ogni volta che Vuex viene mutato al di fuori delle mutation un errore viene lanciato. Questa logica assicura che tutti gli stati siano tracciabili dal sistema di debug.

### Sviluppo vs Produzione

**Non abilutate la modalità strict quando pubblicate il progetto in produzione** La modalità strict esegue una scansione approfondita di ogni mutation per capire i cambiamenti effettuati sugli stati dello store - in produzione questo portrebbe a dei problemi di prestazioni.

Come sui middleware anche qui possiamo automatizzare il processo di abilitazione/disabilitazione tramite gli strumenti di build:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
