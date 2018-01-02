# Горячая замена

Vuex поддерживает горячую замену мутаций, модулей, действий и геттеров в момент разработки с помощью [webpack Hot Module Replacement API](https://webpack.js.org/guides/hot-module-replacement/). Аналогичный функционал в Browserify достижим при использовании плагина [browserify-hmr](https://github.com/AgentME/browserify-hmr/).

Для мутаций и модулей необходимо использовать метод API `store.hotUpdate()`:

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
  // рассматриваем действия и мутации как модули для горячей замены
  module.hot.accept(['./mutations', './modules/a'], () => {
    // запрашиваем обновлённые модули
    // (нужно указать .default из-за формата вывода Babel 6)
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // заменяем старые действия и мутации новыми
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

[Пример counter-hot](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) позволяет посмотреть на горячую замену в реальной жизни.
