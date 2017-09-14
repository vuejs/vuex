# Tests

Les parties principales que l'on veut couvrir par des tests unitaires avec Vuex sont les mutations et les actions.

### Tester les mutations

Les mutations sont très simples à tester, puisque ce sont de simples fonctions qui se basent uniquement sur leurs arguments. Une astuce est que si vous utilisez les modules ES2015 et mettez vos mutations dans votre fichier `store.js`, en plus de l'export par défaut, vous pouvez également exporter vos mutations avec un export nommé :

``` js
const state = { ... }

// exporter les mutations en tant qu'export nommé
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Exemple de test de mutation utilisant Mocha + Chai (vous pouvez utiliser n'importe quel framework/bibliothèque d'assertion selon vos préférences) :

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

// assignement des mutations par déstructuration
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // état simulé
    const state = { count: 0 }
    // appliquer la mutation
    increment(state)
    // tester le résultat
    expect(state.count).to.equal(1)
  })
})
```

### Tester les actions

Les actions sont un peu plus compliquées car elles peuvent faire appel à des APIs externes. Lorsque l'on teste des actions, on a souvent besoin de faire plusieurs niveaux de simulation. Par exemple, on peut abstraire l'appel API dans un service et simuler ce service dans nos tests. Afin de simuler facilement les dépendances, on peut utiliser webpack et [inject-loader](https://github.com/plasticine/inject-loader) pour regrouper nos fichiers de test.

Exemple de test d'une action asynchrone :

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

// utilisation de la syntaxe `require` pour les loaders.
// avec inject-loader, cela retourne un module de fabrique
// cela nous permet d'injecter les dépendances simulées.
import { expect } from 'chai'
const actionsInjector = require('inject-loader!./actions')

// créer un module avec nos simulations
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* réponse simulée */ ])
      }, 100)
    }
  }
})

// fonction utilitaire pour tester des actions avec les mutations attendues
const testAction = (action, args, state, expectedMutations, done) => {
  let count = 0

  // acter une simulation
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(mutation.type).to.equal(type)
      if (payload) {
        expect(mutation.payload).to.deep.equal(payload)
      }
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // appeler l'action avec le store simulé et les arguments
  action({ commit, state }, ...args)

  // vérifier qu'aucune mutations n'ai été propagée
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

### Tester les accesseurs

Si vos accesseurs font des calculs compliqués, il peut être judicieux de les tester. Les accesseurs sont également très simples à tester, pour les mêmes raisons que les mutations.

Exemple de test d'un accesseur :

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
    // état simulé
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // accesseur simulé
    const filterCategory = 'fruit'

    // obterir le résultat depuis l'accesseur
    const result = getters.filteredProducts(state, { filterCategory })

    // tester le résultat
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### Lancer les tests

Si vos mutations et actions sont écrites comme il se doit, les tests ne devraient pas avoir de dépendance directe sur les APIs navigateur après une simulation préalable. Cela signifie que vous pouvez simplement regrouper les tests avec webpack et les lancer directement dans Node.js. De façon alternative, vous pouvez utiliser `mocha-loader` ou Karma + `karma-webpack` afin d'effectuer les tests dans des vrais navigateurs.

#### Lancer dans Node.js

Créez la configuration webpack suivante (ainsi que le fichier [`.babelrc`](https://babeljs.io/docs/usage/babelrc/) qui correspond) :

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

Puis :

``` bash
webpack
mocha test-bundle.js
```

#### Lancer dans un navigateur

1. Installez `mocha-loader`.
2. Changez l'option `entry` de la configuration webpack ci-dessus pour `'mocha-loader!babel-loader!./test.js'`.
3. Démarrez `webpack-dev-server` en utilisant la configuration.
4. Rendez-vous avec votre navigateur sur `localhost:8080/webpack-dev-server/test-bundle`.

#### Lancer dans un navigateur avec Karma + karma-webpack

Consultez la procédure sur la [documentation vue-loader](https://vue-loader.vuejs.org/en/workflow/testing.html).
