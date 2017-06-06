# Hot Reloading

Vuex suporta hot-reloading em mutações, módulos, ações e getters durante o desenvolvimento, usando a [Hot Module Replacement API](https://webpack.github.io/docs/hot-module-replacement.html) do Webpack. Você também pode usar o Browserify com o plugin [browserify-hmr](https://github.com/AgentME/browserify-hmr/).

Para mutações e módulos, você preicia usar o método da API `store.hotUpdate()`:

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
  // aceita ações e mutações como hot modules
  module.hot.accept(['./mutations', './modules/a'], () => {
    // requer os módulos atualizados
    // tem que adicionar .default aqui por causa da 
    // saída de módulo do babel 6
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // substitui pelas ações e mutações novas
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

Dê uma olhada no [exemplo counter-hot](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) para brincar com hot reload.
