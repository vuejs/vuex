# 插件

Vuex 的 store 接收 `plugins` 选项，用来暴露每个 mutation 的钩子。一个 Vuex 的插件就是一个简单的方法，接收 sotre 作为唯一参数：

``` js
const myPlugin = store => {
  // 在 store 初始化之后调用
  store.subscribe((mutation, state) => {
    // 在每个 mutation 完成后调用
    // mutation 按照这种格式 { type, payload }。
  })
}
```

然后像这样使用：

``` js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

### 在插件中提交 Mutation

在插件中不允许直接修改状态 —— 类似于组件，只能通过提交 mutation 来触发改变。

通过提交 mutation，插件可以用来同步一个数据源到 store。例如，同步一个 websocket 数据源到 store （下面是个大概例子，实际上 `createPlugin` 方法可以获得更多选项来完成复杂任务）：

``` js
export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
```

``` js
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})
```

### 生成 State 快照

有时候插件需要获得状态『快照』，还有比较改变的前后状态。想要实现这些，你需要对状态对象进行深拷贝：

``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // 对比 prevState 和 nextState...

    // 保存状态，用于下一次 mutation
    prevState = nextState
  })
}
```

**生成状态快照的插件应该只在开发阶段使用**，使用 Webpack 或 Browserify，让构建工具帮我们处理：

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

The plugin will be used by default. For production, you will need [DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) for Webpack or [envify](https://github.com/hughsk/envify) for Browserify to convert the value of `process.env.NODE_ENV !== 'production'` to `false` for the final build.
上面插件默认会被使用，在生成发布阶段，你需要使用 Webpack 的 [DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) 或者是 Browserify 的 [envify](https://github.com/hughsk/envify) 来转换 `process.env.NODE_ENV !== 'production'` 的值为 `false`。


### 内置 Logger 插件

> 如果你正在使用 [vue-devtools](https://github.com/vuejs/vue-devtools)，你可能不需要。

Vuex 带来一个日志插件用于一般的调试:

``` js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

`createLogger` 方法有几个配置项：

``` js
const logger = createLogger({
  collapsed: false, // 自动展开记录的 mutation
  transformer (state) {
    // 在记录之前前进行转换
    // 例如，只返回指定的子树
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutation 按照这种 { type, payload } 记录
    // 我们可以按照想要的方式对个格式化
    return mutation.type
  }
})
```

日志插件还可以直接通过 `<script>` 标签引入，然后它会提供全局方法 `createVuexLogger`。

要注意，logger 插件会生成状态快照，所以仅在开发环境使用。
