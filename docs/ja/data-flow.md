# データフロー

Vuex アプリケーションの内部のデータフローをよりよく理解するために、単純なカウンターアプリケーションを Vuex で作ってみましょう。これは単にコンセプトを説明するための素朴な例であるということに注意してください。実際はこのような単純なタスクに Vuex を使う必要はありません。

### ストア

``` js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// アプリケーションの初期状態
const state = {
  count: 0
}

// 発生しうるミューテーションを定義
const mutations = {
  INCREMENT (state) {
    state.count++
  },
  DECREMENT (state) {
    state.count--
  }
}

// ストアを作成
export default new Vuex.Store({
  state,
  mutations
})
```

### アクション

``` js
// actions.js
export const increment = ({ dispatch }) => dispatch('INCREMENT')
export const decrement = ({ dispatch }) => dispatch('DECREMENT')
```

### Vue とともに使う

**テンプレート**

``` html
<div id="app">
  クリック回数: {{ count }}
  <button v-on:click="increment">+</button>
  <button v-on:click="decrement">-</button>
</div>
```

**スクリプト**

``` js
// これがルートの Vue インスタンスなので、ストアをインポートし、挿入しています
// 大きなアプリケーションであれば、これは一度だけ行います
import store from './store'
import { increment, decrement } from './actions'

const app = new Vue({
  el: '#app',
  store,
  vuex: {
    getters: {
      count: state => state.count
    },
    actions: {
      increment,
      decrement
    }
  }
})
```

ここで、あなたはコンポーネントそれ自身はとても単純であることに気がつくでしょう。コンポーネントはただ Vuex ストアからのステートを表示し（コンポーネントは自身のデータを持っていません）、そして、ユーザーからの入力イベントに応じてストアのアクションを呼び出すだけになっています。

そしてまた、 Flux のようにデータフローが一方向であることにも気がつくでしょう。

1. コンポーネント内でのユーザーの入力はアクションの呼び出しをトリガし、
2. アクションはステートを更新するためにミューテーションをディスパッチし、
3. ストア内部でのステートの更新はゲッターを通してコンポーネントへ反映されます。

<p align="center">
  <img width="700px" src="vuex.png">
</p>
