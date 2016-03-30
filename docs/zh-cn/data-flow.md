# 数据流

为了更好地理解 Vuex app 中的数据流，我们来开发一个简单的计数器 app。注意：这个例子仅仅是为了更好地解释概念，在实际情况中并不需要在这种简单的场合使用 Vuex.

### Store

``` js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 应用初始状态
const state = {
  count: 0
}

// 定义所需的 mutations
const mutations = {
  INCREMENT (state) {
    state.count++
  },
  DECREMENT (state) {
    state.count--
  }
}

// 创建 store 实例
export default new Vuex.Store({
  state,
  mutations
})
```

### Actions

``` js
// actions.js
export const increment = ({ dispatch }) => dispatch('INCREMENT')
export const decrement = ({ dispatch }) => dispatch('DECREMENT')
```

### 在 Vue 组件里使用

**模板**

``` html
<div>
  Clicked: {{ count }} times
  <button v-on:click="increment">+</button>
  <button v-on:click="decrement">-</button>
</div>
```

**代码**

``` js
// 仅需要在根组件中注入 store 实例一次即可
import store from './store'
import { increment, decrement } from './actions'

const app = new Vue({
  el: '#app',
  store,
  vuex: {
    getters: {
      count: state => state.count
    },
    actions: {
      increment,
      decrement
    }
  }
})
```

你会注意到组件本身非常简单：它所做的仅仅是绑定到 state、然后在用户输入时调用 actions。

你也会发现整个应用的数据流是单向的，正如 Flux 最初所定义的那样：

1. 用户在组件中的输入操作触发 action 调用；
2. Actions 通过分发 mutations 来修改 store 实例的状态；
3. Store 实例的状态变化反过来又通过 getters 被组件获知。

<p align="center">
  <img width="700px" src="vuex.png">
</p>
