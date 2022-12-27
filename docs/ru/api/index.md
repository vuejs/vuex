---
sidebar: auto
---

# Справочник API

## Store

### createStore

- `createStore<S>(options: StoreOptions<S>): Store<S>`

  Создаёт новое хранилище.

  ```js
  import { createStore } from 'vuex'

  const store = createStore({ ...options })
  ```

## Опции конструктора Store

### state

- тип: `Object | Function`

  Корневой объект состояния хранилища Vuex. [Подробнее](../guide/state.md)

  При передачи функции, возвращающей объект, этот объект будет использован в качестве корневого состояния. А во втором случае если потребуется переиспользовать объект состояния, особенно при повторном использовании модулей. [Подробнее](../guide/modules.md#повторное-использование-модулей)

### mutations

- тип: `{ [type: string]: Function }`

  Доступные мутации хранилища. Обработчики мутаций первым аргументом получают `state` (при использовании модулей это будет локальное состояние модуля). Вторым аргументом передаётся «нагрузка» (`payload`), если она есть.

  [Подробнее](../guide/mutations.md)

### actions

- тип: `{ [type: string]: Function }`

  Доступные действия хранилища. В обработчики передаётся объект `context`, со следующими свойствами:

  ```js
  {
    state,      // то же, что и `store.state`, или локальный state при использовании модулей
    rootState,  // то же, что и `store.state`, только при использовании модулей
    commit,     // то же, что и `store.commit`
    dispatch,   // то же, что и `store.dispatch`
    getters,    // то же, что и `store.getters`, или локальный getters при использовании модулей
    rootGetters // то же, что и `store.getters`, только в модулях
  }
  ```

Вторым аргументом передаётся «нагрузка» (`payload`), если она есть.

[Подробнее](../guide/actions.md)

### getters

- тип: `{ [key: string]: Function }`

  Доступные геттеры хранилища. Функция получает следующие аргументы:

  ```
  state,     // при использовании модулей — локальный state модуля
  getters    // то же, что и store.getters
  ```

  При определении в модуле

  ```
  state,       // при использовании модулей — локальный state модуля
  getters,     // локальные геттеры текущего модуля
  rootState,   // глобальный state
  rootGetters  // все геттеры
  ```

  Зарегистрированные геттеры доступны через `store.getters`.

  [Подробнее](../guide/getters.md)

### modules

- тип: `Object`

  Объект, содержащий под-модули для помещения в хранилище, в формате:

  ```js
  {
    key: {
      state,
      namespaced?,
      mutations?,
      actions?,
      getters?,
      modules?
    },
    ...
  }
  ```

  У каждого модуля могут быть свои `state` и `mutations`, аналогично корневому хранилищу. Состояние модуля прикрепляется к корневому, по указанному ключу. Мутации и геттеры модуля получают первым аргументом локальное состояние, а не корневое. При вызове действий `context.state` аналогичным образом указывает на локальное состояние модуля.

  [Подробнее](../guide/modules.md)

### plugins

- тип: `Array<Function>`

  Массив функций-плагинов, которые применяются к хранилищу. Плагины просто получают хранилище в качестве единственного аргумента, и могут как отслеживать мутации (для сохранения исходящих данных, логирования или отладки) или инициировать их (для обработки входящих данных, например, websockets или observables).

  [Подробнее](../guide/plugins.md)

### strict

- тип: `boolean`
- по умолчанию: `false`

  Форсирует использование «строгого режима» в хранилище Vuex. В нём любые изменения состояния, происходящие вне обработчиков мутаций, будут выбрасывать ошибки.

  [Подробнее](../guide/strict.md)

### devtools

- тип: `boolean`

  Интеграция в devtools конкретного экземпляра Vuex. Например, передача `false` сообщает экземпляру хранилища Vuex, что не требуется интегрироваться с плагином devtools. Это будет полезно если у вас несколько хранилищ на одной странице.

  ```js
  {
    devtools: false
  }
  ```

## Свойства экземпляра Store

### state

- тип: `Object`

  Корневое состояние. Только для чтения.

### getters

- тип: `Object`

  Зарегистрированные геттеры. Только для чтения.

## Методы экземпляра Store

### commit

-  `commit(type: string, payload?: any, options?: Object)`
-  `commit(mutation: Object, options?: Object)`

  Запуск мутации. `options` может содержать опцию `root: true` что позволяет запускать корневые (root) мутации [в модулях со своим пространством имён](../guide/modules.md#пространства-имён). [Подробнее](../guide/mutations.md)

### dispatch

-  `dispatch(type: string, payload?: any, options?: Object): Promise<any>`
-  `dispatch(action: Object, options?: Object): Promise<any>`

  Запуск действия. `options` может содержать опцию `root: true` что позволяет запускать корневые (root) действия [в модулях со своим пространством имён](../guide/modules.md#пространства-имён). Возвращает Promise, который разрешает все обработчики инициируемых действий. [Подробнее](../guide/actions.md)

### replaceState

-  `replaceState(state: Object)`

  Замена корневого состояние хранилища новым. Используйте только для гидратации состояния и/или функциональности «машины времени».

### watch

-  `watch(fn: Function, callback: Function, options?: Object): Function`

  Реактивно отслеживает возвращаемое значение `fn`, и вызывает коллбэк в случае изменений. Первым аргументом `fn` будет состояние хранилища, вторым — геттеры. Опционально может принимать объект с настройками, с такими же параметрами как и у [метода Vue `vm.$watch`](https://ru.vuejs.org/v2/api/#vm-watch).

  Для прекращения отслеживания, необходимо вызвать возвращаемую методом функцию.

### subscribe

-  `subscribe(handler: Function, options?: Object): Function`

  Отслеживание вызова мутаций хранилища. Обработчик `handler` вызывается после каждой мутации и получает в качестве параметров дескриптор мутации и состояние после мутации.

  ```js
  const unsubscribe = store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })

  // для остановки отслеживания нужно вызвать unsubscribe
  unsubscribe()
  ```

  По умолчанию, новый обработчик добавляется в конец цепочки, поэтому он будет выполняться после других обработчиков, добавленных раньше. Это поведение можно переопределить добавив `prepend: true` в `options`, что позволит добавлять обработчик в начало цепочки.

  ```js
  store.subscribe(handler, { prepend: true })
  ```

  Метод `subscribe` возвращает функцию `unsubscribe`, которую требуется вызывать когда отслеживание больше не требуется. Например, можно подписаться на модуль Vuex и прекращать отслеживание при удалении регистрации модуля. Или можно вызвать `subscribe` внутри компонента Vue, а позднее уничтожить компонент. В таких случаях, необходимо вручную останавливать отслеживание.

  Чаще всего используется в плагинах. [Подробнее](../guide/plugins.md)

### subscribeAction

-  `subscribeAction(handler: Function, options?: Object): Function`

  Отслеживание вызова действий хранилища. Обработчик `handler` вызывается после каждого действия и получает в качестве параметров дескриптор действия и текущее состояние хранилища.
  Метод `subscribe` возвращает функцию `unsubscribe`, которую требуется вызывать когда отслеживание больше не требуется. Например, при удалении регистрации модуля Vuex или перед уничтожением компонента Vue.

  ```js
  const unsubscribe = store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })

  // для остановки отслеживания нужно вызвать unsubscribe
  unsubscribe()
  ```

  По умолчанию, новый обработчик добавляется в конец цепочки, поэтому он будет выполняться после других обработчиков, добавленных раньше. Это поведение можно переопределить добавив `prepend: true` в `options`, что позволит добавлять обработчик в начало цепочки.

  ```js
  store.subscribeAction(handler, { prepend: true })
  ```

  Метод `subscribeAction` возвращает функцию `unsubscribe`, которую требуется вызывать когда отслеживание больше не требуется. Например, можно подписаться на модуль Vuex и прекращать отслеживание при удалении регистрации модуля. Или можно вызвать `subscribeAction` внутри компонента Vue, а позднее уничтожить компонент. В таких случаях, необходимо вручную останавливать отслеживание.

  В `subscribeAction` также можно определять, должен ли обработчик вызываться _до_ или _после_ вызова действия (по умолчанию поведение _до_):

  ```js
  store.subscribeAction({
    before: (action, state) => {
      console.log(`перед действием ${action.type}`)
    },
    after: (action, state) => {
      console.log(`после действия ${action.type}`)
    }
  })
  ```

  В `subscribeAction` также можно указывать обработчик `error` для перехвата ошибки, выброшенной при выполнении действия. В качестве третьего аргумента функция получает объект `error`.

  ```js
  store.subscribeAction({
    error: (action, state, error) => {
      console.log(`ошибка при действии ${action.type}`)
      console.error(error)
    }
  })
  ```

  Метод `subscribeAction` чаще всего используется в плагинах. [Подробнее](../guide/plugins.md)

### registerModule

-  `registerModule(path: string | Array<string>, module: Module, options?: Object)`

  Регистрирует динамический модуль. [Подробнее](../guide/modules.md#динамическая-регистрация-модуnей)

  `options` может иметь опцию `preserveState: true`, что позволяет сохранить предыдущее состояние. Полезно при отрисовке на стороне сервера (SSR).

### unregisterModule

-  `unregisterModule(path: string | Array<string>)`

  Удаление зарегистрированного динамического модуля. [Подробнее](../guide/modules.md#динамическая-регистрация-модулей)

### hasModule

-  `hasModule(path: string | Array<string>): boolean`

  Проверка, не зарегистрирован ли уже модуль с заданным именем. [Подробнее](../guide/modules.md#динамическая-регистрация-модуnей)

### hotUpdate

-  `hotUpdate(newOptions: Object)`

  Горячая перезагрузка действий и мутаций. [Подробнее](../guide/hot-reload.md)

## Вспомогательные функции для компонентов

### mapState

-  `mapState(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Создаёт вычисляемые свойства компонента, возвращающие под-дерево состояния хранилища Vuex. [Подробнее](../guide/state.md#вспомогатеnьная-функция-mapstate)

  Первый опциональный аргумент может быть строкой пространства имён. [Подробнее](../guide/modules.md#подкnючение-с-помощью-вспомогатеnьных-функций-к-пространству-имён)

  Второй аргумент вместо объекта может быть функцией. `function(state: any)`

### mapGetters

-  `mapGetters(namespace?: string, map: Array<string> | Object<string>): Object`

  Создаёт вычисляемые свойства компонента для доступа к геттерам. [Подробнее](../guide/getters.md#вспомогательная-функция-mapgetters)

  Первый опциональный аргумент может быть строкой пространства имён. [Подробнее](../guide/modules.md#подключение-с-помощью-вспомогательных-функций-к-пространству-имён)

### mapActions

-  `mapActions(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Создаёт проксирующие методы компонента для вызова действий хранилища. [Подробнее](../guide/actions.md#диспетчеризация-действий-в-компонентах)

  Первый опциональный аргумент может быть строкой пространства имён. [Подробнее](../guide/modules.md#подключение-с-помощью-вспомогательных-функций-к-пространству-имён)

  Второй аргумент вместо объекта может быть функцией. `function(dispatch: function, ...args: any[])`

### mapMutations

-  `mapMutations(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Создаёт проксирующие методы компонента для вызова мутаций хранилища. [Подробнее](../guide/mutations.md#вызов-мутаций-в-компонентах)

  Первый опциональный аргумент может быть строкой пространства имён. [Подробнее](../guide/modules.md#подкnючение-с-помощью-вспомогатеnьных-функций-к-пространству-имён)

  Второй аргумент вместо объекта может быть функцией. `function(commit: function, ...args: any[])`

### createNamespacedHelpers

-  `createNamespacedHelpers(namespace: string): Object`

  Создаёт вспомогательные функции связывания с компонентами для указанного пространства имён. Возвращаемый объект содержит `mapState`, `mapGetters`, `mapActions` и `mapMutations`, которые связаны с указанным пространством имён. [Подробнее](../guide/modules.md#подкnлчение-с-помощью-вспомогательных-функций-к-пространству-имён)

## Функции для Composition API

### useStore

- `useStore<S = any>(injectKey?: InjectionKey<Store<S>> | string): Store<S>;`

  Извлекает внедрённое хранилище при вызове внутри `setup` хука. При использовании Composition API, можно извлечь хранилище вызвав этот метод.

  ```js
  import { useStore } from 'vuex'

  export default {
    setup () {
      const store = useStore()
    }
  }
  ```

  Пользователи TypeScript могут использовать ключ внедрения для извлечения типизированного хранилища. Для того чтобы это работало, необходимо определить ключ внедрения и передать его вместе с хранилищем при установке экземпляра хранилища в Vue приложение.

  Сначала объявите ключ внедрения, используя Vue интерфейс `InjectionKey`.

  ```ts
  // store.ts
  import { InjectionKey } from 'vue'
  import { createStore, Store } from 'vuex'

  export interface State {
    count: number
  }

  export const key: InjectionKey<Store<State>> = Symbol()

  export const store = createStore<State>({
    state: {
      count: 0
    }
  })
  ```

  Затем передайте определённый ключ в качестве второго аргумента для метода `app.use`.

  ```ts
  // main.ts
  import { createApp } from 'vue'
  import { store, key } from './store'

  const app = createApp({ ... })

  app.use(store, key)

  app.mount('#app')
  ```

  Наконец, можно передать ключ методу `useStore`, чтобы получить экземпляр типизированного хранилища.

  ```ts
  // в vue компоненте
  import { useStore } from 'vuex'
  import { key } from './store'

  export default {
    setup () {
      const store = useStore(key)

      store.state.count // типизировано как число
    }
  }
  ```
