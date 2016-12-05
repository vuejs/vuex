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
    increment: (state) {
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

Обратите внимание, что действия, мутации и геттеры, определённые внутри модулей, тем не менее регистрируются в **глобальном пространстве имён** — это позволяет нескольким модулям реагировать на один и тот же тип мутации или действия. Избежать конфликта пространства имён вы можете, указывая для них префикс или суффикс. При создании пригодных для повторного использования модулей Vuex, пожалуй, так поступать даже нужно — кто знает, в каком окружении их будут использовать? Например, предположим что мы создаём модуль `todos`:

###### types.js
``` js
// определим названия геттеров, действий и мутаций как константы
// используя название модуля (`todos`) в качестве префикса
export const DONE_COUNT = 'todos/DONE_COUNT'
export const FETCH_ALL = 'todos/FETCH_ALL'
export const TOGGLE_DONE = 'todos/TOGGLE_DONE'
```

###### modules/todos.js
``` js
import * as types from '../types'

// теперь используем определённые выше константы
const todosModule = {
  state: { todos: [] },

  getters: {
    [types.DONE_COUNT] (state) {
      // ...
    }
  },

  actions: {
    [types.FETCH_ALL] (context, payload) {
      // ...
    }
  },

  mutations: {
    [types.TOGGLE_DONE] (state, payload) {
      // ...
    }
  }
}
```

###### components/SomeComponent.vue  
``` js
<script>
import { mapGetters, mapActions } from 'vuex'
import * as types from '../types'

export default {
  computed: {
    ...mapGetters({
      doneCount: types.DONE_COUNT
    })
  },
  methods: {
    ...mapActions({
      fetchAllTodos: types.FETCH_ALL
    })
  }
}
</script>
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