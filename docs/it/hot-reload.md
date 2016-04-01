# Aggiornamento Automatico (Hot Reload)

Vuex supporta l'aggiornamento automatico (Hot Reload o Aggiornamento a Caldo) per quanto riguarda i moduli, le mutation e gli action il tutto tramite WebPack [e le sue API](https://webpack.github.io/docs/hot-module-replacement.html).
Ovviamente esiste anche l'alternativa tramite Browserify tramite il plugin [browserify-hmr](https://github.com/AgentME/browserify-hmr/).

Per le mutation ed i moduli dovrete usare il metodo `store.hotUpdate()`:

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
  // accetta le action o le mutation come moduli
  module.hot.accept(['./mutations', './modules/a'], () => {
    // richiede di aggiornare i moduli
    // aggiungiamo .default tramite babel 6
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // sostituiamo le nuove mutation ed i moduli nello store
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

Per quanto riguarda i getters non dovrete fare niente di specifico. I moduli di Webpack per l'hot reload vengono inseriti nella catena delle dipendenze che vanno ad analizzare i componenti di Vue per i getters, dato che i componenti vengono caricati via `vue-loader` essi sono automaticamente sotto "hot reload", questa catena è ricorsiva per ogni albero di componenti.
