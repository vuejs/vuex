# Application Structure

Vuex doesn't really restrict how you structure your code. Rather, it enforces a set of high-level principles:

1. Application-level state is centralized in the store.

2. The only way to mutate the state is by committing **mutations**, which are synchronous transactions.

3. Asynchronous logic should be encapsulated in, and can be composed with **actions**.

As long as you follow these rules, it's up to you how to structure your project. If your store file gets too big, simply start splitting the actions, mutations and getters into separate files.

For any non-trivial app, we will likely need to leverage modules. Here's an example project structure:

``` bash
├── index.html
├── main.js
├── api
│   └── ... # abstractions for making API requests
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # where we assemble modules and export the store
    ├── actions.js        # root actions
    ├── mutations.js      # root mutations
    └── modules
        ├── cart.js       # cart module
        └── products.js   # products module
```

As a reference, check out the [Shopping Cart Example](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart).

# アプリケーションの構造

Vuex は実際のところ、あなたがコードを構造化する方法を制限しません。それより高いレベルの原理原則を適用させます:

1. アプリケーションの状態は単一のオブジェクトとして、ストアで保持されます
2. 状態を変更する唯一の方法は、ストアのミューテーションをディスパッチすることです
3. ミューテーションは同期的である必要があり、それらが発生させる副作用は、状態の変更にすべきです
4. アクションを定義することで、より表現的な状態変更のAPIを公開できます。アクションはデータ取得のような非同期ロジックを隠蔽することができ、それらが起こす副作用はミューテーションのディスパッチであるべきです
5. コンポーネントはゲッターを使って、ストアから状態を取り出し、状態を変更するアクションを呼び出します

Vuex のミューテーション、アクション、ゲッターの良いところは、**それらが全てただの関数である**ということです。これらのルールに従っている限り、あなたのプロジェクトをどのように構造化するかはあなた次第です。しかし、 Vuex を利用した異なるプロジェクトにすぐに慣れることができるようにいくつかの規約があるとよいでしょう。なので、ここではアプリケーションの規模に応じて、いくつかの推奨の構造を紹介したいと思います。

### シンプルなプロジェクト

シンプルなプロジェクトに対しては、単純に**ストア**と**アクション**をそれぞれのファイルに定義することができます:

``` bash
.
├── index.html
├── main.js
├── components
│   ├── App.vue
│   └── ...
└── vuex
    ├── store.js     # ストア (初期状態とミューテーションを含む) を公開
    └── actions.js   # 全てのアクションを公開
```

実際の例として、 [Counter example](https://github.com/vuejs/vuex/tree/master/examples/counter) や [TodoMVC example](https://github.com/vuejs/vuex/tree/master/examples/todomvc) を確認してみてください。

あるいは、ミューテーションだけをそれ自身のファイルに分割することができます。

### 中規模から大規模なプロジェクト

それなりに手の込んだアプリケーションであれば、 Vuex 関連のコードをそれぞれがアプリの特定のドメインを担う複数の"モジュール"に分割したくなります(ざっくりと比べれば、普通の Flux の"stores"、 Redux の"reducers"に相当します)。各モジュールは、状態のサブツリーを管理し、サブツリーの初期状態とサブツリーで動作する全ての変更を公開します。

```bash
├── index.html
├── main.js
├── api
│   └── ... # APIリクエストを作成するための抽象化
├── components
│   ├── App.vue
│   └── ...
└── vuex
    ├── actions.js        # 全てのアクションのエクスポート
    ├── store.js          # モジュールを集め、ストアを公開する
    ├── mutation-types.js # 定数
    └── modules
        ├── cart.js       # カートのための状態とミューテーション
        └── products.js   # 商品のための状態とミューテーション
```

典型的なモジュールは次のようになります:

``` js
// vuex/modules/products.js
import {
  RECEIVE_PRODUCTS,
  ADD_TO_CART
} from '../mutation-types'

// 初期状態
const state = {
  all: []
}

// ミューテーション
const mutations = {
  [RECEIVE_PRODUCTS] (state, products) {
    state.all = products
  },

  [ADD_TO_CART] (state, productId) {
    state.all.find(p => p.id === productId).inventory--
  }
}

export default {
  state,
  mutations
}
```

そして、`vuex/store.js` では、 Vuex インスタンスを生成するために複数のモジュールをひとつに集めて整理します( "assemble" ):

```js
// vuex/store.js
import Vue from 'vue'
import Vuex from '../../../src'
// それぞれのモジュールをインポートする
import cart from './modules/cart'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  // サブモジュールを組み合わせる
  modules: {
    cart,
    products
  }
})
```

ここで、 `cart` モジュールの初期状態は、ルートステートツリーの `store.state.cart` としてアタッチされます。加えて、全てのサブモジュールで定義されたミューテーションは、それに関係したサブステートツリーを受け取ります。なので、`cart` モジュールで定義されたミューテーションは、`store.state.cart` を第一引数として受け取ることになります。

サブステートツリーのルートは、モジュール内部で自身を取りかえることはできません。例えば、次のコードは動作しません:

``` js
const mutations = {
  SOME_MUTATION (state) {
    state = { ... }
  }
}
```

代わりに、常にサブツリーのルートのプロパティに実際の状態を保存します。

``` js
const mutations = {
  SOME_MUTATION (state) {
    state.value = { ... }
  }
}
```

全てのモジュールは単純にオブジェクトと関数をエクスポートしているので、それらはかなり簡単にテストでき、メンテナンスも容易です。そして、ホットリロードできます。また、あなたの好みに合った構造を見つけるためにここで紹介したパターンを変えることは自由です。

アクションをモジュール内に置くことはできないことに注意しましょう。なぜならば、ひとつのアクションが複数のモジュールに影響を与えるミューテーションをディスパッチするかもしれないからです。また、より「関心の分離」を進めるため、状態の形やミューテーションの実装の詳細からアクションを分けることをおすすめします。もし、アクションのファイルが非常に大きくなったら、それをフォルダに移し、長い非同期アクションの実装をいくつかのファイルに分割できます。

例として、 [Shopping Cart Example](https://github.com/vuejs/vuex/tree/master/examples/shopping-cart) をみてみるとよいでしょう。
