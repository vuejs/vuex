# Модули

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cqKK4psq" target="_blank" rel="noopener noreferrer">Пройдите этот урок на Scrimba</a></div>

Благодаря использованию единого дерева состояния, все состояния приложения содержатся внутри одного большого объекта. Однако, по мере роста и масштабировании приложения, хранилище может существенно раздуться.

Чтобы помочь в этой беде, Vuex позволяет разделять хранилище на **модули**. Каждый модуль может содержать собственное состояние, мутации, действия, геттеры и даже встроенные подмодули — структура фрактальна:

```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = createStore({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> состояние модуля `moduleA`
store.state.b // -> состояние модуля `moduleB`
```

## Локальное состояние модулей

Первым аргументом, который получает мутации и геттеры, будет **локальное состояние модуля**.

```js
const moduleA = {
  state: () => ({
    count: 0
  }),
  mutations: {
    increment(state) {
      // `state` указывает на локальное состояние модуля
      state.count++
    }
  },
  getters: {
    doubleCount(state) {
      return state.count * 2
    }
  }
}
```

Аналогично, `context.state` в действиях также указывает на локальное состояние модуля, а корневое — доступно в `context.rootState`:

```js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

Кроме того, в геттеры корневое состояние передаётся 3-м параметром:

```js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount(state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

## Пространства имён

Действия и мутации внутри модулей по умолчанию регистрируются в **глобальном пространстве имён** — это позволяет нескольким модулям реагировать на один и тот же тип действий/мутаций. Геттеры также по умолчанию регистрируются в глобальном пространстве имён. В настоящее время у этого нет функционального значения (так сделано во избежание кардинальных изменений). Поэтому следует быть осторожным, чтобы не определить два геттера с одинаковыми именами в разных модулях, что приведёт к ошибкам.

Если хотите сделать модули более самодостаточными и готовыми для переиспользования, можно создать его с собственным пространством имён, указав опцию `namespaced: true`. Когда модуль будет зарегистрирован, все его геттеры, действия и мутации будут автоматически связаны с этим пространством имён, основываясь на пути, по которому зарегистрирован модуль. Например:

```js
const store = createStore({
  modules: {
    account: {
      namespaced: true,

      // содержимое модуля
      state: () => ({ ... }), // состояние модуля автоматически вложено и не зависит от опции пространства имён
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // вложенные модули
      modules: {
        // наследует пространство имён из родительского модуля
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // большая вложенность с собственным пространством имён
        posts: {
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

Геттеры и действия с собственным пространством имён будут получать свои локальные `getters`, `dispatch` и `commit`. Другими словами, можно использовать содержимое модуля без написания префиксов в том же модуле. Переключения между пространствами имён не влияет на код внутри модуля.

### Доступ к глобальному содержимому в модулях со своим пространством имён

Если хотите использовать глобальное состояние и геттеры, `rootState` и `rootGetters` передаются 3-м и 4-м аргументами в функции геттеров, а также как свойства в объекте `context`, передаваемом в функции действий.

Для запуска действий или совершения мутаций в глобальном пространстве имён нужно добавить `{ root: true }` 3-м аргументом в `dispatch` и `commit`.

```js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` ограничены геттерами данного модуля
      // можно использовать rootGetters из 4-го аргумента геттеров
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
        rootGetters['bar/someOtherGetter'] // -> 'bar/someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // dispatch и commit также ограничены данным модулем
      // они принимают опцию `root` для вызова в глобальном пространстве имён
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'
        rootGetters['bar/someGetter'] // -> 'bar/someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

### Регистрация глобального действия в модуле с собственным пространством имён

Если хотите зарегистрировать глобальное действие в модуле с собственным пространством имён, можно пометить его с помощью `root: true` и поместить определение действия в функцию `handler`. Например:

```js
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

### Подключение с помощью вспомогательных функций к пространству имён

Подключение модуля со своим пространством имён к компонентам с помощью вспомогательных функций `mapState`, `mapGetters`, `mapActions` и `mapMutations` это может выглядеть подобным образом:

```js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  }),
  ...mapGetters([
    'some/nested/module/someGetter', // -> this['some/nested/module/someGetter']
    'some/nested/module/someOtherGetter', // -> this['some/nested/module/someOtherGetter']
  ])
},
methods: {
  ...mapActions([
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar'  // -> this['some/nested/module/bar']()
  ])
}
```

В таких случаях можно передать строку с пространством имён в качестве первого аргумента к вспомогательным функциям, тогда все привязки будут выполнены в контексте этого модуля. Пример выше можно упростить до:

```js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  }),
  ...mapGetters('some/nested/module', [
    'someGetter', // -> this.someGetter
    'someOtherGetter', // -> this.someOtherGetter
  ])
},
methods: {
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar'  // -> this.bar()
  ])
}
```

Кроме того, можно создать вспомогательные функции с помощью `createNamespacedHelpers`. Она возвращает объект, в котором все вспомогательные функции для связывания с компонентами будут указывать на переданное пространство имён:

```js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // будет указывать на `some/nested/module`
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // будет указывать на `some/nested/module`
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

### Уточнение для разработчиков плагинов

Можно обеспокоиться непредсказуемостью пространства имён для модулей, когда создаёте [плагин](plugins.md) с собственными модулями и возможностью пользователям добавлять их в хранилище Vuex. Ваши модули будут также помещены в пространство имён, если пользователи плагина добавляют ваши модули в модуль со своим пространством имён. Чтобы приспособиться к этой ситуации, может потребоваться получение значения пространства имён через настройки плагина:

```js
// получение значения пространства имён через options
// и возвращение функции плагина Vuex
export function createPlugin(options = {}) {
  return function(store) {
    // добавление пространства имён к модулям плагина
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

## Динамическая регистрация модулей

Можно зарегистрировать модуль уже и **после создания хранилища**, с помощью метода `store.registerModule`:

```js
import { createStore } from 'vuex'

const store = createStore({ /* опции */ })

// регистрация модуля `myModule`
store.registerModule('myModule', {
  // ...
})

// регистрация вложенного модуля `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

Состояние модуля будет доступно как `store.state.myModule` и `store.state.nested.myModule`.

Динамическая регистрация модулей позволяет другим плагинам Vue также использовать Vuex для управления своим состоянием, добавляя модуль к хранилищу данных приложения. Например, библиотека [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) интегрирует vue-router во vuex, отражая изменение текущего пути приложения в динамически присоединённом модуле.

Удалить динамически зарегистрированный модуль можно с помощью `store.unregisterModule(moduleName)`. Обратите внимание, что статические (определённые на момент создания хранилища) модули при помощи этого метода удалить не получится.

Обратите внимание, что можно проверить, зарегистрирован ли уже модуль с заданным именем с помощью метода `store.hasModule(moduleName)`. Следует иметь в виду, что вложенные модули должны передаваться как массивы как для `registerModule`, так и для `hasModule`, а не как строка с путём к модулю.

### Сохранение состояния

Вероятно, захочется сохранить предыдущее состояние при регистрации нового модуля, например сохранить состояние из приложения с рендерингом на стороне сервера. Можно этого добиться с помощью опции `preserveState`: `store.registerModule('a', module, { preserveState: true })`.

При использовании `preserveState: true` модуль регистрируется, действия, мутации и геттеры добавляются в хранилище, а состояние нет. Предполагается, что состояние вашего хранилища уже содержит состояние для этого модуля и нет необходимости его перезаписывать.

## Повторное использование модулей

Иногда может потребоваться создать несколько экземпляров модуля, например:

- Создание нескольких хранилищ, которые используются одним модулем (например, чтобы [избегать синглтонов с сохранением состояния в SSR](https://ssr.vuejs.org/en/structure.html#avoid-stateful-singletons) при использовании опции `runInNewContext` в значении `false` или `'once'`);
- Регистрация модуля несколько раз в одном хранилище.

Если используем просто объект для определения состояния модуля, тогда этот объект состояния будет использоваться по ссылке и вызывать загрязнение состояния хранилища / модуля при его мутациях.

Это фактически та же самая проблема с `data` внутри компонентов Vue. А значит и решение будет таким же — использовать функцию для объявления состояния модуля (поддержка добавлена в версии 2.3.0+):

```js
const MyReusableModule = {
  state: () => ({
    foo: 'bar'
  })
  // мутации, действия, геттеры...
}
```
