# API 参考

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store 构造器选项

- **state**

  - 类型: `Object | Function`

    Vuex store 实例的根 state 对象。[详细介绍](state.md)

    如果你传入返回一个对象的函数，其返回的对象会被用做根 state。这在你想要重用 state 对象，尤其是重用 module 来说非常有用。[详细介绍](modules.md#模块重用)

- **mutations**

  - 类型: `{ [type: string]: Function }`

    在 store 上注册 mutation，处理函数总是接受 `state` 作为第一个参数（如果定义在模块中，则为模块的局部状态），`payload` 作为第二个参数（可选）。

    [详细介绍](mutations.md)

- **actions**

  - 类型: `{ [type: string]: Function }`

    在 store 上注册 action。处理函数总是接受 `context` 作为第一个参数，`payload` 作为第二个参数（可选）。

    `context` 对象包含以下属性：

    ``` js
    {
      state,     // 等同于 store.state, 若在模块中则为局部状态
      rootState, // 等同于 store.state, 只存在于模块中
      commit,    // 等同于 store.commit
      dispatch,  // 等同于 store.dispatch
      getters    // 等同于 store.getters
    }
    ```

    [详细介绍](actions.md)

- **getters**

  - 类型: `{ [key: string]: Function }`

  在 store 上注册 getter，getter 方法接受以下参数：

    ```
    state,     // 如果在模块中定义则为模块的局部状态
    getters,   // 等同于 store.getters
    ```

    当定义在一个模块里时会特别一些

    ```
    state,       // 如果在模块中定义则为模块的局部状态
    getters,     // 等同于 store.getters
    rootState    // 等同于 store.state
    rootGetters  // 所有 getters
    ```

    注册的 getter 暴露为 `store.getters`。

    [详细介绍](getters.md)

- **modules**

  - 类型: `Object`

    包含了子模块的对象，会被合并到 store，大概长这样：

    ``` js
    {
      key: {
        state,
        namespaced?,
        mutations,
        actions?,
        getters?,
        modules?
      },
      ...
    }
    ```

    与根模块的选项一样，每个模块也包含 `state` 和 `mutations` 选项。模块的状态使用 key 关联到 store 的根状态。模块的 mutation 和 getter 只会接收 module 的局部状态作为第一个参数，而不是根状态，并且模块 action 的 `context.state` 同样指向局部状态。

    [详细介绍](modules.md)

- **plugins**

  - 类型: `Array<Function>`

    一个数组，包含应用在 store 上的插件方法。这些插件直接接收 store 作为唯一参数，可以监听 mutation（用于外部地数据持久化、记录或调试）或者提交 mutation （用于内部数据，例如 websocket 或 某些观察者）

    [详细介绍](plugins.md)

- **strict**

  - 类型: `Boolean`
  - 默认值: `false`

    使 Vuex store 进入严格模式，在严格模式下，任何 mutation 处理函数以外修改 Vuex state 都会抛出错误。

    [详细介绍](strict.md)

### Vuex.Store 实例属性

- **state**

  - 类型: `Object`

    根状态，只读。

- **getters**

  - 类型: `Object`

    暴露出注册的 getter，只读。

### Vuex.Store 实例方法

- **`commit(type: string, payload?: any, options?: Object) | commit(mutation: Object, options?: Object)`**

  提交 mutation。`options` 里可以有 `root: true`，它允许在[命名空间模块](modules.md#命名空间)里提交根的 mutation。[详细介绍](mutations.md)

- **`dispatch(type: string, payload?: any, options?: Object) | dispatch(action: Object, options?: Object)`**

  分发 action。`options` 里可以有 `root: true`，它允许在[命名空间模块](modules.md#命名空间)里分发根的 action。返回一个解析所有被触发的 action 处理器的 Promise。[详细介绍](actions.md)

- **`replaceState(state: Object)`**

  替换 store 的根状态，仅用状态合并或时光旅行调试。

- **`watch(getter: Function, cb: Function, options?: Object)`**

  响应式地监测一个 getter 方法的返回值，当值改变时调用回调函数。Getter 接收 store 的 state 作为第一个参数，其 getter 作为第二个参数。最后接收一个可选的对象参数表示 Vue 的 `vm.$watch` 方法的参数。

  要停止监测，直接调用返回的处理函数。

- **`subscribe(handler: Function)`**

  注册监听 store 的 mutation。`handler` 会在每个 mutation 完成后调用，接收 mutation 和经过 mutation 后的状态作为参数：

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  通常用于插件。[详细介绍](plugins.md)

- **`subscribeAction(handler: Function)`**

  > 2.5.0 新增

  订阅 store 的 action。`handler` 会在每个 action 分发的时候调用并接收 action 描述和当前的 store 的 state 这两个参数：

  ``` js
  store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })
  ```

  该功能常用于插件。[详细介绍](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module, options?: Object)`**

  注册一个动态模块。[详细介绍](modules.md#模块动态注册)

  `options` 可以包含 `preserveState: true` 以允许保留之前的 state。用于服务端渲染。

- **`unregisterModule(path: string | Array<string>)`**

  卸载一个动态模块。[详细介绍](modules.md#模块动态注册)

- **`hotUpdate(newOptions: Object)`**

  热替换新的 action 和 mutation。[详细介绍](hot-reload.md)

### 组件绑定的辅助函数

- **`mapState(namespace?: string, map: Array<string> | Object): Object`**

  为组件创建计算属性以返回 Vuex store 中的状态。[详细介绍](state.md#mapstate-辅助函数)

  第一个参数是可选的，可以是一个命名空间字符串。[详细介绍](modules.md#带命名空间的绑定函数)

- **`mapGetters(namespace?: string, map: Array<string> | Object): Object`**

  为组件创建计算属性以返回 getter 的返回值。[详细介绍](getters.md#mapgetters-辅助函数)

  第一个参数是可选的，可以是一个命名空间字符串。[详细介绍](modules.md#带命名空间的绑定函数)

- **`mapActions(namespace?: string, map: Array<string> | Object): Object`**

  创建组件方法分发 action。[详细介绍](actions.md#在组件中分发-action)

  第一个参数是可选的，可以是一个命名空间字符串。[详细介绍](modules.md#带命名空间的绑定函数)

- **`mapMutations(namespace?: string, map: Array<string> | Object): Object`**

  创建组件方法提交 mutation。[详细介绍](mutations.md#在组件中提交-mutation)

  第一个参数是可选的，可以是一个命名空间字符串。[详细介绍](modules.md#带命名空间的绑定函数)

- **`createNamespacedHelpers(namespace: string): Object`**

  创建基于命名空间的组件绑定辅助函数。其返回一个包含 `mapState`、`mapGetters`、`mapActions` 和 `mapMutations` 的对象。它们都已经绑定在了给定的命名空间上。[详细介绍](modules.md#带命名空间的绑定函数)
