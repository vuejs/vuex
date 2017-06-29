# Rechargement à chaud

Vuex prend en charge le rechargement à chaud des mutations, modules, actions et accesseurs durant le développement, en utilisant l'[API du module de remplacement à chaud](https://webpack.github.io/docs/hot-module-replacement.html) de webpack. Vous pouvez également utiliser Browserify avec le plugin [browserify-hmr](https://github.com/AgentME/browserify-hmr/).

Pour les mutations et les modules, vous aurez besoin d'utiliser la méthode d'API `store.hotUpdate()` :

``` js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import moduleA from './modules/a'

Vue.use(Vuex)

const state = { ... }

const store = new Vuex.Store({
  state,
  mutations,
  modules: {
    a: moduleA
  }
})

if (module.hot) {
  // accepter les actions et mutations en tant que module à chaud
  module.hot.accept(['./mutations', './modules/a'], () => {
    // requiert les modules à jour
    // ajout de `.default` ici pour les sorties des modules babel 6
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // remplacer les nouvelles actions et mutations
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

Jetez un œil à [l'exemple counter-hot](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) pour jouer avec du rechargement à chaud.
