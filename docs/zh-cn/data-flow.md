# 数据流

为了更好地理解 Vuex app 中的数据流，我们来做一个简单的计数器 app。这个例子仅仅用于解释一些概念，实际上你并不需要在这种简单的场合使用 Vuex.

### Setup

``` js
// vuex.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

### 定义 App State

``` js
const state = {
  count: 0
}
```

### 定义会被用到的 State Mutations

``` js
const mutations = {
  INCREMENT (state) {
    state.count++
  },
  DECREMENT (state) {
    state.count--
  }
}
```

### 定义可被调用的 Actions

``` js
const actions = {
  increment: 'INCREMENT',
  decrement: 'DECREMENT'
}
```

### 创建 Vuex 实例

``` js
export default new Vuex({
  state,
  mutations,
  actions
})
```

### 在 Vue 组件里使用

**Template**

``` html
<div>
  Clicked: {{ count }} times
  <button v-on:click="increment">+</button>
  <button v-on:click="decrement">-</button>
</div>
```

**Script**

``` js
import vuex from './vuex.js'

export default {
  computed: {
    // 在 computed 属性内绑定 state
    count () {
      return vuex.state.count
    }
  },
  methods: {
    increment: vuex.actions.increment,
    decrement: vuex.actions.decrement
  }
}
```

你会注意到组件本身非常简洁：它仅仅显示了 Vuex 实例中的一些 state、在用户输入时调用了一些 vuex actions.

You will also notice the data flow is unidirectional, as it should be in Flux:

???

<p align="center">
  <img width="700px" src="vuex.png">
</p>
