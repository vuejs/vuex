# テスト

私たちが Vuex でユニットテストしたい主な部分はミューテーションとアクションです。

### ミューテーションのテスト

ミューテーションは完全に引数に依存しているだけの関数であるため、テストするのがとても簡単です。効果的なやり方として、もし ES2015 のモジュールを使っていて `store.js` ファイルの中にミューテーションがあるなら、デフォルトエクスポートに加えて、名前付きエクスポートでミューテーションをエクスポートできます。

``` js
const state = { ... }

// 名前付きエクスポートでミューテーションをエクスポートする
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Mocha + Chai を使用してミューテーションをテストする例です（あなたの好きな任意のフレームワーク/アサーションライブラリを使用できます）:

``` js
// mutations.js
export const mutations = {
  increment: state => state.count++
}
```

``` js
// mutations.spec.js
import { expect } from 'chai'
import { mutations } from './store'

// ミューテーションの分割束縛
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // ステートのモック
    const state = { count: 0 }
    // ミューテーションを適用する
    increment(state)
    // 結果を検証する
    expect(state.count).to.equal(1)
  })
})
```

### アクションのテスト
 
アクションは外部の API を呼び出す可能性があるため、ミューテーションのテストよりも少し注意が必要です。アクションをテストするとき、通常、いくつかの段階でモックを作る必要があります。例えば API 呼び出しをサービスとして抽象化し、そしてテストの内部ではそのサービスをモックにすることができます。簡単に依存関係をモック化するために、webpack と [inject-loader](https://github.com/plasticine/inject-loader) を使ってテストファイルをバンドルすることができます。

非同期なアクションのテストの例:

``` js
// actions.js
import shop from '../api/shop'

export const getAllProducts = ({ commit }) => {
  commit('REQUEST_PRODUCTS')
  shop.getProducts(products => {
    commit('RECEIVE_PRODUCTS', products)
  })
}
```

``` js
// actions.spec.js

// inline loader のために require 構文を使用する
// ここでは inject-loader を使って、モック化された依存関係を注入できるようにするモジュールファクトリーを返す
import { expect } from 'chai'
const actionsInjector = require('inject-loader!./actions')

// モックによってモジュールを作成する
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* レスポンスのモック */ ])
      }, 100)
    }
  }
})

// 期待されるミューテーションをアクションが呼び出すかをテストするためのヘルパー
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // コミットをモックする
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(type).to.equal(mutation.type)
      if (payload) {
        expect(payload).to.deep.equal(mutation.payload)
      }
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // モック化したストアと引数でアクションを呼び出す
  action({ commit, state }, payload)

  // 呼び出されるべきミューテーションが残っていないか確認する
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, null, {}, [
      { type: 'REQUEST_PRODUCTS' },
      { type: 'RECEIVE_PRODUCTS', payload: { /* レスポンスのモック */ } }
    ], done)
  })
})
```

If you have spies available in your testing environment (for example via [Sinon.JS](http://sinonjs.org/)), you can use them instead of the `testAction` helper:
 ``` js
describe('actions', () => {
  it('getAllProducts', () => {
    const commit = sinon.spy();
    const state = {};
    
    actions.getAllProducts({ commit, state });
    
    expect(dispatch.args).to.deep.equal([
      [ 'REQUEST_PRODUCTS' ],
      [ 'RECEIVE_PRODUCTS', { /* mocked response */ } ]
    ]);
  })
})
```

### ゲッターのテスト

もしゲッターが複雑な計算を行っているならば、テストコードを書く価値があります。ゲッターはミューテーションと同様の理由でテストしやすいです。

ゲッターのテストの例:

``` js
// getters.js
export const getters = {
  filteredProducts (state, { filterCategory }) {
    return state.products.filter(product => {
      return product.category === filterCategory
    })
  }
}
```

``` js
// getters.spec.js
import { expect } from 'chai'
import { getters } from './getters'

describe('getters', () => {
  it('filteredProducts', () => {
    // ステートをモックする
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // ゲッターをモックする
    const filterCategory = 'fruit'

    // ゲッターから結果を受け取る
    const result = getters.filteredProducts(state, { filterCategory })

    // 結果を検証する
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### テストの実行

ミューテーションやアクションが適切に書かれている場合は、適切にモック化された後、テストコードはブラウザの API に直接依存関係を持つことはないでしょう。したがって、単純に webpack でテストをバンドルでき、それを直接 Node で実行できます。別の方法として、本当のブラウザでテストを実行するためには `mocha-loader` または Karma + `karma-webpack` を使用できます。

#### Node での実行

以下のような webpack の設定を作成します（[`.babelrc`](https://babeljs.io/docs/usage/babelrc/) もあわせて使います）:

``` js
// webpack.config.js
module.exports = {
  entry: './test.js',
  output: {
    path: __dirname,
    filename: 'test-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
```

それから下記コマンドを実行します:

``` bash
webpack
mocha test-bundle.js
```

#### ブラウザでの実行

1. `mocha-loader` をインストールする
2. 上記 webpack 設定から `entry` を `'mocha-loader!babel-loader!./test.js'` に変更する
3. 設定を使用して `webpack-dev-server` を開始する
4. ブラウザで `localhost:8080/webpack-dev-server/test-bundle` を開く 

#### Karma + karma-webpack を使ったブラウザでの実行

[vue-loader ドキュメント](https://vue-loader.vuejs.org/ja/workflow/testing.html) 内のセットアップ方法を参考にしてください。
