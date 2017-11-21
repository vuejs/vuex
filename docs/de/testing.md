# Tests

Hauptsächlich werden in Vuex Mutations und Actions getestet.

### Mutation-Tests

Mutations sind unkompliziert zu testen, weil sie lediglich Funktionen sind, die auf ihren Argumenten beruhen. Ein Trick ist, wenn ES2015-Module genutzt werden und die Mutations in `store.js` liegen, neben dem Default-Export auch die Mutations als benannten Export zu verwenden:

``` js
const state = { ... }

// Exportiere Mutations als benannten Export.
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Testbeispiel einer Mutation mit Mocha + Chai (man kann jedes Framework/Assertion Library nutzen):

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

// destruiere zugeordnete Mutations
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // setze State
    const state = { count: 0 }
    // lege Mutation fest
    increment(state)
    // lege Wert fest
    expect(state.count).to.equal(1)
  })
})
```

### Action-Tests

Actions sind etwas kniffliger, da sie externe APIs aufrufen. Bei Action-Tests ist meist ein gewisser Grad an Mocking notwendig. Zum Beispiel kann man die API-Aufrufe in einen Service zusammenfassen und nur diesen in den Tests im Mocking nutzen.

Um einfacher Abhängigkeiten im Mocking zu prüfen, kann man Webpack und [inject-loader (englisch)](https://github.com/plasticine/inject-loader) nutzen, um die Testdaten zu bündeln.

Testbeispiel einer ansynchronen Action:

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

// Kreiere die Module mit den Mocks.
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* mocked response */ ])
      }, 100)
    }
  }
})

// Helfer für Action-Tests mit erwarteter Mutation
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // mock commit
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

### Getter-Tests

Wenn die Getter komplizierte Berechnungen inne haben, lohnt es sich diese zu testen. Getters sind ebenfalls recht geradelinig zu testen wie Mutations.

Testbeispiel für Getters:

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

### Lauf von Tests

Wenn Mutations und Actions ordentlich geschrieben wurden, sollten die Tests keine direkte Abhängigkeit zur Browser-API nach korrektem Mocking haben. Demnach kann man die Tests mit Webpack bündlen und direkt in Node laufen lassen. Alternativ kann man `mocha-loader` oder Karma + `karma-webpack` für reale Browser-Tests nutzen.

#### Running in Node

Erstell die folgende Webpack-Konfiguration (zusammen mit korrektem [`.babelrc`](https://babeljs.io/docs/usage/babelrc/)):

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

Anschließend:

``` bash
webpack
mocha test-bundle.js
```

#### Laufen im Browser

1. Installiere `mocha-loader`.
2. Ändere `entry` der obigen Webpack-Konfiguration zu `'mocha!babel!./test.js'`.
3. Starte `webpack-dev-server`
4. Öffne `localhost:8080/webpack-dev-server/test-bundle`.

#### Laufen im Browser mit Karma + karma-webpack

Siehe auch den Aufbau in der [vue-loader-Dokumentation (englisch)](http://vue-loader.vuejs.org/en/workflow/testing.html).
