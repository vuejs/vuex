# ゲッター

複数のコンポーネントは、Vuex state に基づいて、同じ算出プロパティを必要とすることが可能です。算出プロパティのゲッターは単に関数で、store 経由で任意のコンポーネントで共有されることができるよう、別ファイルにそれらを分割することができます:

``` js
import Vue from 'vue'
import Vuex from '../../../src'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { /*...*/ },
  actions,
  mutations,
  getters
})
```

``` js
// getters.js
export function filteredTodos (state) {
  return state.messages.filter(message => {
    return message.threadID === state.currentThreadID
  })
}
```

``` js
// コンポーネントで ...
import { getters } from './store'
const { filteredTodos } = getters

export default {
  computed: {
    filteredTodos
  }
}
```

実際例として、[ショッピングカートの例](https://github.com/vuejs/vuex/tree/master/examples/shopping-cart) を確認してください。
ホットリロード API による実際の例として、[ホットなカウンターの例](https://github.com/vuejs/vuex/tree/master/examples/counter-hot) を確認してください。

これは [NuclearJS のゲッター](https://optimizely.github.io/nuclear-js/docs/04-getters.html)にとてもよく似ています。
