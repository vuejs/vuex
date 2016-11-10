# State（状态）

### 单一状态树

Vuex 使用 **单一状态树** - 是的，这单个对象包含了全部的应用级状态，然后作为 "单一数据源"。这也意味着，每个引用通常只有一个 store。使用单状态树，可以简单地定位到状态的某些部分，也让我们容易保存前应用状态的快照，用来调试程序。

单状态树和模块化并不冲突 —— 我们会在后面章节讨论如何将 state 和 mutation 分散在多个子模块中。

### 在 Vue 组件中访问 Vuex 的状态

那么我们如何在 Vue 组件中展示 store 中的状态呢？因为 Vuex 存储的状态是响应式的，所以要从中"获得"状态的最简单的方式就是在 [computed property（计算属性）](http://vuejs.org/guide/computed.html) 内返回某些状态：

``` js
// 创建一个计数器组件
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

只要 `store.state.count` 发生变化，就会引起计算属性重新求值，接着触发关联的 DOM 更新。

不过，这种模式使得组件依赖了全局的 store 单例。当使用模块化工程时，需要在用到全局状态的每个组件里 import 这个 store，同时在测试组件的时候也需要模拟这个 strore。

Vuex 提供一种机制，在根组件配置 `store` 选项，则会将该 store 『注入』到根组件以及其下的所有子组件（通过 `Vue.use(Vuex)` 开启该机制）：

``` js
const app = new Vue({
  el: '#app',
  // 使用 "store" 配置项来提供 store
  // 这个 store 实例将会被注入到每个子组件
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

通过在根实例配置 `store` 选项，这个 store 就会被注入到根实例下的所有子组件，并且在子组件中通过 `this.$store` 来访问它。我们来更新一下 `计数器` 的实现：

``` js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

### `mapState` 工具

当一个组件用到 store 的多个状态属性或 getter，那么就要逐个定义这些计算属性，这是重复又繁琐的工作。为了解决这个问题，我们可以使用 `mapState` 工具，帮助我们生成计算属性 getter 方法，节省一些工作量：

``` js
// 独立发布版的工具方法会暴露为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可以让代码非常简洁
    count: state => state.count,

    // 想通过 `this` 访问本地状态，就得用一个普通的方法
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

### 对象解构操作符

要注意的是，`mapState` 返回一个对象，我们如何将它结合其他本地计算属性一起使用呢？一般来说，我们会用一个工具方法来将多个对象融合为一个对象，于是就可以将这一个对象传递到 `computed` 选项。不过，要是用上 [对象解构操作符](https://github.com/sebmarkbage/ecmascript-rest-spread)（ECMASCript 草案 stage-2 阶段）的话，就能极大的简化语法：

``` js
computed: {
  localComputed () { /* ... */ },
  // 用解构操作符，将该对象跟外面的属性混合
  ...mapState({
    // ...
  })
}
```

### 组件依然有本地状态

使用 Vuex 并不意味着你一定要把 **所有** 状态都放到 Vuex。虽然把更多的状态放到 Vuex 会让状态变化变得更明确和可调试，但是有时候会让代码变得啰嗦复杂。如果某些属性只属于某个组件，把它作为本地状态就好了。你得根据应用的开发所需作权衡取舍。
