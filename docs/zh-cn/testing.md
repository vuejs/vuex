# 测试

Mutations 很容易测试，因为它仅仅是一个完全依赖参数的函数。相比之下，测试 Actions 会复杂一些，因为 actions 可能会调用一些外部的 API。 测试 actions 的时候我们需要做一定的 mocking —— 比如说把 API 调用抽象成一个 service，然后测试的时候用另一个 mock 的 service. 为了方便地 mock，我们可以使用 Webpack 和 [inject-loader](https://github.com/plasticine/inject-loader) 来打包测试文件。

如果你的 mutation 和 action 遵循了 Vuex 的规则，那么在 mock 之后它们应该对浏览器 API 没有任何直接依赖。因此，打包之后的文件可以直接在 Node.js 下运行。如果你想要在真正的浏览器里跑测试，则可以使用 `mocha-loader` 或是 Karma + `karma-webpack` 的组合。

下面是用 Mocha + Chai 测试一个 mutation 的例子（实际上你可以用任何你喜欢的测试框架）：

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
    // mock state
    const state = { count: 0 }
    // apply mutation
    INCREMENT(state)
    // assert result
    expect(state.count).to.equal(1)
  })
})
```

测试异步 action 的例子：

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
import { expect } from 'chai'
// 这里因为需要用 webpack loader 所以使用 require() 而不是 import
// inject-loader 会返回一个工厂函数。这个工厂函数让我们可以对该模块的
// 依赖进行 mock
const actionsInjector = require('inject!babel!./actions')

// 调用工厂函数，获得 mock 过依赖的 actions 模块
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* mocked response */ ])
      }, 100)
    }
  }
})

// 这是一个可复用的助手函数，用于断言一个 action 应触发的 mutations
const testAction = (action, state, expectedMutations, done) => {
  let count = 0
  // mock dispatch
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
  // call the action with mocked store
  action({
    dispatch,
    state
  })
}

// 实际测试
describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, {}, [
      { name: 'REQUEST_PRODUCTS' },
      { name: 'RECEIVE_PRODUCTS', payload: [ /* mocked response */ ] }
    ], done)
  })
})
```

### 在 Node 中运行

创建以下 webpack 配置：

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

然后：

``` bash
webpack
mocha test-bundle.js
```

### 在浏览器中运行

1. 安装 `mocha-loader`
2. webpack 配置中的 entry 改成 `'mocha!babel!./test.js'`
3. 用以上配置启动 `webpack-dev-server`
4. 打开 `localhost:8080/webpack-dev-server/test-bundle`.
