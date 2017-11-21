# Hot Reloading

Vuex unterstützt Hot-Reloading von Mutations, Modulen, Actions und Getters während der Entwicklungsphase zusammen mit Webpacks [Hot Module Replacement API](https://webpack.github.io/docs/hot-module-replacement.html). Auch Browserify kann mit [browserify-hmr](https://github.com/AgentME/browserify-hmr/) eingesetzt werden.

Für Mutations und Module muss die API-Methode `store.hotUpdate()` genutzt werden.

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
  // Akzeptiert Actions und Mutations als Hot-Modules.
  module.hot.accept(['./mutations', './modules/a'], () => {
    // Verlange die aktualisierten Module.
    // Hier muss .default hinzugefügt werde, wegen des
    // Modul-Outputs von Babel 6.
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // Wechsel die neuen Actions und Mutations ein.
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

Siehe auch das [Counter-Hot-Beispiel](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot), um Hot-Reload zu testen.
