# Modules

Aufgrund eines Single State Trees ist der gesamte State der App in einem großen Objekt versammelt. Allerdings kann dieses schnell überfüllt werden, wenn die App größer wird.

Um dem entgegenzuwirken, erlaubt es Vue den Store in Module aufzuteilen. Jedes Modul kann so seinen eigenen State, Mutations, Actions, Getters und sogar verschachtelte Module haben. Es ist stark gegliedert von oben bis unten:

``` js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> State von moduleA
store.state.b // -> State von moduleB
```

### Lokaler State in Modulen

In den Mutations und Getters eines Moduls ist das erste Argument der **lokale State des Moduls.**

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // 'state' ist der lokale Modul-State
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

In den Modul-Actions stellen `context.state` den lokalen State und `context.rootState` den Root-State zur Verfügung:

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOdd ({ state, commit }) {
      if (state.count % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

Ebenfalls wird in Modul-Getters der Root-State als drittes Argument freigegeben:

``` js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### Namespacing


Actions, Mutations und Getters in Modulen sind noch immer  unter dem globalen Namespace registriert. Das erlaubt mehrere Module auf den selben Mutation-/Action-Typ zu reagieren.

Man kann den Namen der Modul-Assets auch selbst festlegen, indem man Suffixe und Präfixe anhängt, um Namenskonflikte zu vermeiden. Dies sollte man auch tun, wenn wiederkehrende Vuex-Module für unbekannte Umgebunden geschrieben werden.

Hier zum Beispiel ein `todo`-Modul:


``` js
// types.js

// Definiere Namen der Getters, Actions und Mutations als Konstanten
// und präfigiere sie mit dem Modulnamen 'todos'.
export const DONE_COUNT = 'todos/DONE_COUNT'
export const FETCH_ALL = 'todos/FETCH_ALL'
export const TOGGLE_DONE = 'todos/TOGGLE_DONE'
```

``` js
// modules/todos.js
import * as types from '../types'

// Definiere Getters, Actions und Mutations mit präfigierten Namen.
const todosModule = {
  state: { todos: [] },

  getters: {
    [types.DONE_COUNT] (state) {
      // ...
    }
  },

  actions: {
    [types.FETCH_ALL] (context, payload) {
      // ...
    }
  },

  mutations: {
    [types.TOGGLE_DONE] (state, payload) {
      // ...
    }
  }
}
```

### Dynamische Modulregistrierung

Es ist möglich ein Modul zu registrieren, **nachdem** der Store mit der Methode `store.registerModule` erstellt wurde:

``` js
store.registerModule('myModule', {
  // ...
})
```

Der State des Moduls wird als `store.state.myModule` freigegeben.

Dynamische Modulregistrierung ermöglicht es anderen Vue-Plugins Gebrauch vom State-Management von Vuex zu machen, indem ein Modul an den Store der App beigefügt wird.

So integriert [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) zum Beispiel `vue-router` in `vuex` durch Organisation der Route-State in einem dynamisch beigefügten Modul.

Man kann auch ein dynamisch registriertes Modul mit `store.unregisterModule(moduleName)` entfernen. Allerdings ist es nicht möglich dies bei statischen Modulen (deklariert bei Store-Erstellung) anzuwenden.
