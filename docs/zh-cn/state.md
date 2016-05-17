# State 和 Getters

### 单一状态树

Vuex 使用 **单一状态树** —— 是的，用一个对象就包含了全部的应用层级状态。至此它便作为一个『唯一数据源([SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth))』而存在。这也意味着，每个应用将仅仅包含一个 store 实例。单状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。

单状态树和模块化并不冲突 —— 在后面的章节里我们会讨论如何将状态和状态变更事件分布到各个子模块中。

### 在 Vue 组件中获得 Vuex 状态

那么我们如何在 Vue 组件中展示状态呢？由于 Vuex 的状态存储是响应式的，从 store 实例中读取状态最简单的方法就是在计算属性 [computed property](http://vuejs.org.cn/guide/computed.html) 中返回某个状态：

``` js
// 在某个 Vue 组件的定义对象里
computed: {
  count: function () {
    return store.state.count
  }
}
```

每当 `store.state.count` 变化的时候, 都会重新求取计算属性，并且触发更新相关联的 DOM。

然而，这种模式导致组件依赖的全局状态单利。这导致测试组件变得更麻烦，同时运行多个共享一套组件的应用实例也会变得更困难。在大型应用中，我们需要把状态从根组件『注入』到每一个子组件中。下面便是如何实现：

1. 安装 Vuex 并且将您的根组件引入 store 实例：

  ``` js
  import Vue from 'vue'
  import Vuex from 'vuex'
  import store from './store'
  import MyComponent from './MyComponent'

  // 关键点，教 Vue 组件如何处理与 Vuex 相关的选项
  Vue.use(Vuex)

  var app = new Vue({
    el: '#app',
    // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
    store, // 译注：简写，等效于 store: store
    components: {
      MyComponent
    }
  })
  ```

  通过在根实例中注册 `store` 选项，该 store 实例会注入到根组件下的所有子组件中，且子组件能通过 `this.$store` 访问到。不过事实上，我们几乎不会需要直接引用它。

2. 在子组件中，通过在 `vuex.getters` 选项里定义的 **getter** 方法来读取状态：

  ``` js
  // MyComponent.js
  export default {
    template: '...',
    data () { ... },
    // 此处为我们从 store 实例中取回状态的位置
    vuex: {
      getters: {
        // 该 getter 函数将会把仓库的 `store.state.count` 绑定为组件的 `this.count`
        count: function (state) {
          return state.count
        }
      }
    }
  }
  ```

  请留意 `vuex` 的这个特殊选项（译注：getters 子对象）。它是我们指定当前组件能从 store 里获取哪些状态信息的地方。它的每个属性名将对应一个 getter 函数。该函数仅接收 store 的整个状态树作为其唯一参数，之后既可以返回状态树的一部分，也可以返回从状态树中求取的计算值。而返回结果，则会依据这个 getter 的属性名添加到组件上，用法与组件自身的*计算属性*一毛一样。

  大多数时候，“getter” 函数可以用 ES2015 的箭头函数方法实现得非常简洁：

  ``` js
  vuex: {
    getters: {
      count: state => state.count
    }
  }
  ```

### Getter 函数必须是纯函数

所有的 Vuex getter 函数必须是[纯函数](https://en.wikipedia.org/wiki/Pure_function)（译注：在我之前还没有中文 wiki，简单来讲就是 1.计算完全依赖函数输入值，而非其他隐藏信息，若输入相同，则输出也必须相同 2. 该函数不能有语义上可观察的[函数副作用](https://zh.wikipedia.org/wiki/%E5%87%BD%E6%95%B0%E5%89%AF%E4%BD%9C%E7%94%A8)，如“触发事件”，“其他形式的输出”等。） —— 它们取值只依赖传入的状态树。这让组件更容易测试、编组且更高效。这也意味着：**在 getter 里你不能依赖 `this`**。

如果你确实需要使用 `this`，例如需要用到组件内部的本地状态来计算些派生属性，那么你需要另外单开一个计算属性：


``` js
vuex: {
  getters: {
    currentId: state => state.currentId
  }
},
computed: {
  isCurrent () {
    return this.id === this.currentId
  }
}
```

### getter 函数可以返回派生状态

Vuex 状态的 getters 内部其实就是计算属性，这就意味着你能够以响应式的方式（并且更高效）地计算派生属性。举个例子，比如我们有一个包含全部消息的 `messages` 数组，和一个代表用户当前打开帖子的 `currentThreadID` 索引。而我们想仅向用户显示属于当前帖子的信息，一个过滤后的列表：

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

因为 Vue.js 计算属性是自动缓存的，且仅在对应的依赖发生改变时才会重新计算，所以你不必担心 getter 函数会在每次状态变更事件触发时都被频繁的调用。

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
