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

然而，这种模式导致组件依赖的全局状态单例。这导致测试组件变得更麻烦，同时运行多个共享一套组件的应用实例也会变得更困难。在大型应用中，我们需要把状态从根组件『注入』到每一个子组件中。下面便是如何实现：

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

所有的 Vuex getter 函数必须是[纯函数](https://en.wikipedia.org/wiki/Pure_function)（译注：在我之前还没有中文 wiki，简单来讲就是 1.计算完全依赖函数输入值，而非其他隐藏信息，若输入相同，则输出也必须相同 2. 该函数不能有语义上可观察的[函数副作用](https://zh.wikipedia.org/wiki/%E5%87%BD%E6%95%B0%E5%89%AF%E4%BD%9C%E7%94%A8)，如“触发事件”，“其他形式的输出”等。） —— 它们取值只依赖传入的状态树。这让组件的测试和编组更容易且更高效。这也意味着：**在 getter 里你不能依赖 `this` 关键字**。

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

显而易见，`filteredMessages` getter 可能在多个组件中都很有用。这种情况下，让多组件共享相同的 getter 会是个好主意：

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

因为 getter 函数都是纯函数，被多个组件共享的 getter 被高效地缓存起来了：当依赖状态发生改变的时候，该 getter 也仅仅只重新计算一次，便可供所有组件使用。

> 与 Flux 的对比参考：Vuex 的 getter 函数可以大致类比成 Redux 中的 [`mapStateToProps`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)。然而, 由于其内部运用了 Vue 的计算属性[记忆化](https://en.wikipedia.org/wiki/Memoization)机制，它要比 `mapStateToProps` 更加高效，且更近似于 ReactJs 的 [reselect](https://github.com/reactjs/reselect)。

### 组件不允许直接修改 store 实例的状态

请始终记得非常重要的这点，就是：**组件永远都不应该直接改变 Vuex store 的状态**。因为我们想要让状态的每次改变都很明确且可追踪，Vuex 状态的所有改变都必须在 store 的 mutation handler (变更句柄)中管理。

为了强化该规则，在开启([严格模式(Strict Mode)](strict.md))时，若有 store 的状态在 mutation 句柄外被修改，Vuex 就会报错。

现在有了这一规则，我们 Vue 组件的职能就少了很多：他们通过只读的 getter 与 Vuex store 的状态相绑定，组件唯一能影响全局状态的方法就是想办法触发 **mutations**（我们接下来会谈到）。若有必要，组件仍然能够处理和操作本地状态，但是我们不再在单独的组件中放置任何数据请求或全局状态变更的逻辑。这些操作全部都集中于 Vuex 相关的文件中，这样能让大型应用变得更容易理解和维护。
