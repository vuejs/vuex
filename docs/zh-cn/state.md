# State 和 Getters

### 单状态树

Vuex 使用**单状态树** —— 也就是单个对象作为『单一数据提供源([SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth))』来管理整个应用级别的状态。这也意味着每个应用仅需一个 store 实例。单状态树使得我们能够直截了当地定位某一部分特定的状态，在调试的过程中也能轻易地取得当前应用状态的快照。

单状态树和模块化并不冲突 —— 在往后的章节里我们会讨论如何将状态管理分离到各个子模块中。

### 在 Vue 组件中获得 Vuex 状态

那么我们如何在 Vue 组件中展示状态呢？由于 Vuex 的状态存储是动态的，从 store 实例中读取状态最简单的方法就是在计算属性 [computed property](http://vuejs.org/guide/computed.html) 中返回某个状态：

``` js
// 在 Vue 组件定义时
computed: {
  count: function () {
    return store.state.count
  }
}
```

每当 `store.state.count` 变化的时候, 都会使得计算属性重新计算，并且触发相关联的 DOM 更新。

然而，这种模式导致组件依赖全局状态。这导致测试单个组件和多个实例共享一套组件变得困难。在大型应用中，我们也许需要把状态从根组件『注入』到每一个子组件中。下面便是如何实现：

1. 安装 Vuex 并且将您的根组件引入 store 实例：

  ``` js
  import Vue from 'vue'
  import Vuex from 'vuex'
  import store from './store'
  import MyComponent from './MyComponent'

  // 重要，告诉 Vue 组件如何处理 Vuex 相关的配置
  Vue.use(Vuex)

  var app = new Vue({
    el: '#app',
    // 使用 “store” 选项来配置 store 实例
    // 并会在全部的子组件中注入 store 实例
    store,
    components: {
      MyComponent
    }
  })
  ```

  通过在根实例中注册 `store` 选项，store 实例会被注入到根组件下全部的子组件中，并且可以通过 `this.$store` 获得。不过实际上我们几乎不需要直接引用它。

2. 在子组件中，在 `vuex.getters` 配置中通过 **getter** 来读取状态：

  ``` js
  // MyComponent.js
  export default {
    template: '...',
    data () { ... },
    // 这里是我们从 store 实例取回状态的位置
    vuex: {
      getters: {
        // 一个状态的 getter 函数，将会把 `store.state.count` 绑定为 `this.count`
        count: function (state) {
          return state.count
        }
      }
    }
  }
  ```

  留意特殊的 `vuex` 选项部分，在这里我们指定该组件将会从 store 实例中读取哪些状态。每个属性名对应一个 getter 函数，该函数接收整个状态树作为唯一参数并返回状态树的一部分或计算后的新值。组件可以像使用计算属性一样通过属性名获取 getter 函数的返回值。

  大多数情况下，“getter” 函数可以通过 ES2015 的箭头函数来简洁地实现：

  ``` js
  vuex: {
    getters: {
      count: state => state.count
    }
  }
  ```

### getter 函数必须是纯函数

所有的 Vuex getter 函数，必须是[纯函数](https://en.wikipedia.org/wiki/Pure_function) —— 它们只依赖传入的状态树计算出返回值。这让组件更容易测试、组合和更高效。这也意味着**在 getter 函数中不能依赖 `this`**。

如果你确实需要使用 `this`，例如为了基于组件的局部状态来计算派生属性，你需要另外单独定义一个计算属性：

``` js
vuex: {
  // getter 函数不能依赖 this
  getters: {
    currentId: state => state.currentId
  }
},
computed: {
  // 但计算属性可以通过 this 引用组件实例
  isCurrent () {
    return this.id === this.currentId
  }
}
```

### getter 函数可以返回派生状态

Vuex 状态的 getters 内部其实是计算属性，这就意味着你能够动态（并且高效）地计算派生属性。例如，下面的例子中，我们有一个包含了全部消息的 `messages` 数组，和一个代表用户当前正在浏览的消息索引的 `currentThreadID`。我们想要展示给用户一个根据当前索引过滤后的消息列表：

``` js
vuex: {
  getters: {
    filteredMessages: state => {
      return state.messages.filter(message => {
        return message.threadID === state.currentThreadID
      })
    }
  }
}
```

因为 Vue.js 计算属性是自动缓存的，且只有一个动态的依赖改变的时候才会重新计算，所以你不必担心 getter 函数会在每次状态树改变的时候被频繁调用。

### 在多组件中共享 getter 函数

正如你所见，getter 函数 `filteredMessages` 在多个组件中都很有用。这种情况下，在多组件中共享 getter 函数会是很好的办法：

``` js
// getters.js
export function filteredMessages (state) {
  return state.messages.filter(message => {
    return message.threadID === state.currentThreadID
  })
}
```

``` js
// 在组件中...
import { filteredMessages } from './getters'

export default {
  vuex: {
    getters: {
      filteredMessages
    }
  }
}
```

因为 getter 函数是纯函数，多组件共享的时候 getter 函数可以高效地缓存：当依赖状态改变的时候，在使用 getter 函数的全部组件中只重新计算一次。

> Flux 参考: Vuex 的 getter 函数可以大致类比成 Redux 中的 [`mapStateToProps`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)。然而, 由于 Vue 的计算可以缓存的计算机制，getter 函数要比 `mapStateToProps` 更加高效，因此更加和 [reselect](https://github.com/reactjs/reselect) 相似。

### 组件不允许直接修改 store 实例的状态

有一点很重要，需要注意，就是**组件永远都不应该直接修改 Vuex store 实例中的状态**。因为我们想要每个状态的改变都清晰并且可追踪，所有的 Vuex 状态改变必须在 store 实例的 mutation 中进行。

为了保持这个规则，在严格模式([Strict Mode](strict.md))下，如果 store 实例中一个状态在 mutation 外被修改，Vuex 会抛出异常。

有了这一规则，我们的 Vue 组件现在少了很多职能：这势必让 Vuex 中 store 实例变得只读，组件唯一影响 state 的方法就是触发 **mutations**（我们接下来就讨论）。必要情况下，组件仍然能够拥有和操作自己的状态，但是我们不再在独立的组件中放置任何请求数据或者改变全局状态的逻辑。这些操作全部都集中在 Vuex 相关的文件中，这样能够让大型应用更容易理解和维护。
