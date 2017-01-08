# Модули

Из-за использования единого дерева состояния, все глобальные данные приложения оказываются помещены в один большой объект. По мере роста приложения, хранилище может существенно раздуться.

Чтобы помочь в этой беде, Vuex позволяет разделять хранилище на **модули**. Каждый модуль может содержать собственное состояние, мутации, действия, геттеры, и даже встроенные подмодули — структура фрактальна:

``` js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> состояние модуля moduleA
store.state.b // -> состояние модуля moduleB
```

### Локальное состояние модулей

Первым аргументом, который получают мутации и геттеры, будет **локальное состояние модуля**.

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // state указывает на локальное состояние модуля
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

Аналогично, `context.state` в действиях также указывает на локальное состояние модуля, а корневое — доступно в `context.rootState`:

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOdd ({ state, commit }) {
      if (state.count % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

Кроме того, в геттеры корневое состояние передаётся 3-м параметром:

``` js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### Пространства имён

По умолчанию действия, мутации и геттеры внутри модулей регистрируются в **глобальном пространстве имён** — это позволяет нескольким модулям реагировать на тот же тип мутаций/действий.

Если вы хотите сделать модули более самодостаточными и готовыми для переиспользования, вы можете создать его с собственным пространством имён, указав опцию `namespaced: true`. Когда модуль будет зарегистрирован, все его геттеры, действия и мутации будут автоматически связаны с этим пространством имён, основываясь на пути по которому зарегистрирован модуль. Например:

``` js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // содержимое модуля
      state: { ... }, // состояние модуля автоматически вложено и не зависит от опции пространства имён
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
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // большая вложенность с собственным пространством имён
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

Геттеры и действия с собственным пространством имён будут получать свои локальные `getters`, `dispatch` и `commit`. Другими словами, вы можете использовать содержимое модуля без написания префиксов в том же модуле. Переключения между пространствами имён не влияет на код внутри модуля.

#### Доступ к глобальному содержимому в модулях с своим пространством имён

Если вы хотите использовать глобальное состояние и геттеры, `rootState` и `rootGetters` передаются 3-м и 4-м аргументами в функции геттеров, а также как свойства в объекте `context`, передаваемом в функции действий.

Для запуска действий или совершении мутаций в глобальном пространстве имён нужно добавить `{ root: true }` 3-м аргументом в `dispatch` и `commit`.

``` js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` ограничены геттерами данного модуля
      // вы можете использовать rootGetters из 4-го аргумента геттеров
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // dispatch и commit также ограничены данным модулем
      // они принимают опцию `root` для вызова в глобальном пространстве имён
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

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

#### Подключение с помощью вспомогательных функций к пространству имён

Подключение модуля со своим пространством имён к компонентам с помощью вспомогательных функций `mapState`, `mapGetters`, `mapActions` и `mapMutations` это может выглядеть подобным образом:

``` js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo',
    'some/nested/module/bar'
  ])
}
```

В таких случаях вы можете передать строку с пространством имён в качестве первого аргумента к вспомогательным функциям, тогда все привязки будут выполнены в контексте этого модуля. Пример выше можно упростить до:

``` js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo',
    'bar'
  ])
}
```

#### Уточнение для разработчиков плагинов

Вас может обеспокоить непредсказуемость пространства имён для ваших модулей, когда вы создаёте [плагин](plugins.md) с собственными модулями и возможностью пользователям добавлять их в хранилище Vuex. Ваши модули будут также помещены в пространство имён, если пользователи плагина добавляют ваши модули в модуль со своим пространством имён. Чтобы приспособиться к этой ситуации, вам может потребоваться получить значение пространства имён через настройки плагина:

``` js
// получение значения пространства имён через options
// и возвращение функции плагина Vuex
export function createPlugin (options = {}) {
  return function (store) {
    // добавление пространства имён к модулям плагина
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

### Динамическая регистрация модулей

Вы можете зарегистрировать модуль уже и **после** того, как хранилище было создано, используя метод `store.registerModule`:

``` js
store.registerModule('myModule', {
  // ...
})
```

Состояние модуля будет доступно как `store.state.myModule`.

Динамическая регистрация модулей позволяет другим плагинам Vue также использовать Vuex для управления своим состоянием, добавляя модуль к хранилищу данных приложения. Например, библиотека [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) интегрирует vue-router во vuex, отражая изменение текущего пути приложения в динамически присоединённом модуле.

Удалить динамически зарегистрированный модуль можно с помощью `store.unregisterModule(moduleName)`. Обратите внимание, что статические (определённые на момент создания хранилища) модули при помощи этого метода удалить не получится.
