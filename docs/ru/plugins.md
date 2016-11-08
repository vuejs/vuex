# Плагины

Хранилища Vuex принимают опцию `plugins`, предоставляющую хуки для каждой мутации. Vuex-плагин — это просто функция, получающая хранилище в качестве единственного параметра:

``` js
const myPlugin = store => {
  // вызывается после инициализации хранилища
  store.subscribe((mutation, state) => {
    // вызывается после каждой мутации
    // мутация передаётся в формате { type, payload }.
  })
}
```

Используются плагины так:

``` js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

### Вызов Мутаций из Плагинов

Плагинам не разрешается напрямую изменять состояние приложения — как и компоненты, они могут только вызывать изменения опосредованно, используя мутации.

Вызывая мутации, плагин может использоваться для синхронизации хранилища и внешнего источника данных. Например, для синхронизации с вебсокетом (пример намеренно упрощён, в реальной ситуации `createPlugin` имела бы дополнительные опции):

``` js
export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
```

``` js
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})
```

### Снятие Слепков Состояния

Иногда плагину может потребоваться "снять слепок" состояния приложения или сравнить состояния "до" и "после" мутации. Для этого необходимо использовать глубокое копирование объекта состояния:

``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // сравнение prevState и nextState...

    // сохранение состояния для следующей мутации
    prevState = nextState
  })
}
```

**Плагины, снимающие слепки, должны использоваться только на этапе разработки.** При использовании Webpack или Browserify, мы может отдать этот момент на их откуп:

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

Плагин будет использоваться по умолчанию. Для production-окружения вам понадобится [DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) для Webpack, или [envify](https://github.com/hughsk/envify) для Browserify, позволяющией изменить значение `process.env.NODE_ENV !== 'production'` на `false` в финальной сборке.

### Встроенный Плагин Логирования

> Если вы используете [vue-devtools](https://github.com/vuejs/vue-devtools), вам он скорее всего не понадобится

В комплекте с Vuex идёт плагин логирования, который можно использовать при отладке:

``` js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

Функция `createLogger` принимает нижеописанные опции:

``` js
const logger = createLogger({
  collapsed: false, // автоматически раскрывать залогированные мутации
  transformer (state) {
    // обработать состояние перед логированием
    // например, позволяет рассматривать только конкретное поддерево
    return state.subTree
  },
  mutationTransformer (mutation) {
    // мутации логируются в формате { type, payload },
    // но это можно изменить
    return mutation.type
  }
})
```

Логирующий плагин можно включить также и используя отдельный тег `<script>`, помещающий функцию `createVuexLogger` в глобальное пространство имён.

Обратите внимание, что этот плагин делает слепки состояний, поэтому использовать его стоит только на этапе разработки.
