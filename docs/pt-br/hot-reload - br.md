# Hot Reloading (recarregamento rapido)

O Vuex suporta hot reloading de muta��es, m�dulos, a��es e getters durante o desenvolvimento, usando o pacote do webpack [Hot Module Replacement API](https://webpack.js.org/guides/hot-module-replacement/). Voc� tamb�m pode us�-lo em Browserify com o [browserify-hmr](https://github.com/AgentME/browserify-hmr/) plugin.

Para muta��es e m�dulos, voc� precisa usar o m�todo `store.hotUpdate ()` API:

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
  // Aceita a��es e muta��es como m�dulos quentes
  module.hot.accept(['./mutations', './modules/a'], () => {
    // Necessita dos m�dulos atualizados
    // Necess�rio adicionar .default devido ao m�dulo babel 6
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // trocar as novas a��es e muta��es
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
