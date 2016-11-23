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
 
アクションは外部の API を呼び出す可能性があるため、ミューテーションのテストよりも少し注意が必要です。アクションをテストするとき、通常、いくつかの段階でモックを作る必要があります。例えば API 呼び出しをサービスとして抽象化し、そしてテストの内部ではそのサービスをモックにすることができます。簡単に依存関係をモック化するために、Webpack と [inject-loader](https://github.com/plasticine/inject-loader) をテストファイルにバンドルして使用することができます。

非同期なアクションのテストの例:

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

// inline loader のために require 構文を使用する
// ここでは inject-loader を使って、モック化された依存関係を注入できるようにするモジュールファクトリーを返す
import { expect } from 'chai'
const actionsInjector = require('inject!./actions')

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
    expect(mutation.type).to.equal(type)
    if (payload) {
      expect(mutation.payload).to.deep.equal(payload)
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

### Testing Getters

If your getters have complicated computation, it is worth testing them. Getters are also very straightforward to test as same reason as mutations.

Example testing a getter:

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
    // mock state
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // mock getter
    const filterCategory = 'fruit'

    // get the result from the getter
    const result = getters.filteredProducts(state, { filterCategory })

    // assert the result
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### Running Tests

If your mutations and actions are written properly, the tests should have no direct dependency on Browser APIs after proper mocking. Thus you can simply bundle the tests with Webpack and run it directly in Node. Alternatively, you can use `mocha-loader` or Karma + `karma-webpack` to run the tests in real browsers.

#### Running in Node

Create the following webpack config (together with proper [`.babelrc`](https://babeljs.io/docs/usage/babelrc/)):

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
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
}
```

Then:

``` bash
webpack
mocha test-bundle.js
```

#### Running in Browser

1. Install `mocha-loader`
2. Change the `entry` from the Webpack config above to `'mocha!babel!./test.js'`.
3. Start `webpack-dev-server` using the config
4. Go to `localhost:8080/webpack-dev-server/test-bundle`.

#### Running in Browser with Karma + karma-webpack

Consult the setup in [vue-loader documentation](http://vue-loader.vuejs.org/en/workflow/testing.html).

# テスト

私達が Vuex でユニットテストしたい主な部分はミューテーションとアクションです。

### ミューテーションのテスト

ミューテーションは完全に引数に依存しているだけの関数であるため、テストするのがとても簡単です。効果的なやり方として、もし ES2015 のモジュールを使っていて、 `store.js` ファイルの中にミューテーションがあるなら、デフォルトエクスポートに加えて、名前付きエクスポートでミューテーションをエクスポートできます。

``` js
const state = { ... }

// 名前付きエクスポートでミューテーションをエクスポートする
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Mocha + Chai を使用してミューテーションをテストする例です (あなたの好きな任意のフレームワーク/アサーションライブラリを使用できます):

``` js
// mutations.js
export const INCREMENT = state => state.count++
```

``` js
// mutations.spec.js
import { expect } from 'chai'
import { mutations } from './store'

// ミューテーションの分割束縛
const { INCREMENT } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // ステートのモック
    const state = { count: 0 }
    // ミューテーションを適用
    INCREMENT(state)
    // 結果を検証
    expect(state.count).to.equal(1)
  })
})
```

### アクションのテスト

アクションは外部の API を呼び出す可能性があるためより少し注意が必要です。アクションをテストするとき、通常、いくつかの段階でモックを作る必要があります。例えば、API 呼び出しをサービスとして抽象化し、そしてテストの内部ではそのサービスをモックにすることができます。簡単に依存をモック化するために、Webpack と [inject-loader](https://github.com/plasticine/inject-loader) をテストファイルにバンドルして使用することができます。

非同期アクションのテストの例:

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

// inline loader のために require 構文を使用する
// inject-loader は、モック化された依存関係を注入できるようにする
// モジュールファクトリを返す
import { expect } from 'chai'
const actionsInjector = require('inject!./actions')

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

// アクションが期待されるミューテーションを呼び出すかをテストするためのヘルパー
const testAction = (action, args, state, expectedMutations, done) => {
  let count = 0
  // ディスパッチのモック
  const dispatch = (name, ...payload) => {
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
  // モック化したストアと引数でアクションを呼び出す
  action({dispatch, state}, ...args)

  // 呼び出されるべきミューテーションが残っていないことを確認する
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, [], {}, [
      { name: 'REQUEST_PRODUCTS' },
      { name: 'RECEIVE_PRODUCTS', payload: [ /* レスポンスのモック */ ] }
    ], done)
  })
})
```

### テストの実行

ミューテーションやアクションが適切に書かれている場合は、適切にモック化された後、テストコードはブラウザの API に直接依存関係を持つことはないでしょう。したがって、単純に Webpack でテストをバンドルでき、それを直接 Node で実行できます。別の方法として、本当のブラウザでテストを実行するためには、`mocha-loader` または Karma + `karma-webpack` を使用できます。

#### Node での実行

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

#### ブラウザでの実行

1. `mocha-loader` をインストール
2. 上記 Webpack 設定から `entry` を `'mocha!babel!./test.js'` に変更
3. 設定を使用して `webpack-dev-server` を開始
4. `localhost:8080/webpack-dev-server/test-bundle` に移動

#### Karma + karma-webpack を使ったブラウザでの実行

[vue-loader documentation](http://vuejs.github.io/vue-loader/en/workflow/testing.html) 内のセットアップ方法を参考にしてください。
