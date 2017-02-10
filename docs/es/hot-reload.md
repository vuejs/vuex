# Recarga en caliente

Vuex soporta recarga en caliente de mutaciones, módulos acciones y _getters_ durante la etapa de desarrollo, utilizando la API de Webpack para [reemplazo en caliente de módulos](https://webpack.github.io/docs/hot-module-replacement.html). También puedes utilizarlo en Browserify con el plugin [browserify-hmr](https://github.com/AgentME/browserify-hmr/).

Para mutaciones y módulos, necesitas utilizar el método de la API `store.hotUpdate()`:

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
  // aceptar acciones y mutaciones como módulos "calientes"
  module.hot.accept(['./mutations', './modules/a'], () => {
    // requerir los módulos actualizados
    // hay que añadir .default debido a la salida de módulos de babel 6
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // intercambiar las nuevas acciones y mutaciones
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

[Ejemplo de app contador](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) para jugar con la recarga en caliente.
