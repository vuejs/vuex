# Testing

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cPGkpJhq" target="_blank" rel="noopener noreferrer">Try this lesson on Scrimba</a></div>

The main parts we want to unit test in Vuex are mutations and actions.

### Testing Mutations

Mutations are very straightforward to test, because they are just functions that completely rely on their arguments. One trick is that if you are using ES2015 modules and put your mutations inside your `store.js` file, in addition to the default export, you should also export the mutations as a named export:

``` js
const state = { ... }

// export `mutations` as a named export
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Example testing a mutation using Mocha + Chai (you can use any framework/assertion libraries you like):

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

// destructure assign `mutations`
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

### Testing Actions

Actions can be a bit more tricky because they may call out to external APIs. When testing actions, we usually need to do some level of mocking - for example, we can abstract the API calls into a service and mock that service inside our tests. In order to easily mock dependencies, we can use webpack and [inject-loader](https://github.com/plasticine/inject-loader) to bundle our test files.

Example testing an async action:

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

// use require syntax for inline loaders.
// with inject-loader, this returns a module factory
// that allows us to inject mocked dependencies.
import { expect } from 'chai'
const actionsInjector = require('inject-loader!./actions')

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
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // mock commit
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(type).to.equal(mutation.type)
      expect(payload).to.deep.equal(mutation.payload)
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // call the action with mocked store and arguments
  action({ commit, state }, payload)

  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, null, {}, [
      { type: 'REQUEST_PRODUCTS' },
      { type: 'RECEIVE_PRODUCTS', payload: { /* mocked response */ } }
    ], done)
  })
})
```

If you have spies available in your testing environment (for example via [Sinon.JS](http://sinonjs.org/)), you can use them instead of the `testAction` helper:

``` js
describe('actions', () => {
  it('getAllProducts', () => {
    const commit = sinon.spy()
    const state = {}
    
    actions.getAllProducts({ commit, state })
    
    expect(commit.args).to.deep.equal([
      ['REQUEST_PRODUCTS'],
      ['RECEIVE_PRODUCTS', { /* mocked response */ }]
    ])
  })
})
```

### Testing Getters

If your getters have complicated computation, it is worth testing them. Getters are also very straightforward to test for the same reason as mutations.

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

If your mutations and actions are written properly, the tests should have no direct dependency on Browser APIs after proper mocking. Thus you can simply bundle the tests with webpack and run it directly in Node. Alternatively, you can use `mocha-loader` or Karma + `karma-webpack` to run the tests in real browsers.

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
        loader: 'babel-loader',
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

1. Install `mocha-loader`.
2. Change the `entry` from the webpack config above to `'mocha-loader!babel-loader!./test.js'`.
3. Start `webpack-dev-server` using the config.
4. Go to `localhost:8080/webpack-dev-server/test-bundle`.

#### Running in Browser with Karma + karma-webpack

Consult the setup in [vue-loader documentation](https://vue-loader.vuejs.org/en/workflow/testing.html).
