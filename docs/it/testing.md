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

Le Action possono essere più complesse da testate dato che possono contenere chiamate ad API esterne a Vuex. Quando si testano le action, si dovrà fare uso, nella maggior parte dei casi, di un sistema di mocking - per esempio nel caso volessimo chiamare delle API ad un servizio di terze parti
Per effettuare il mocking delle dipendenze, si può utilizzare il comodo sistema di [inject-loader](https://github.com/plasticine/inject-loader) assieme a WebPack.

Esempio su una Action asincrona:

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

// utilizziamo la sintassi require per i loader inline
// tramte inject-loader, ci restituisce un model
// che ci permette di fare mocking
import { expect } from 'chai'
const actionsInjector = require('inject!./actions')

// creiamo il modulo tramite mock
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* response dal mock */ ])
      }, 100)
    }
  }
})

// testiamo le azioni con i risultati desiderati
const testAction = (action, args, state, expectedMutations, done) => {
  let count = 0
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
  action({dispatch, state}, ...args)

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

### Eseguire i tests

Se le tue mutation o action sono scritte in modo consono, i test non dovrebbero soffrire dipendeze esterne, come il browser e le sue API, anche durante l'uso di Mock. Detto questo potenzialmente è possibile pacchettizare i test tramite WebPack e farli girare sotto Node direttamente. Alternativamente è possibile utilizzare un sistema come `mocha-loader` o Karma assieme a `karma-webpack` per far girare i test in un browser reale.

#### Girare sotto Node

Ecco una config webpack per testare tramite Node:

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

Successivamente:

``` bash
webpack
mocha test-bundle.js
```

#### Testare nel Browser

1. Installare `mocha-loader`
2. Cambiare l `entry` dalla configurazione Webpack sopra citata in `'mocha!babel!./test.js'`.
3. Inizializzare `webpack-dev-server` utilizzando la configurazione sopra citata
4. Andare su `localhost:8080/webpack-dev-server/test-bundle`.
5. Profit!

#### Testare nel Browser tramite Karma e karma-webpack

Per una guida più dettagliata su Karma consultare la [documentazione di vue-loader](http://vuejs.github.io/vue-loader/workflow/testing.html).
