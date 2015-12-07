# API

### 构造器

``` js
import Vuex from 'vuex'

const vuex = new Vuex({ ...options })
```

### 构造器 options

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

    入口 key 为 action 名的对象，value 可能为

    1. 一个 mutation 名字的 string, 或
    2. 一个 thunk action 创建函数（thunk action creator function）

    Vuex 会处理这些入口，并创建可以被调用的 action 函数，暴露到实例中的 `actions` 属性。

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

    使 Vuex 实例进入严格模式。严格模式中，在 mutation handler 外部对 Vuex state 做任何操作均会抛出错误。

    [详细](strict.md)

### 实例属性

- **state**

  - type: `Object`

    根 state，只读。

- **actions**

  - type: `Object`

    可被调用的 action 函数。

### 实例方法

- **dispatch(mutationName: String, ...args)**

  Directly dispatch a mutation. This is useful in certain situations are in general you should prefer using actions in application code.

  ???

- **hotUpdate(newOptions: Object)**

  热更新新的 actions 和 mutations. [详细](hot-reload.md)
