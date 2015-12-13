# 数据流

为了更好地理解 Vuex app 中的数据流，我们来开发一个简单的计数器 app。注意：这个例子仅仅是为了更好地解释概念，在实际情况中并不需要在这种简单的场合使用 Vuex.

### 引入并加载 Vuex

``` js
// store.js
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

### 创建 Store 实例

``` js
export default new Vuex.Store({
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
import store from './store.js'

export default {
  computed: {
    // 在 computed 属性内绑定 state
    count () {
      return store.state.count
    }
  },
  methods: {
    increment: store.actions.increment,
    decrement: store.actions.decrement
  }
}
```

你会注意到组件本身非常简单：它所做的仅仅是绑定到 state、然后在用户输入时调用 actions.

你也会发现整个应用的数据流是单向的，正如 Flux 最初所定义的那样：

<p align="center">
  <img width="700px" src="vuex.png">
</p>
