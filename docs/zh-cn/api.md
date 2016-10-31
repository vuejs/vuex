# API

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store 构造器选项

- **state**

  - 类型: `Object`

    Vuex store 的根 state 对象

    [详细](state.md)

- **mutations**

  - 类型: `{ [type: string]: Function }`

    在 store 中注册 mutations。 Handler function 永远接受 state 为第一个参数（如果是在模块中定义，则为模块内部 `state`）， 如果存在 `payload` 则以 `payload` 作为第二个参数。

    [详细](mutations.md)

- **actions**

  - 类型: `{ [type: string]: Function }`

    在 store 中注册 actions。 Handler function 接收一个具有以下属性的 `context` 对象：

    ``` js
    {
      state,     // 等同于 store.state，或者是模块内部 state
      rootState, // 等同于 store.state，只存在于模块中
      commit,    // 等同于 store.commit
      dispatch,  // 等同于 store.dispatch
      getters    // 等同于 store.getters
    }
    ```

    [详细](actions.md)

- **getters**

  - 类型: `{ [key: string]: Function }`

    在 store 中注册 getters。getter 函数接收以下参数：
    
    ```
    state,     // 如果在模块中定义，则是模块内部state
    getters,   // 等同于 store.getters
    rootState  // 等同于 store.state
    ```
    已经注册的 getters 会显示在 `store.getters`。

    [详细](getters.md)

- **modules**

  - 类型: `Object`

    一个会被合并到 store 中包含子模块的对象，形如：

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

    每个模块都可以包含与根选项类似的 state 和 mutations。模块的状态会被以模块的 key 附加到 Vuex 实例的根状态中。模块的 mutations 只接受此模块的状态作为第一个参数而不是整个根状态。同时模块 actions 的 `context.state` 也指向模块内部 state。

    [详细](modules.md)

- **plugins**

  - 类型: `Array<Function>`

    注册一系列的插件到 store。 插件只接收 store 作为唯一的参数，同时可以监听 mutations 变化(作用于出站数据持久化, 日志记录, 排除故障) 或者触发 mutations 变化(作用于入站数据 例如 websockets 或者 observables).

    [详细](plugins.md)

- **strict**

  - 类型: `Boolean`
  - 默认: `false`

    强制 Vuex store 实例进入严格模式。在严格模式中任何在 mutation handler 外部对该 store 的 state 做出的修改均会抛出异常。

    [详细](strict.md)

### Vuex.Store 实例属性

- **state**

  - 类型: `Object`

    根 state。只读。

- **getters**

  - 类型: `Object`

    已经注册的 getters。 只读。

### Vuex.Store 实例方法

- **`commit(type: string, payload?: any) | commit(mutation: Object)`**

  执行变化。 [详细](mutations.md)

- **`dispatch(type: string, payload?: any) | dispatch(action: Object)`**

  触发一个 action。返回动作处理器返回的值，或者当多个处理器触发的时候，返回一个 Promise [详细](actions.md)

- **`replaceState(state: Object)`**

  替换 store 的根 state. 仅在时间穿梭或者流程化的时候使用

- **`watch(getter: Function, cb: Function, options?: Object)`**

  监听 getter 的值, 当值改变的时候执行回调函数。getter 函数接收 store's state 作为唯一的参数。 接受与 vm.$watch 方法相同的配置选项作为可选参数。

  执行返回的 handle function 结束监听

- **`subscribe(handler: Function)`**

  订阅 store mutations 变化。`handler` 函数会在每次变化并且接收到变化描述之后执行， 将变化后的状态作为参数:

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  通常在插件中使用 [详细](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module)`**

  注册动态模块 [详细](modules.md#dynamic-module-registration)

- **`unregisterModule(path: string | Array<string>)`**

  注销动态模块 [详细](modules.md#dynamic-module-registration)

- **`hotUpdate(newOptions: Object)`**

  热更新 actions 和 mutations. [详细](hot-reload.md)
