# Справочник API

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store Constructor Options

- **state**

  - тип: `Object`

    Корневой объект состояния хранилища Vuex.

    [Подробнее](state.md)

- **mutations**

  - тип: `{ [type: string]: Function }`

    Регистрирует доступные для хранилища мутации. Функции-обработчики в качестве первого аргумента всегда получают `state` (в случае использования модуля — это будет локальный state модуля). Второй аргумент, `payload`, также передаётся — при его наличии.

    [Подробнее](mutations.md)

- **actions**

  - тип: `{ [type: string]: Function }`

    Регистрирует действия хранилища. В функции-обработчики передаётся объект `context`, с нижеперечисленными свойствами:

    ``` js
    {
      state,     // то же, что store.state, или локальный state при использовании модулей
      rootState, // то же, что store.state, только при использовании модулей
      commit,    // то же, что store.commit
      dispatch,  // то же, что store.dispatch
      getters    // то же, что store.getters
    }
    ```

    [Подробнее](actions.md)

- **getters**

  - тип: `{ [key: string]: Function }`

    Регистрирует геттеры, используемые в хранилище. Геттер-функции при вызове получают следующие аргументы:
    
    ```
    state,     // при использовании модулей — локальный state модуля
    getters,   // то же, что и store.getters
    rootState  // то же, что и store.state
    ```
    Зарегистрированные геттеры далее доступны посредством `store.getters`.

    [Подробнее](getters.md)

- **modules**

  - тип: `Object`

    Объект, содержащий подмодули для помещения в хранилище, в формате:

    ``` js
    {
      key: {
        state,
        mutations,
        actions?,
        getters?,
        modules?
      },
      ...
    }
    ```
    
    Каждый модуль может содержать `state` и `mutations`, подобно корневому хранилищу. State модуля будет прикреплёна к корневому state, используя указанный ключ. Мутации и геттеры модуля получают при вызове первым аргументом только локальный state, а не корневой. При вызове действий `context.state` аналогичным образом указывает на локальную переменную состояния модуля.

    [Подробнее](modules.md)

- **plugins**

  - тип: `Array<Function>`
  
    Массив функций-плагинов, которые будут применены к хранилищу. Плагины попросту получают хранилище в качестве единственного аргумента, и могут как отслеживать мутации (для целей сохранения исходящих данных, логирования, или отладки) или инициировать их (для входящих данных, например вебсокетов или observables).

    [Подробнее](plugins.md)

- **strict**

  - тип: `Boolean`
  - default: `false`

    Заставляет хранилище Vuex использовать strict mode. В strict mode любые изменения переменной состояния, происходящие за пределами обработчиков мутаций будут выбрасывать ошибки.

    [Подробнее](strict.md)

### Свойства Инстанса Vuex.Store

- **state**

  - тип: `Object`

    Корневое состояние. Только для чтения.

- **getters**

  - тип: `Object`

    Зарегистрированные геттеры. Только для чтения.

### Методы Инстанса Vuex.Store

- **`commit(type: string, payload?: any) | commit(mutation: Object)`**

  Запускает мутацию. [Подробнее](mutations.md)

- **`dispatch(type: string, payload?: any) | dispatch(action: Object)`**

  Инициирует действие. Возвращает то же значение, что и вызванный обработчик действия, или Promise, в случае если вызывается несколько обработчиков. [Подробнее](actions.md)

- **`replaceState(state: Object)`**

  Позволяет заменить корневое состояние хранилища. Используйте только для гидрации состояния / функционала "машины времени".

- **`watch(getter: Function, cb: Function, options?: Object)`**

  Устанавливает реактивное наблюдение за возвращаемым значением геттера, вызывая коллбэк в случае его изменения. Геттер получает единственный параметр — state хранилища. Возможно указание дополнительного объекта опций, с такими же параметрами как и у метода `vm.$watch` корневой библиотеки Vue.

  Для прекращения наблюдения, необходимо вызвать возвращённую функцию-хэндлер.

- **`subscribe(handler: Function)`**

  Подписывается на мутации хранилища. `handler` вызывается после каждой мутации и получает в качестве параметров дескриптор мутации и состояние после мутации:

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  Чаще всего используется в плагинах. [Подробнее](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module)`**

  Регистрирует динамический модуль. [Подробнее](modules.md#dynamic-module-registration)

- **`unregisterModule(path: string | Array<string>)`**

  Разрегистрирует динамический модуль. [Подробнее](modules.md#dynamic-module-registration)

- **`hotUpdate(newOptions: Object)`**

  Осуществляет горячую замену действий и мутаций. [Подробнее](hot-reload.md)

### Вспомогательные Функции для Связывания с Компонентами

- **`mapState(map: Array<string> | Object): Object`**

  Создаёт вычисляемые свойства компонента, возвращающие поддерево state'а хранилища Vuex [Подробнее](state.md#the-mapstate-helper)

- **`mapGetters(map: Array<string> | Object): Object`**

  Создаёт вычисляемые свойства компонента, проксирующие доступ к геттерам. [Подробнее](getters.md#the-mapgetters-helper)

- **`mapActions(map: Array<string> | Object): Object`**

  Создаёт методы компонента, позволяющие диспетчеризировать действия. [Подробнее](actions.md#dispatching-actions-in-components)

- **`mapMutations(map: Array<string> | Object): Object`**

  Создаёт методы компонента, позволяющие инициировать мутации. [Подробнее](mutations.md#commiting-mutations-in-components)
