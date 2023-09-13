# Testing

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cPGkpJhq" target="_blank" rel="noopener noreferrer">Essayez cette leçon sur le Scrimba</a></div>

Les principales parties que nous voulons tester en Vuex sont les mutations et les actions.

## Tester les mutations

Les mutations sont très simples à tester, car ce ne sont que des fonctions qui dépendent complètement de leurs arguments. Une astuce : si vous utilisez des modules ES2015 et que vous placez vos mutations dans votre fichier `store.js`, en plus de l'exportation par défaut, vous devez également exporter les mutations comme une exportation nommée :

```js
const state = { ... }

// exporter `mutations` comme une exportation nommée
export const mutations = { ... }

export default createStore({
  state,
  mutations
})
```

Exemple de test d'une mutation à l'aide de Mocha + Chai (vous pouvez utiliser n'importe quel cadre ou bibliothèque d'affirmations) :

```js
// mutations.js
export const mutations = {
  increment: state => state.count++
}
```

```js
// mutations.spec.js
import { expect } from 'chai'
import { mutations } from './store'

// déstructurer l'affectation des `mutations`.
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // simulation de state
    const state = { count: 0 }
    // appliquer une mutation
    increment(state)
    // résultat de l'affirmation
    expect(state.count).to.equal(1)
  })
})
```

## Test des actions

Les actions peuvent être un peu plus délicates car elles peuvent faire appel à des API externes. Lorsque nous testons des actions, nous avons généralement besoin de faire un certain niveau de simulacre - par exemple, nous pouvons abstraire les appels d'API dans un service et simuler ce service dans nos tests. Afin de simuler facilement les dépendances, nous pouvons utiliser webpack et [inject-loader](https://github.com/plasticine/inject-loader) pour regrouper nos fichiers de test.

Exemple de test d'une action asynchrone :

```js
// actions.js
import shop from '../api/shop'

export const getAllProducts = ({ commit }) => {
  commit('REQUEST_PRODUCTS')
  shop.getProducts(products => {
    commit('RECEIVE_PRODUCTS', products)
  })
}
```

```js
// actions.spec.js

// utiliser la syntaxe require pour les chargeurs en ligne.
// avec inject-loader, cela renvoie une fabrique de modules
// qui nous permet d'injecter des dépendances simulées.
import { expect } from 'chai'
const actionsInjector = require('inject-loader!./actions')

// créer le module avec nos mocks
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* mocked response */ ])
      }, 100)
    }
  }
})

// aide pour tester l'action avec les mutations attendues
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // simuler les commit
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

  // appelle l'action avec le magasin factice et les arguments.
  action({ commit, state }, payload)

  // vérifier si aucune mutation n'aurait dû être distribuée
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

Si vous avez des espions disponibles dans votre environnement de test (par exemple via [Sinon.JS](http://sinonjs.org/)), vous pouvez les utiliser à la place de l'aide `testAction` :

```js
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

## Tester les getters

Si vos getters ont un calcul compliqué, cela vaut la peine de les tester. Les getters sont également très simples à tester pour la même raison que les mutations.

Exemple de test d'un getter :

```js
// getters.js
export const getters = {
  filteredProducts (state, { filterCategory }) {
    return state.products.filter(product => {
      return product.category === filterCategory
    })
  }
}
```

```js
// getters.spec.js
import { expect } from 'chai'
import { getters } from './getters'

describe('getters', () => {
  it('filteredProducts', () => {
    // simuler le state
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // simuler le getter
    const filterCategory = 'fruit'

    // obtenir le résultat du getter
    const result = getters.filteredProducts(state, { filterCategory })

    // affirmer le résultat
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

## Exécution des tests

Si vos mutations et vos actions sont écrites correctement, les tests ne devraient pas dépendre directement des API du navigateur après une simulation approprié. Ainsi, vous pouvez simplement empaqueter les tests avec webpack et les exécuter directement dans Node. Sinon, vous pouvez utiliser `mocha-loader` ou Karma + `karma-webpack` pour exécuter les tests dans des navigateurs réels.

### Exécution dans Node

Créez la configuration suivante pour webpack (avec le [`.babelrc`](https://babeljs.io/docs/usage/babelrc/) approprié) :

```js
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

Ensuite :

``` bash
webpack
mocha test-bundle.js
```

#### Exécution dans le navigateur

1. Installez `mocha-loader`.
2. Changez le `entry` du webpack config ci-dessus en `'mocha-loader!babel-loader !./test.js'`.
3. Démarrez `webpack-dev-server` en utilisant la configuration.
4. Allez sur `localhost:8080/webpack-dev-server/test-bundle`.

### Exécution dans le navigateur avec Karma + karma-webpack

Consultez la configuration dans [vue-loader documentation](https://vue-loader.vuejs.org/en/workflow/testing.html).
