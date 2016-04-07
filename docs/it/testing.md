# Test del Codice

La prima cosa da testare in un'applicazione che sfrutta Vuex sono le mutation e le action.

### Testare le Mutation

Per testare le mutation non abbiamo bisogno di nessun tipo di sistema specifico dato che esse si basano solo sugli argomenti che gli vengono passati. Se state utilizzando i moduli ES2015 potete mettere le vostre mutation nel file `store.js`, e potete esportarle come qualsiasi altro modulo:

``` js
const state = { ... }

// esportiamo le mutation
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Testiamo una mutation sfruttando Mocha e Chai (potete usare qualsiasi framework voi troviate comodo):

``` js
// mutations.js
export const INCREMENT = state => state.count++
```

``` js
// mutations.spec.js
import { expect } from 'chai'
import { mutations } from './store'

// creiamo la struttura
const { INCREMENT } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // facciamo un mock dello stato
    const state = { count: 0 }
    // applichiamo la mutation
    INCREMENT(state)
    // confrontiamo i risultati
    expect(state.count).to.equal(1)
  })
})
```

### Testare le Action

Actions can be a bit more tricky because they may call out to external APIs. When testing actions, we usually need to do some level of mocking - for example, we can abstract the API calls into a service and mock that service inside our tests. In order to easily mock dependencies, we can use Webpack and [inject-loader](https://github.com/plasticine/inject-loader) to bundle our test files.

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
const testAction = (action, args, state, expectedMutations, done) => {
  let count = 0
  // mock dispatch
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
  // call the action with mocked store and arguments
  action({dispatch, state}, ...args)

  // check if no mutations should have been dispatched
  if (count === 0) {
    expect(expectedMutations.length).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, [], {}, [
      { name: 'REQUEST_PRODUCTS' },
      { name: 'RECEIVE_PRODUCTS', payload: [ /* mocked response */ ] }
    ], done)
  })
})
```

### Running Tests

If your mutations and actions are written properly, the tests should have no direct dependency on Browser APIs after proper mocking. Thus you can simply bundle the tests with Webpack and run it directly in Node. Alternatively, you can use `mocha-loader` or Karma + `karma-webpack` to run the tests in real browsers.

#### Running in Node

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

#### Running in Browser

1. Install `mocha-loader`
2. Change the `entry` from the Webpack config above to `'mocha!babel!./test.js'`.
3. Start `webpack-dev-server` using the config
4. Go to `localhost:8080/webpack-dev-server/test-bundle`.

#### Running in Browser with Karma + karma-webpack

Consult the setup in [vue-loader documentation](http://vuejs.github.io/vue-loader/workflow/testing.html).
