# Hot Reloading

Vuex hỗ trợ hot-reloading mutations, modules, actions và getters trong suốt quá trình phát triển ứng dụng với tính năng [Hot Module Replacement API](https://webpack.js.org/guides/hot-module-replacement/) của Webpack. Nếu bạn build bằng Browserify thay vì webpack, plugin [browserify-hmr](https://github.com/AgentME/browserify-hmr/) cũng có thể giúp bạn sử dụng tính năng HMR y hệt Webpack.

Với mutations và modules, bạn cần phải gọi phương thức `store.hotUpdate()`:

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
  // accept actions and mutations as hot modules
  module.hot.accept(['./mutations', './modules/a'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // swap in the new actions and mutations
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

Xem thêm [ví dụ counter-hot](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) để hiểu thêm cách sử dụng hot-reload.
