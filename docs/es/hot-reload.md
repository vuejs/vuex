# Reload en caliente

Vuex tiene soporte para el Reload en Caliente de mutaciones, módulos, acciones y getters durante desarrollo, usando el [Hot Module Replacement API](https://webpack.github.io/docs/hot-module-replacement.html) de Webpack. También lo puedes usar con Browserify con el pluggin [browserify-hmr](https://github.com/AgentME/browserify-hmr/).

Para mutaciones y módulos, tienes que hacer uso del método `store.hotUpdate()`:

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
  // Aceptar acciones y mutaciones como calientes
  module.hot.accept(['./mutations', './modules/a'], () => {
    // Incluye los módulos actualizados
    // El uso de .default se debe a como se tratan los modulos con babel 6
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // Hacer el cambio de las nuevas acciones y mutaciones
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

Échale un vistazo al [ejemplo contador-caliente](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) y juega con el reload en caliente.
