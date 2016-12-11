# 핫 리로딩

Vuex supports hot-reloading mutations, modules, actions and getters during development, using Webpack's [Hot Module Replacement API](https://webpack.github.io/docs/hot-module-replacement.html). You can also use it in Browserify with the [browserify-hmr](https://github.com/AgentME/browserify-hmr/) plugin.

변이와 모듈의 경우, `store.hotUpdate()` API 메소드를 사용할 필요가 있습니다.

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
  // 액션과 변이를 핫 모듈로 받아 들인다.
  module.hot.accept(['./mutations', './modules/a'], () => {
    // 업데이트 된 모듈은 babel 6 모듈 출력으로 인해
    // .default를 여기에 추가해야합니다.
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // 새로운 액션과 변이로 바꿉니다.
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

[counter-hot 예제](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot)로 핫 리로드를 확인하십시오.
