# 핫 리로딩

Vuex는 webpack의 [핫 모듈 변경 API](https://webpack.js.org/guides/hot-module-replacement/)를 사용하여 개발 중에 핫 리로드 변이, 모듈, 액션 및 getter를 지원합니다. [browserify-hmr](https://github.com/AgentME/browserify-hmr/) 플러그인으로 Browserify에서 사용할 수도 있습니다.

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
