# アプリケーションの構造

Vuex は本当にあなたのコードを構造化する方法を制限するものでありません。むしろ以下の見解が求められます:

1. アプリケーションステートは単一オブジェクトで生存します
2. ミューテーションハンドラだけステートを変異できます
3. ミューテーションは同期でなければなく、そしてそれらを作成するだけの副作用はミューテーションとステートになるべきです
4. データフェッチングのような全ての非同期ロジックはアクションで実行されるべきです

Vuex のアクションとミューテーションの良いところは、**それらは関数である**ということです。これらのルールに従っている限り、あなたのプロジェクトで構造化する方法はあなた次第です。最も単純な Vuex インスタンスは[単一ファイルで](https://github.com/vuejs/vuex/blob/master/examples/counter/vuex.js)さえ宣言できるということです！しかしながら、これは任意の重大なプロジェクトに対しては十分ではなく、ここではあなたのアプリケーションの規模に応じて、いくつか推奨される構造を紹介します。

### 単純なプロジェクト

単純なプロジェクトに対しては、単純に**アクション**と**ミューテーション**をそれぞれのファイルに分離することができます:

``` bash
.
├── index.html
├── main.js
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js     # vuex store をエクスポート
    ├── actions.js   # 全てのアクションをエクスポート
    └── mutations.js # 全てのミューテーションをエクスポート
```

実際の例として、[TodoMVC example](https://github.com/vuejs/vuex/tree/master/examples/todomvc) を確認してください。

### 中〜大規模プロジェクト

任意の素晴らしいアプリケーションに対して、多分、Vuex 関連のコードをさらに私たちのアプリケーションを特定のドメインによって各お気に入りの複数"モジュール" (雑にいうと、純粋な Flux で "stores" にほぼ匹敵)に分離したいです。各サブモジュールはステートのサブツリーを管理することになり、そのサブツリーとそのサブツリーで操作する全てのミューテーションに対する初期ステートをエクスポートします:

``` bash
├── index.html
├── main.js
├── api
│   └── ... # API リクエストを作成するために抽象化
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── actions.js # 全てのアクションをエクスポート
    ├── index.js
    ├── modules
    │   ├── cart.js       # ステートとカート向けのミューテーション
    │   └── products.js   # ステートと製品向けのミューテーション
    └── mutation-types.js # 定数
```

典型的なモジュールは次のようになります:

``` js
// vuex/modules/products.js
import { RECEIVE_PRODUCTS, ADD_TO_CART } from '../mutation-types'

// 初期ステート
export const productsInitialState = []

// ミューテーション
export const productsMutations = {
  [RECEIVE_PRODUCTS] (state, products) {
    state.products = products
  },

  [ADD_TO_CART] ({ products }, productId) {
    const product = products.find(p => p.id === productId)
    if (product.inventory > 0) {
      product.inventory--
    }
  }
}
```

そして `store/index.js` では、Vuex インスタンスを作成するために複数のモジュールをいっしょに"組み立てます(assemble)":

``` js
import Vue from 'vue'
import Vuex from '../../../src'
import * as actions from './actions'
// modules からパーツをインポート
import { cartInitialState, cartMutations } from './modules/cart'
import { productsInitialState, productsMutations } from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  // ...
  // root なステートにサブツリーを結合
  state: {
    cart: cartInitialState,
    products: productsInitialState
  },
  // ミューテーションは複数の modules から
  // ミューテーション定義オブジェクトの配列にすることが可能
  mutations: [cartMutations, productsMutations]
})
```

全てのモジュールは単純にオブジェクトと関数をエクスポートするため、テストとメンテナンスすることが非常に簡単です。また、あなたの好みに合った構造を見つけるためにここで使用されるパターンを変えることは自由です。

単一のアクションは、複数のモジュールに影響を与えるミューテーションをディスパッチする可能性があるため、モジュールにアクションを置いていないことに注意してください。また、ステートの形式と、より良い関心事の分離のためにミューテーションの実装詳細からアクションを分離するもの良いアイデアです。アクションファイルが大きくなりすぎた場合は、フォルダにそれを格納し、個々のファイルへ長い非同期アクションの実装を分割できます。

実際の例として、[Shopping Cart Example](https://github.com/vuejs/vuex/tree/master/examples/shopping-cart) を確認してください。

### 共有された算出プロパティ Getter の抽出

大規模なプロジェクトでは、複数のコンポーネントが Vuex のステートに基づいて同じ算出プロパティ (computed property) を必要とする可能性があります。算出プロパティは単に関数であるため、それらが任意のコンポーネントで共有することができるように、ファイルにそれらを分割することができます:

``` js
// getters.js
import store from './store'

export function filteredTodos () {
  return store.state.messages.filter(message => {
    return message.threadID === store.state.currentThreadID
  })
}
```

``` js
// コンポーネントで...
import { filteredTodos } from './getters'

export default {
  computed: {
    filteredTodos
  }
}
```

これはとても [NuclearJS での Getter](https://optimizely.github.io/nuclear-js/docs/04-getters.html) と似ています。
