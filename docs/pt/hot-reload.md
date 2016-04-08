# Hot Reloading

Vuex suporta hot-reloading para mutações, módulos, ações e getters durante desenvolvimento, utilizando o [Hot Module Replacement API](https://webpack.github.io/docs/hot-module-replacement.html) do Wepack. Você também pode utilizar com Browserify utilizando o plugin [browserify-hmr](https://github.com/AgentME/browserify-hmr/).

Para mutações e módulos, você precisa utilizar o método `store.hotUpdate()` da API:

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

Você não precisa fazer nada em específico para ações e getters. O sistema de substituição do Webpack's vai lidar com toda a parte das atualizações - e as mudanças em ações e getters irão ocorrer automaticamente nos componentes Vue que utilizam-nas. Como os componentes Vue carregados via `vue-loader` são recarregados automaticamente, esses componentes que forem afetados com mudanças vão se recarregar automaticamente e utilizarão as ações e getters mais recentes.
