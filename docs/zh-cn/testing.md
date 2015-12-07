# 测试

Mutations 很容易测试，因为它仅仅是一个带参数的函数。相反测试 Actions 就比较难，因为 actions 会调用其它的一些 APIs. 测试 actions 的时候我们需要做一定的 mocking —— 比如说把 API 调用抽象成一个 service，然后测试的时候用另一个 mock 的 service. 为了方便地 mock，我们可以使用 Webpack 和 [inject-loader](https://github.com/plasticine/inject-loader) 打包测试文件。

If your mutations and actions are written properly, the tests should have no direct dependency on Browser APIs after proper mocking. Thus you can simply bundle the tests with Webpack and run it directly in Node. Alternatively, you can use `mocha-loader` or Karma + `karma-webpack` to run the tests in real browsers.

???

下面是用 Mocha + Chai 测试 mutation 的例子（你可以用任何你喜欢的测试工具）：

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

export const getAllProducts = () => dispatch => {
  dispatch('REQUEST_PRODUCTS')
  shop.getProducts(products => {
    dispatch('RECEIVE_PRODUCTS', products)
  })
}
```

``` js
// actions.spec.js

// use require syntax for inline loaders.
// with inject-loader, this returns a module factory
// that allows us to inject mocked dependencies.
import { expect } from 'chai'
const actionsInjector = require('inject!babel!./actions')

// create the module with our mocks
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* mocked response */ ])
      }, 100)
    }
  }
})

// helper for testing action with expected mutations
const testAction = (action, state, expectedMutations, done) => {
  let count = 0
  const mockedDispatch = (name, payload) => {
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
  action(mockedDispatch, state)
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts(), {}, [
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

### 在浏览器运行

1. Install `mocha-loader`
2. Change the `entry` from the Webpack config above to `'mocha!babel!./test.js'`.
3. Start `webpack-dev-server` using the config
4. Go to `localhost:8080/webpack-dev-server/test-bundle`.

1. 安装 `mocha-loader`
2. webpack 配置中的 entry 改成 `'mocha!babel!./test.js'`
3. 用以上配置启动 `webpack-dev-server`
4. 打开 `localhost:8080/webpack-dev-server/test-bundle`.
