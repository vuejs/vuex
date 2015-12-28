# Testing

Mutations are very straightforward to test, because they are just functions that completely rely on their arguments. Actions can be a bit more tricky because they may call out to external APIs. When testing actions, we usually need to do some level of mocking - for example, we can abstract the API calls into a service and mock that service inside our tests. In order to easily mock dependencies, we can use Webpack and [inject-loader](https://github.com/plasticine/inject-loader) to bundle our test files.

If your mutations and actions are written properly, the tests should have no direct dependency on Browser APIs after proper mocking. Thus you can simply bundle the tests with Webpack and run it directly in Node. Alternatively, you can use `mocha-loader` or Karma + `karma-webpack` to run the tests in real browsers.

Example testing a mutation using Mocha + Chai (you can use any framework/assertion libraries you like):

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

// use require syntax for inline loaders.
// with inject-loader, this returns a module factory
// that allows us to inject mocked dependencies.
import { expect } from 'chai'
const actionsInjector = require('inject!./actions')

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

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, {}, [
      { name: 'REQUEST_PRODUCTS' },
      { name: 'RECEIVE_PRODUCTS', payload: [ /* mocked response */ ] }
    ], done)
  })
})
```

### Running in Node

Create the following webpack config:

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

Then:

``` bash
webpack
mocha test-bundle.js
```

### Running in Browser

1. Install `mocha-loader`
2. Change the `entry` from the Webpack config above to `'mocha!babel!./test.js'`. 
3. Start `webpack-dev-server` using the config
4. Go to `localhost:8080/webpack-dev-server/test-bundle`.
