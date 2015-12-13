# State

### 单状态树

Vuex 使用 **单状态树（single state tree）** —— 也就是单个对象包含整个应用的状态。这使得我们能够方便地定位某一部分特定的状态，在 debugging 的过程中也能轻易地取得当前应用的状态快照（snapshots）。

单状态树和模块化并不冲突 —— 在往后的章节里我们会讨论如何将状态管理分离到各个子模块中。

### 在 Vue 组件中获得 Vuex State

和 Vue 实例中的 `data` 对像一样，`state` 对象一旦进入 Vuex store，就会被 Vue.js 改造成响应式对象（参见 [Vue.js 响应系统](http://vuejs.org/guide/reactivity.html)）。因此，要让 Vuex store 的 state 来驱动 Vue 组件的渲染，只需要简单地在一个计算属性中返回 `store.state` 中需要的部分即可：

``` js
// 一个 Vue 组件模块内部

// 引入一个 vuex store 实例
import store from './store'

export default {
  computed: {
    message () {
      return store.state.message
    }
  }
}
```

我们并不需要建立任何监听器或者用一个 API 去建立组件和 store 之间的联系 - Vue 的响应式系统会确保界面的自动更新。唯一要记住的是，**在计算属性里，必须通过 `store.state.xxx` 引用 state**。不要在计算属性外部存放 state 的引用。

> Flux 相关：这里计算属性的用法可以和 Redux 的 [`mapStateToProps`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) 以及 NuclearJS 的 [getters](https://optimizely.github.io/nuclear-js/docs/04-getters.html) 做类比。

你可能会问为什么我们不直接用 `data` 去绑定 state，我们看以下例子：

``` js
export default {
  data () {
    return {
      message: store.state.message
    }
  }
}
```

因为 `data` 函数不追踪任何响应式依赖, 我们得到的仅仅是一个对 `store.state.message` 的静态引用。即使之后 state 被改变，组件也无法知道它的改变。而计算属性则不同，它在求值时会自动跟踪依赖，因此当状态改变时会自动触发更新。

### 组件不允许直接改变 state

使用只读的计算属性有一个好处就是，能更好的遵守 **组件不允许直接改变 store state** 的准则。由于我们希望每一次状态的变动都意图清晰且可被跟踪，因此所有的全局状态变动都必须在 store 的 mutation handlers 当中执行。

为了践行这条准则，在 [严格模式](strict.md) 中如果在 mutation handlers 外部改变 Vuex store state，Vuex 会抛出错误。

根据这条准则，我们的 Vue 组件处理的事情就很少了：它们只需要通过只读的计算属性和 store 内部的 state 建立联系，而改变 state 的唯一方法就是调用 **actions**. 组件依然能在必要时拥有和操作自己的本地状态，但我们再也不需要在组件里包含任何与全局状态相关的逻辑了。
