# API 指南

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store 构造选项

- **state**

  - 类型： `Object`

    Vuex store 的根状态对象。

    [详细介绍](state.md)

- **mutations**

  - 类型： `{ [类型： string]: Function }`

    在 store 上注册 mutation，处理器方法总是接收 `state` 作为第一个参数（如果定义在模块中，则作为模块的本地状态），如果有则接收 `payload` 作为第二个参数。

    [详细介绍](mutations.md)

- **actions**

  - 类型： `{ [类型： string]: Function }`

    在 store 上注册 action。处理器方法接收一个 `context` 对象，提供以下属性：

    ``` js
    {
      state,     // 等同于 store.state，如果在模块中则是本地状态
      rootState, // 等同于 store.state，模块中才有
      commit,    // 等同于 store.commit
      dispatch,  // 等同于 store.dispatch
      getters    // 等同于 store.getters
    }
    ```

    [详细介绍](actions.md)

- **getters**

  - 类型： `{ [key: string]: Function }`

    在 store 上注册 getter，getter 方法接收以下参数：
    
    ```
    state,     // 如果在模块中定义则为模块的本地状态
    getters,   // 等同于 store.getters
    rootState  // 等同于 store.state
    ```
    注册的 getter 暴露在 `store.getters`。

    [详细介绍](getters.md)

- **modules**

  - 类型： `Object`

    包含了子模块的对象，会被融合到  store，大概长这样：

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

    就像根模块的配置，每个模块包含 `state` 和 `mutations`，模块的状态使用模块的 key 关联到 store 的根状态。模块的 mutation 和 getter 将接收 module 的本地状态作为第一个参数，而不是根状态，并且模块 action 的 `context.state` 同样指向本地状态。

    [详细介绍](modules.md)

- **plugins**

  - 类型： `Array<Function>`

    一个数组，包含应用在 store 上的插件方法。这些插件直接接收 store 作为唯一参数，可以监听 mutation（用于外部地数据持久化、记录或调试）或者提交 mutation （用于内部数据，例如 websocket 或 某些观察者）

    [详细介绍](plugins.md)

- **strict**

  - 类型： `Boolean`
  - 默认值： `false`

    强制 Vuex store 进入严格模式，在严格模式下，在 mutation 处理器以外修改 Vuex state 则会抛出错误。

    [详细介绍](strict.md)

### Vuex.Store 实例属性

- **state**

  - 类型： `Object`

    根状态，只读。

- **getters**

  - 类型： `Object`

    暴露注册的 getter，只读。

### Vuex.Store 实例方法

- **`commit(类型： string, payload?: any) | commit(mutation: Object)`**

  提交一个 mutation. [详细介绍](mutations.md)

- **`dispatch(类型： string, payload?: any) | dispatch(action: Object)`**

  分发一个 action。返回 action 方法的返回值，如果多个处理器被触发，那么返回一个 Pormise。

- **`replaceState(state: Object)`**

  替换 store 的根状态，仅用于调试 state。

- **`watch(getter: Function, cb: Function, options?: Object)`**

  响应式的监测一个 getter 方法的返回值，当值改变时调用回调。getter 接收 store 的状态作为唯一参数。接收一个可选的对象参数表示 Vue 的 `vm.$watch` 方法的参数。

  要停止检测，调用该方法的返回值 （watch 的返回值是个方法）。

- **`subscribe(handler: Function)`**

  订阅（注册监听） store 的 mutation。`handler` 会再每个 mutation 完成后调用，接收  mutation 的描述对象和 经过 mutation 后的状态作为参数：

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  这是插件中常见的用法。 [详细介绍](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module)`**

  动态注册一个模块。 [详细介绍](modules.md#dynamic-module-registration)

- **`unregisterModule(path: string | Array<string>)`**

  移除一个注册的模块。 [详细介绍](modules.md#dynamic-module-registration)

- **`hotUpdate(newOptions: Object)`**

  热替换新的 action 和 mutation。 [详细介绍](hot-reload.md)
