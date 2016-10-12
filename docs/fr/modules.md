# Modules

Parce qu'il utilise un *single state tree*, tout le state de notre application est contenu dans un seul et même gros objet. Cependant, au fur et à mesure que notre application grandit, le store peut devenir très engorgé.

Pour remédier à ça, Vuex nous permet de diviser notre store en **modules**. Chaque module peut contenir son propre state, mutations, actions, getters, et même d'autres modules.

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

store.state.a // -> moduleA's state
store.state.b // -> moduleB's state
```

### State local d'un module

Dans les mutations et getters d'un module, le premier argument reçu sera le **state local du module**.

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment: (state) {
      // state is the local module state
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

De façon similaire, dans les actions du module, `context.state` exposera le state local, and le state racine sera disponible avec `context.rootState` :

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

Également, dans les getters du module, le state racine sera exposé en troisième argument :

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

Notez que les actions, mutations et getters dans un module sont toujours enregistrés sous le **namespace global** &mdash; cela permet à plusieurs modules de réagir au même type de mutation/action. You pouvez répartir les modules dans des namespaces vous-mêmes afin d'éviter les conflits de nom en préfixant ou suffixant leurs noms. Et vous devriez probablement faire cela si vous utiliser un module Vuex réutilisable qui sera utilisé dans des environnements inconnus. Par exemple, nous voulons créer un module `todos` :

``` js
// types.js

// define names of getters, actions and mutations as constants
// and they are prefixed by the module name `todos`
export const DONE_COUNT = 'todos/DONE_COUNT'
export const FETCH_ALL = 'todos/FETCH_ALL'
export const TOGGLE_DONE = 'todos/TOGGLE_DONE'
```

``` js
// modules/todos.js
import * as types from '../types'

// define getters, actions and mutations using prefixed names
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

### Enregistrement dynamique de module

Vous pouvez enregistrer un module **après** que le store ait été créé avec la méthode `store.registerModule` :

``` js
store.registerModule('myModule', {
  // ...
})
```

Le state du module sera disponible dans `store.state.myModule`.

L'enregistrement dynamique de module rend possible pour les autres plugins Vue de bénéficier de la gestion de state de Vuex en attachant un module au store de l'application. Par exemple, la bibliothèque [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) intègre vue-router avec vuex en gérant le state de la route d'application dans un module enregistré dynamiquement.

Vous pouvez aussi supprimer un module enregistré dynamiquement avec `store.unregisterModule(moduleName)`. Notez que vous ne pouvez pas supprimer des modules statiques (déclarés à la création du store) avec cette méthode.
