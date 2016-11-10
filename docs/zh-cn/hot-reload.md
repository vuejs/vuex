# 热加载

借助 Webpack 的 [热模块替换 API](https://webpack.github.io/docs/hot-module-replacement.html)， Vuex 支持在开发阶段热加载 mutation、module、action 和 getter。在 Browserify 中结核 [browserify-hmr](https://github.com/AgentME/browserify-hmr/) 也同样可以使用。

对于 mutation 和 module，你需要使用 `store.hotUpdate()` 方法：

``` js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import moduleA from './modules/a'

Vue.use(Vuex)

const state = { ... }

const store = new Vuex.Store({
  state,
  mutations,
  modules: {
    a: moduleA
  }
})

if (module.hot) {
  // 接受 mutation and module 为热模块
  module.hot.accept(['./mutations', './modules/a'], () => {
    // 加载更新后的模块
    // 由于 babel 6 的模块输出方式，这里必须添加 .default 
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // 换成新的 mutation 和 mudule
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

查看 [counter-hot 例子](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) 玩玩热加载。