# テスト

ミューテーションは完全に引数に依存しているだけの関数であるため、テストするのがとても簡単です。アクションは外部の API を呼び出す可能性があるためより少し注意が必要です。アクションをテストするとき、通常モックのいくつかのレベルで実行する必要があります。例えば、サービスでの API 呼び出しを抽象化することができ、そしてテスト内部でサービスをモックにすることができます。簡単に依存を真似るために、Webpack と [inject-loader](https://github.com/plasticine/inject-loader) をテストファイルにバンドルして使用することができます。

ミューテーションやアクションが適切に書かれている場合は、テストは適切なモック後、ブラウザの API に直接依存関係を持つべきではありません。したがって、単純に Webpack でテストをバンドルでき、それを直接 Node で実行できます。別の方法として、本当のブラウザでテストを実行するためには、`mocha-loader` または Karma + `karma-webpack` を使用できます。

Mocha + Chai を使用してミューテーションをテストする例です (好きな任意のフレームワーク/アサーションライブラリを使用できます):

``` js
// mutations.js
export const INCREMENT = state => state.count++
```

``` js
// mutations.spec.js
import { expect } from 'chai'
import { INCREMENT } from './mutations'

describe('mutations', () => {
  it('INCREMENT', () => {
    // モックステート
    const state = { count: 0 }
    // ミューテーションを適用
    INCREMENT(state)
    // 結果を検証
    expect(state.count).to.equal(1)
  })
})
```

Example testing an async action:

``` js
// actions.js
import shop from '../api/shop'

export const getAllProducts = ({ dispatch }) => {
  dispatch('REQUEST_PRODUCTS')
  shop.getProducts(products => {
    dispatch('RECEIVE_PRODUCTS', products)
  })
}
```

``` js
// actions.spec.js

// inline loader に対して require 構文を使用する
// inject-loader は、真似られた依存関係を注入できるようにする
// モジュールファクトリを返す
import { expect } from 'chai'
const actionsInjector = require('inject!./actions')

// モックによってモジュールを作成する
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* 真似られたスポンス */ ])
      }, 100)
    }
  }
})

// ミューテーションによって予期されたアクションをテストするためのヘルパー
const testAction = (action, state, expectedMutations, done) => {
  let count = 0
  // モックディスパッチ
  const dispatch = (name, payload) => {
    const mutation = expectedMutations[count]
    expect(mutation.name).to.equal(name)
    if (payload) {
      expect(mutation.payload).to.deep.equal(payload)
    }
    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }
  // 真似られた store によってアクションを呼び出す
  action({
    dispatch,
    state
  })
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, {}, [
      { name: 'REQUEST_PRODUCTS' },
      { name: 'RECEIVE_PRODUCTS', payload: [ /* 真似られたレスポンス */ ] }
    ], done)
  })
})
```

### Node での実行

以下のような webpack の設定を作成します:

``` js
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
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  },
  babel: {
    presets: ['es2015']
  }
}
```

その後、下記コマンドを実行します:

``` bash
webpack
mocha test-bundle.js
```

### ブラウザでの実行

1. `mocha-loader` をインストール
2. 上記 Webpack 設定から `entry` を `'mocha!babel!./test.js'` に変更
3. 設定を使用して `webpack-dev-server` を開始
4. `localhost:8080/webpack-dev-server/test-bundle` に移動
