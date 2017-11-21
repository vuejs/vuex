# Mutations

Die einzige Möglichkeit den State zu ändern besteht in Mutation-Comitting. Vuex-Mutations ähneln Events: Jede Mutation hat einen **String-Typ** und einen **Handler**.
Die Handler-Funktion führt die tatsächliche State-Modifikation aus und erhält den State als erstes Argument:

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // ändere State
      state.count++
    }
  }
})
```

Man kann den Mutation-Handler nicht direkt aufrufen. Die Optionen hier stehen mehr für Event-Registrierung: "Wenn eine Mutation mit dem Typ `increment` aufgelöst wird, rufe den Handler auf." Um den Mutation-Handler zu aktivieren, muss `store.commit` mit dessen Typen aufgerufen werden:

``` js
store.commit('increment')
```

### Commit mit Payload

Ein zusätzliches Argument ist in `store.commit` möglich, welches das **Payload** (Ladung) für die Mutation genannt wird.

``` js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```
``` js
store.commit('increment', 10)
```

In den meisten Fällen sollte das Payload ein Objekt sein, damit es mehrere Felder beinhalten kann und die aufgezeichneten Mutation besser beschrieben sind:

``` js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```
``` js
store.commit('increment', {
  amount: 10
})
```

### Commit im Objektstil

Alternativ ist es möglich eine Mutation direkt durch ein Objekt mit `type`-Eigenschaft zu committen:

``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

Wenn Commits im Objektstil genutzt werden, wird das gesamte Objekt als Payload an den Mutation-Handler weitergegeben. Der Handler bleibt gleich:

``` js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### Stiller Commit

> Merke: Dieses Feature wird wahrscheinlich veralten, sobald Mutation-Filterung in den DevTools möglich ist.

Standardmäßig wird jede committed Mutation an Plugins gesendet (zB. DevTools). Wiederum möchte man in gewissen Szenarios nicht, dass Plugins jede State-Änderung aufzeichnen. Mehrere Commits oder Abfragen im Store in kurzer Zeit müssen nicht immer verfolgt werden. In diesem Fall kann ein drittes Argument an `store.commit` angehängt werden, um diese spezielle Mutation von Plugins stillzulegen.

``` js
store.commit('increment', {
  amount: 1
}, { silent: true })

// mit Commit im Objektstil
store.commit({
  type: 'increment',
  amount: 1
}, { silent: true })
```


### Mutations folgen Vues Reaktivitätsregeln

Da Vuex Store-State reaktiv dank Vue ist, wenn ein State sich ändert, werden Vue-Komponenten automatisch aktualisiert, sofern der State dort überwacht wird. Dies bedeutet auch, dass Vuex-Mutations die gleichen Reaktivitätshindernisse haben:

1. Bevorzugt werden im Store die gewünschten Felder vor der Initialisierung definiert.

2. Wenn neue Eigenschaften einem Objekt hinzugefügt werden, sollte man entweder

  - `Vue.set(obj, 'newProp', 123)` nutzen oder

  - das Objekt mit einem neuen ersetzen. Zum Beispiel kann man es mit der [Object Spread Syntax](https://github.com/sebmarkbage/ecmascript-rest-spread) so schreiben:

    ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### Nutzen von Konstanten für Mutation-Typen

Es ist ein oft gesehenes Muster in Flux-Implementationen Konstanten für Mutation-Typen zu schreiben. Das erlaubt den Code, die Vorteile von Lintern zu nutzen und Projektmitarbeiter haben direkt im Blick, welche Mutations in der gesamten App möglich sind:

``` js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

``` js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // ES2015 Computed Propteries können genutzt werden,
    // um Konstanten als Funktionsnamen zu verwenden.
    [SOME_MUTATION] (state) {
      // verändere State
    }
  }
})
```

Die Nutzung von Konstanten ist hauptsächlich Geschmackssache. Es kann hilfreich sein in großen Projekten mit vielen Mitarbeitern, bleibt aber dennoch optional.


### Mutations müssen synchron sein

Eine wichtige Regel gilt es sich zu merken: **Mutation-Handler-Funktionen müssen synchron sein.**
Siehe dazu folgendes Beispiel:

``` js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Nun stelle man sich vor, man debuggt die App and schaut den DevTools Mutation-Log an. Für jede protokollierte Mutation muss das DevTool einen Vorher- und Nacher-Schnappschuss des States einfangen.

Allerdings macht der asynchrone Callback innerhalb des Mutation-Beispiels dies unmmöglich:
Der Callback wird noch nicht aufgerufen, wenn die Mutation committed wird und es gibt keine Möglichkeit für die DevTools herauszufinden, wenn das tatsächlich passiert. Jede State-Mutation im Callback ist daher nicht verfolgbar.

### Mutation-Committing in Komponenten

Man kann Mutations in Komponenten mit `this.$store.commit(xxx)` committen oder die `mapMutations`-Helfer nutzen, welche die Methoden der Komponenten mit `store.commit`-Aufrufe verbinden (benötigt Root-Injektion von `store`):


``` js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment' // Verbinde 'this.increment()' mit 'this.$store.commit('increment')'.
    ]),
    ...mapMutations({
      add: 'increment' // Verbinde 'this.add()' mit 'this.$store.commit('increment')'.
    })
  }
}
```

### Zu den Actions

Die Asynchronität kombiniert mit State-Mutation kann die App schwer verständlich aussehen lassen. Wenn man zum Beispiel zwei Methoden aufruft - beide mit asynchronen Callbacks, die den State verändern - wie erfährt man, wann sie aufgerufen wurden und in welcher Reihenfolge die Callbacks ablaufen?

Das ist genau der Grund, weshalb diese zwei Konzepte aufgeteilt werden. In Vuex sind Mutations synchrone Transaktionen:

``` js
store.commit('increment')
// Jede State-Änderung, welche die 'increment'-Mutation
// hervorrufen könnte, sollte hier beendet sein.
```

Um etwas asynchron zu bearbeiten, siehe [Actions](actions.md).
