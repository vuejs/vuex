# API

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store 构造器选项

- **state**

  - type: `Object`

    Vuex store 实例的根 state 对象。

    [详细](state.md)

- **mutations**

  - type: `Object`

    一个以 mutation 名为 key, mutation handler 为 value 的对象。Handler function 永远接受 `state` 为第一个参数，后面紧跟着所有调用 dispatch 时传入的参数。

    [详细](mutations.md)

- **modules**

  - type: `Object`

    一个会被合并到 store 中可以包含子模块的对象，形如：

    ``` js
    {
      key: {
        state,
        mutations
      },
      ...
    }
    ```

    每个模块都可以包含与根选项类似的 `state` 和 `mutations`。模块的状态会被以模块的 key 附加到 Vuex 实例的根状态中。模块的 mutations 只接受此模块的状态作为第一个参数而不会接受整个根状态。

- **middlewares**

  - type: `Array<Object>`

    中间件对象的数组，形如：

    ``` js
    {
      snapshot: Boolean, // default: false
      onInit: Function,
      onMutation: Function
    }
    ```

    所有字段都是可选的. [详细](middlewares.md)

- **strict**

  - type: `Boolean`
  - default: `false`

    强制 Vuex store 实例进入严格模式。在严格模式中任何在 mutation handler 外部对该 store 的 state 做出的修改均会抛出异常。

    [详细](strict.md)

### Vuex.Store 实例属性

- **state**

  - type: `Object`

    根 state，只读。

### Vuex.Store 实例方法

- **dispatch(mutationName: String, ...args)**

  直接触发一个 mutation。在一些特殊情况下会需要用到这个方法，但通常来说，在组件中应当尽量通过调用 actions 来触发 mutation。

- **watch(pathOrGetter: String|Function, cb: Function, [options: Object])**

  监听一个 path 或 getter 的值，当值发生改变时触发回调。接受与 `vm.$watch` 方法相同的配置选项作为可选参数。

  执行返回的 handle function 结束监听。

- **hotUpdate(newOptions: Object)**

  热更新 actions 和 mutations. [详细](hot-reload.md)
