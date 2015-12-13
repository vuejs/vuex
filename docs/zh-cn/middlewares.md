# 中间件

Vuex store 可以接受 `middlewares` 选项来加载中间件。中间件在每一个 mutation 被触发后会调用响应的勾子函数（注意这和 Redux 的中间件概念完全没有关系）。一个 Vuex 中间件即是一个包含一些勾子函数的简单对象：

``` js
const myMiddleware = {
  onInit (state) {
    // 记录初始 state
  },
  onMutation (mutation, state) {
    // 每个 mutation 后会被调用
    // mutation 参数的格式为 { type, payload }
  }
}
```

使用方式如下：

``` js
const store = new Vuex.Store({
  // ...
  middlewares: [myMiddleware]
})
```

一个中间件默认会接受到原本的 `state` 对象，但中间件通常用于 debugging 或是数据持久化, 它们是 **不允许改变 state 的。**

有时候我们可能会想要在中间件中获得 state 的快照（snapshots），用来比较 mutation 前后的 state。这样的中间件必须定义 `snapshot: true` 选项：

``` js
const myMiddlewareWithSnapshot = {
  snapshot: true,
  onMutation (mutation, nextState, prevState) {
    // nextState 和 prevState 分别为 mutation 触发前
    // 和触发后对原 state 对象的深拷贝
  }
}
```

**可以获得快照的中间件只应在开发环境下使用**。使用 Webpack 或 Browserify 时，我们可以让工具来帮我们处理这个问题：

``` js
const store = new Vuex.Store({
  // ...
  middlewares: process.env.NODE_ENV !== 'production'
    ? [myMiddlewareWithSnapshot]
    : []
})
```

在开发环境中，中间件默认会被使用。在最终的生产环境下，请根据 [这里提供的配置](http://vuejs.org/guide/application.html#Deploying_for_Production) 把 `process.env.NODE_ENV !== 'production'` 替换为 `false`。

### 内置的 logger 中间件

Vuex 有个自带的 logger 中间件用于 debugging:

``` js
const store = new Vuex.Store({
  middlewares: [Vuex.createLogger()]
})
```

`createLogger` 函数有这几个 options:

``` js
const logger = Vuex.createLogger({
  collapsed: false, // 自动展开输出的 mutations
  transformer (state) {
    // 输出前对 state 进行转换
    // 比如说只返回一个 sub-tree
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutations 会格式化为 { type, payload } 输出
    // 我们可以按照自己的需求格式化成任何我们想要的结构
    return mutation.type
  }
})
```

注意这个 logger 中间件会得到 state 快照，所以只能用于开发环境。
