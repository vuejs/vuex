# Hot Reloading (recarregamento rapido)

O Vuex suporta hot reloading de mutações, módulos, ações e getters durante o desenvolvimento, usando o pacote do webpack [Hot Module Replacement API](https://webpack.js.org/guides/hot-module-replacement/). Você também pode usá-lo em Browserify com o plugin [browserify-hmr](https://github.com/AgentME/browserify-hmr/).

Para mutações e módulos, você precisa usar o método da API `store.hotUpdate()`:

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
  // Aceita ações e mutações como 'hot modules'
  module.hot.accept(['./mutations', './modules/a'], () => {
    // Necessita dos módulos atualizados
    // Necessário adicionar .default devido ao módulo babel 6
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // trocar as novas ações e mutações
     store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

Confira o [counter-hot example](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) para usar o hot-reload.
