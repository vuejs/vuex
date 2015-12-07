# State

### 单状态树

Vuex 使用 **单状态树（single state tree）** —— 也就是单个对象包含整个应用的 state。这使得我们在 debugging 的过程中能直接定位相关的 state，快速地取得当前应用的 state 快照（snapshots）。

单状态树和模块化不冲突——在往后的章节里我们会讨论如何将状态管理分离到各个子模块中。

### 在 Vue 组件中获得 Vuex State

和 Vue 实例中的 `data` 对像一样，`state` 对象一旦进入 Vuex 实例，就会变成响应的（powered by [Vue.js 响应系统](http://vuejs.org/guide/reactivity.html)）。也就是说，要将 Vuex state 和 Vue 组件联系在一起，只需要简单地将前者返回给后者的 computed 属性。

``` js
// 一个 Vue 组件模块内部

// 引入一个 vuex 实例
import vuex from './vuex'

export default {
  computed: {
    message () {
      return vuex.state.message
    }
  }
}
```

不需要建立任何监听器或者建立组件和 store 之间的联系，你唯一要记住的是，**在 computed 属性里，必须通过 `vuex.state.xxx` 引用 state**。不能在 computed 属性外部存放 state 的引用。

> Flux reference: this can be roughly compared to [`mapStateToProps`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) in Redux and [getters](https://optimizely.github.io/nuclear-js/docs/04-getters.html) in NuclearJS.

你会问为什么我们不直接用 `data` 去绑定 vuex state，我们看以下例子：

``` js
export default {
  data () {
    return {
      message: vuex.state.message
    }
  }
}
```

因为 `data` 函数不追踪任何 reactive dependencies, 仅仅是一个对 `vuex.state.message` 的静态引用。即使之后 Vuex state 被改变，组件也无法知道它的改变。而 computed 属性不同，它在 state 改变的时候会跟踪所有 reactive dependencies。

### 组件不允许直接改变 state

使用只读的 computed 属性有一个好处就是，能更好的遵守 **组件永远不能直接改变 Vuex state** 的准则。由于我们希望每一个 state 都意图清晰且可被跟踪，所有的 vuex state mutations 都必须在 vuex mutation handlers 当中。

为了践行这条准则，当你在 [Debug 模式](debug.md) 中在 mutation handlers 外部改变 Vuex state 时，Vuex 会抛出错误。

根据这条准则，我们的 Vue 组件处理的事情就很少了：只需要通过只读的 computed 属性和 Vuex state 建立联系，改变 state 的唯一方法是调用 **actions**. 它们照样能在必要时对 state 进行操作，但我们再也不需要在组件里做任何数据获取和 state 相关的逻辑了。
