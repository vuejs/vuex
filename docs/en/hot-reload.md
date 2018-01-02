# Hot Reloading

Vuex supports hot-reloading mutations, modules, actions and getters during development, using webpack's [Hot Module Replacement API](https://webpack.js.org/guides/hot-module-replacement/). You can also use it in Browserify with the [browserify-hmr](https://github.com/AgentME/browserify-hmr/) plugin.

For mutations and modules, you need to use the `store.hotUpdate()` API method:

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

Checkout the [counter-hot example](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) to play with hot-reload.
