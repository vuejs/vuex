# Strict Mode

Um Stric Mode zu aktivieren, setze `strict: true`, wenn der Vuex-Store erstellt wird:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

In Strict Mode wird ein Fehler ausgeworfen, wenn Vuex-State außerhalb der Mutation-Handler verändert wird. Das versichert, dass State-Änderungen explizit mit dem Debugging-Tool nachvollzogen werden können.

### Development vs. Production

**Aktiviere Strict Mode nicht im Produktionsschritt!** Strict Mode überwacht State-Änderungen tief im State-Baum, was Performance-Einbuße bedeuten kann.

Ähnlich den Plugins kann man das Build-Tools regeln lassen:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
