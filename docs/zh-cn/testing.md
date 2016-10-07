# 测试

Vuex 中要进行单元测试的主要部分是 mutation 和 action。

### 测试 Mutation

Mutations 很好测试，因为他们就是仅依赖参数本身的方法。有一个技巧就是，如果你是用 ES2015 的模块化并且把 mutation 放到 `store.js` 文件里，除了默认的 export 外，你还可以把这个 mutation 命名化 export。

``` js
const state = { ... }

// 命名化 export mutation
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

使用 Mocha + Chai 测试一个 mutation 的例子（你可以使用任意你喜欢 框架/断言库）:

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

// destructure assign mutations
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // mock state
    const state = { count: 0 }
    // apply mutation
    increment(state)
    // assert result
    expect(state.count).to.equal(1)
  })
})
```

### 测试 Actions

测试 Action 就有点棘手了，因为它们可能依赖外部 API。当测试 action 的时候，我们通常需要做某种程度的 mocking（模拟） —— 例如，我们可以把 API 调用抽象封装到一个服务类，然后在测试中模拟这个服务。为了简单模拟依赖，我们可以使用 Webpack 和 [inject-loader](https://github.com/plasticine/inject-loader) 类打包我们的测试文件。

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

// 使用 require 语法获得内联 loader
// 通过 inject-loader 返回一个模块工厂
// 可以让我们注入模拟的依赖
import { expect } from 'chai'
const actionsInjector = require('inject!./actions')

// 使用我们模拟的部分来创建模块
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* mocked response */ ])
      }, 100)
    }
  }
})

// 工具方法：按照预期的 mutation 测试 action
const testAction = (action, args, state, expectedMutations, done) => {
  let count = 0

  // 模拟 commit
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

  // 调用 action，使用模拟的 store 和 arguments
  action({ commit, state }, ...args)

  // 检查是否所有 mutation 都提交了
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, [], {}, [
      { type: 'REQUEST_PRODUCTS' },
      { type: 'RECEIVE_PRODUCTS', payload: { /* mocked response */ } }
    ], done)
  })
})
```

### 测试 Getters

如果你的 getter 带有复杂计算，那么测试他们是值得的。Getter 的测试原理跟 mutation 一样：

测试 getter 的例子：

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

    // 从 getter 获取接过
    const result = getters.filteredProducts(state, { filterCategory })

    // 对结果作断言
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### 运行测试

如果你的 mutation 和 action 都编写合理，经过适当的模拟后，测试就不应该直接依赖浏览器 API，因此，你可以用 Webpack 打包测试然后运行。

#### 在 Node 中运行

创建下面 webpack 配置 （还有相应的 [`.babelrc`](https://babeljs.io/docs/usage/babelrc/)）

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

然后:

``` bash
webpack
mocha test-bundle.js
```

#### 在 Browser 中运行

1. 安装 `mocha-loader`。
2. 修改上面 Webpack 配置中的 `entry` 为 `'mocha!babel!./test.js'`。
3. 使用该配置开启 `webpack-dev-server`。
4. 打开 `localhost:8080/webpack-dev-server/test-bundle`。

#### 使用 Karma + karma-webpack 在浏览器中运行

参照 [vue-loader 文档](http://vue-loader.vuejs.org/en/workflow/testing.html)。
