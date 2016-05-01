# Recarga en caliente

Vuex soporta recarga de mutaciones en caliente, módulos, acciones y obtenedores durante el desarrollo, utilizando [Hot Module Replacement API](https://webpack.github.io/docs/hot-module-replacement.html) de Webpack. También puedes utilizarlo en Browserify con el plugin [browserify-hmr](https://github.com/AgentME/browserify-hmr/).

Para las mutaciones y los módulos, es necesario utilizar el método `store.hotUpdate()` del API:

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
  // aceptar acciones y mutaciones como módulos en caliente
  module.hot.accept(['./mutations', './modules/a'], () => {
    // requieren los módulos actualizados
    // hay que añadir .default aquí debido a la producción del módulo de babel 6
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // intercambio de las nuevas acciones y mutaciones
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

No tienes que hacer nada específico para acciones y obtenedores. El sistema de reemplazo de módulo en caliente de Webpack "empujará" los cambios hasta la cadena de dependencias - y los cambios en las acciones y obtenedores subirán a los componentes Vue que los importaron. Dado que los componentes Vue cargados a través de `vue-loader` son recargables en caliente por defecto, estos componentes afectados se recargarán en caliente a sí mismos y usarán las acciones y obtenedores actualizados.
