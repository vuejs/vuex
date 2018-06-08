# Hot Reloading (Recarregamento Rápido)

O Vuex suporta _hot-reloading_ de mutações, módulos, ações e _getters_ durante o desenvolvimento, utilizando o _webpack_ [Hot Module Replacement API](https://webpack.js.org/guides/hot-module-replacement/). Você também pode usá-lo no Browserify com o _plugin_ [browserify-hmr](https://github.com/AgentME/browserify-hmr/).

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
  // aceita ações e mutações como 'hot modules'
  module.hot.accept(['./mutations', './modules/a'], () => {
    // requer os módulos atualizados
    // tem que adicionar .default aqui devido à saída do módulo babel 6
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // troca nas novas ações e mutações
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

Confira o  [counter-hot example](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) para brincar com o hot-reload.
