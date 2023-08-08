# Горячая перезагрузка

Vuex поддерживает горячую замену мутаций, модулей, действий и геттеров в момент разработки с помощью [webpack Hot Module Replacement API](https://webpack.js.org/guides/hot-module-replacement/). Аналогичная функциональность в Browserify достижима при использовании плагина [browserify-hmr](https://github.com/AgentME/browserify-hmr/).

Для мутаций и модулей необходимо использовать метод API `store.hotUpdate()`:

```js
// store.js
import { createStore } from 'vuex'
import mutations from './mutations'
import moduleA from './modules/a'

const state = { ... }

const store = createStore({
  state,
  mutations,
  modules: {
    a: moduleA
  }
})

if (module.hot) {
  // отслеживаем действия и мутации как модули для горячей замены
  module.hot.accept(['./mutations', './modules/a'], () => {
    // запрашиваем обновлённые модули
    // (нужно указать .default из-за формата вывода Babel 6)
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // заменяем на новые модули и мутации
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

[Пример counter-hot](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) позволяет посмотреть на горячую перезагрузку в реальной жизни.

## Горячая перезагрузка динамических модулей

Если в приложении используются только модули, то можно использовать `require.context` для загрузки и горячей перезагрузки всех модулей динамически.

```js
// store.js
import { createStore } from 'vuex'

// Загружаем все модули
function loadModules() {
  const context = require.context('./modules', false, /([a-z_]+)\.js$/i)

  const modules = context
    .keys()
    .map((key) => ({ key, name: key.match(/([a-z_]+)\.js$/i)[1] }))
    .reduce(
      (modules, { key, name }) => ({
        ...modules,
        [name]: context(key).default
      }),
      {}
    )

  return { context, modules }
}

const { context, modules } = loadModules()

const store = createStore({
  modules
})

if (module.hot) {
  // Горячая перезагрузка при любых изменениях модуля
  module.hot.accept(context.id, () => {
    const { modules } = loadModules()

    store.hotUpdate({
      modules
    })
  })
}
```
