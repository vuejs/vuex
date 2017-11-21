# Actions

Actions ähneln Mutations. Die Unterschiede sind:

- Actions committen Mutations, anstelle den State zu ändern.
- Actions können beliebige asynchrone Operationen enthalten.

Die Registrierung einer einfachen Action:

``` js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

Action-Handler erhalten ein Kontextobjekt, welche die gleichen Sets von Methoden/Eigenschaften wie in der Store-Instanz freigeben. Sodass durch Aufrufen von `context.commit` eine Mutation committed werden kann oder auf den State und die Getters via `context.state` und `context.getters` zugegriffen werden können. Wir werden sehen, wieso das Kontextobjekt nicht die Store-Instanz selbst ist, wenn wir zu [Modulen](modules.md) kommen.

In der Praxis nutzen wir oft ES2015 [Destruktion von Argumenten](https://github.com/lukehoban/es6features#destructuring), um den Code etwas zu vereinfachen (vor allem, wenn das mehrmalige Aufrufen von `commit` nötig ist).

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### Dispatching Actions

Actions werden mit der `store.dispatch`-Methode ausgelöst:

``` js
store.dispatch('increment')
```

Dies könnte auf den ersten Blick komisch aussehen:
Wenn wir den Zahl erhöhen wollen, wieso rufen wir `store.commit('increment')` nicht direkt auf? **Der Grund: Mutations müssen synchron ablaufen - Actions nicht.** Wir können **asynchrone** Operationen innerhalb von Actions ausführen:

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Actions unterstützen das selbe Payload-Format und Versendung im Objektstil.

``` js
// Versendung mit einem Payload
store.dispatch('incrementAsync', {
  amount: 10
})

// Versendung mit einem Objekt
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

Ein praktischeres Beispiel wäre eine Action zum Aufgeben des Einkaufswagen, was das **Aufrufen eine asynchronen API** und **das Committen mehrerer Mutations** beinhaltet:

``` js
actions: {
  checkout ({ commit, state }, products) {
    // Sichere die aktuellen Artikel im Wagen.
    const savedCartItems = [...state.cart.added]
    // Sende eine Anfrage zur Aufgabe des Wagen
    // und leere diesen.
    commit(types.CHECKOUT_REQUEST)
    // Die Shop-API akzeptiert einen Erfolg- und Misserfolg-Callback.
    shop.buyProducts(
      products,
      // Handhabe den Erfolg.
      () => commit(types.CHECKOUT_SUCCESS),
      // Handhabe den Misserfolg.
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

Merke, dass ein Fluss asynchroner Operationen durchgeführt wird und die Nebeneffekte (State-Mutations) von Actions durch das Committen aufgezeichnet werden.

### Versendung von Actions in Komponenten

Man kann Actionen in Komponenten mit `this.$store.dispatch('xxx')` versenden. Es ist auch möglich `mapActions`-Helfer zu nutzen, welche die Komponenten-Methoden mit den `store.dispatch`-Rufen verbinden (benötigt Injektion des Root-Stores):

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment' // Verbinde 'this.increment()' mit 'this.$store.dispatch('increment')'.
    ]),
    ...mapActions({
      add: 'increment' // Verbinde 'this.add()' mit 'this.$store.dispatch('increment')'.
    })
  }
}
```

### Zusammensetzung von Actions

Actions sind oft asynchron - wie erfährt man also, wann eine Action beendet wurde? Wichtig zu erfahren ist auch, wie man mehrere Actions zusammensetzen kann, um einen komplexeren asynchronen Arbeitsfluss zu ermöglichen.

Zunächst sollte man wissen, dass `store.dispatch` den Promise bearbeiten kann, welcher durch den ausgelösten Action-Handler wiedergegeben wird. Darüberhinaus gibt dieser ebenfalls einen Promise wieder:

``` js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

Nun kann man folgendes machen:

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

Und ebenfalls in einer anderen Action:

``` js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

Schließlich, wenn [async/await](https://tc39.github.io/ecmascript-asyncawait/) genutzt werden, können Actions folgendermaßen zusammengesetzt werden:

``` js
// angenommen 'getData()' und 'getOtherData()' geben Promises wieder.

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // warte auf Beendigung von 'actionA'
    commit('gotOtherData', await getOtherData())
  }
}
```

> Es ist für `store.dispatch` möglich mehrere Action-Handler in mehreren Modulen auszulösen. In diesem Fall ist der wiedergegebene Wert ein Promise, welcher aufgelöst wird, wenn alle aktivierten Handler aufgelöst sind.
