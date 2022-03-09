# Rechargement à chaud

Vuex prend en charge le rechargement à chaud des mutations, modules, actions et getters pendant le développement, en utilisant l'API [Hot Module Replacement API](https://webpack.js.org/guides/hot-module-replacement/) de webpack. Vous pouvez également l'utiliser dans Browserify avec le plugin [browserify-hmr](https://github.com/AgentME/browserify-hmr/).

Pour les mutations et les modules, vous devez utiliser la méthode API `store.hotUpdate()` :

``` js
// store.js
import { createStore } from 'vuex'
import mutations from './mutations'
import moduleA from './modules/a'

const state = { ... }

const store = createStore({
  state,
  mutations,
  modules: {
    a: moduleA
  }
})

if (module.hot) {
  // accepter les actions et les mutations comme des modules chauds
  module.hot.accept(['./mutations', './modules/a'], () => {
    // nécessite les modules mis à jour
    // il faut ajouter .default ici à cause de la sortie du module babel 6
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // introduire les nouveaux modules et les mutations
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

Consultez le [counter-hot example](https://github.com/vuejs/vuex/tree/main/examples/counter-hot) pour jouer avec le rechargement à chaud.

## Rechargement dynamique des modules à chaud

Si vous utilisez exclusivement des modules, vous pouvez utiliser `require.context` pour charger et recharger à chaud tous les modules dynamiquement.

```js
// store.js
import { createStore } from 'vuex'

// Charger tous les modules.
function loadModules() {
  const context = require.context("./modules", false, /([a-z_]+)\.js$/i)

  const modules = context
    .keys()
    .map((key) => ({ key, name: key.match(/([a-z_]+)\.js$/i)[1] }))
    .reduce(
      (modules, { key, name }) => ({
        ...modules,
        [name]: context(key).default
      }),
      {}
    )

  return { context, modules }
}

const { context, modules } = loadModules()

const store = createStore({
  modules
})

if (module.hot) {
  // Rechargement à chaud à chaque fois qu'un module est modifié.
  module.hot.accept(context.id, () => {
    const { modules } = loadModules()

    store.hotUpdate({
      modules
    })
  })
}
```
