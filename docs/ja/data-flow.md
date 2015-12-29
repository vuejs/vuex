# データフロー

Vuex アプリケーション内部のデータフローをより理解を得るために、Vuex で単純にカウンタするアプリケーションを構築してみましょう。これは概念を説明する目的のための簡単な例であることに注意してください。実際には、このような単純なタスクのために Vuex は必要ありません。

### セットアップ

``` js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

### アプリケーションのステートを定義

``` js
const state = {
  count: 0
}
```

### ステート可能なミューテーションを定義

``` js
const mutations = {
  INCREMENT (state) {
    state.count++
  },
  DECREMENT (state) {
    state.count--
  }
}
```

### 呼び出し可能なアクションを定義

``` js
const actions = {
  increment: 'INCREMENT',
  decrement: 'DECREMENT'
}
```

### Vuex Store を作成

``` js
export default new Vuex.Store({
  state,
  mutations,
  actions
})
```

### Vue コンポーネントでの使用

**テンプレート**

``` html
<div>
  Clicked: {{ count }} times
  <button v-on:click="increment">+</button>
  <button v-on:click="decrement">-</button>
</div>
```

**スクリプト**

``` js
import store from './store.js'

export default {
  computed: {
    // 算出プロパティ(computed property) を使用してステートにバインド
    count () {
      return store.state.count
    }
  },
  methods: {
    increment: store.actions.increment,
    decrement: store.actions.decrement
  }
}
```

ここでは、コンポーネントが非常に単純であることに注意しましょう。それは単に Vuex store からいくつかのステートを表示し(データそれ自身でさえ所有しません)、そしてユーザー入力イベントでいくつかの store のアクションを呼び出します。

Flux であるような、データの流れが一方向であることに注意しましょう:

<p align="center">
  <img width="700px" src="vuex.png">
</p>
