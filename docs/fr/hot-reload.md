# Hot Reloading

Vuex prend en charge le `hot-reloading` des mutations, modules, actions et getters durant le développement, en utilisant l'[API Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement.html) de webpack. Vous pouvez également utiliser Browserify avec le plugin [browserify-hmr](https://github.com/AgentME/browserify-hmr/).

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
  // accept actions and mutations as hot modules
  module.hot.accept(['./mutations', './modules/a'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // swap in the new actions and mutations
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

Jetez un œil à [l'exemple counter-hot](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) pour jouer avec le hot-reload.
