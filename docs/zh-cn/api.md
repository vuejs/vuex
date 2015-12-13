# API

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store 构造选项

- **state**

  - type: `Object`

    Vuex 实例中 state 对象的根。

    [详细](state.md)

- **mutations**

  - type: `Object | Array<Object>`

    一个以 mutation 名为 key, mutation handler 为 value 的对象。Handler function 接受的第一个参数是 `state` 和在后面的所有 dispatch 传来的参数。

    如果传来一个对象数组，这些对象会自动合并到一个对象中。

    [详细](mutations.md)

- **actions**

  - type: `Object | Array<Object>`

    一个以 action 名为 key 的对象，value 可能为

    1. 一个 mutation 名字的 string, 或
    2. 一个函数。该函数将获取 store 实例为第一个参数，以及其他可能的 payload 参数。

    Vuex 会将他们转化为可以被调用的 action 函数，并暴露到 store 实例的 `actions` 对象上。

    如果传来一个对象数组，这些对象会自动合并到一个对象中。

    [详细](actions.md)

- **middlewares**

  - type: `Array<Object>`

    中间件对象的数组。中间件对象是这样的：

    ``` js
    {
      snapshot: Boolean, // default: false
      onInit: Function,
      onMutation: Function
    }
    ```

    所有属性都是可选的. [详细](middlewares.md)

- **strict**

  - type: `Boolean`
  - default: `false`

    使 Vuex store 实例进入严格模式。严格模式中，在 mutation handler 外部对该 store 的 state 做任何操作均会抛出错误。

    [详细](strict.md)

### Vuex.Store 实例属性

- **state**

  - type: `Object`

    根 state，只读。

- **actions**

  - type: `Object`

    可被调用的 action 函数。

### Vuex.Store 实例方法

- **dispatch(mutationName: String, ...args)**

  直接触发一个 mutation。在一些特殊情况下会需要用到这个方法，但通常来说，在组件中应当尽量通过调用 actions 来触发 mutation。

- **hotUpdate(newOptions: Object)**

  热更新 actions 和 mutations. [详细](hot-reload.md)
