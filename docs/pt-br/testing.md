# Testando

As partes principais que queremos fazer teste unitário no Vuex são as mutações e ações.

### Testando Mutações

Mutações são totalmente diretas para se testar. pois são apenas funções que dependem completamente dos seus argumentos. Um truque para se usar é que se você está usando os módulos do ES2015 e coloca suas mutações dentro da sua `store.js`, em adição do default export, você também pode exportar as mutações com um export nomeado.


``` js
const state = { ... }

// exporta mutações com um export nomeado
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Exemplo de teste de uma mutação usando Mocha + Chai (você pode usar qualquer framework/biblioteca de asserção que quiser):

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

// mutações de atributição desestruturada
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // imita o estado
    const state = { count: 0 }
    // aplica mutação
    increment(state)
    // afirma o resultado
    expect(state.count).to.equal(1)
  })
})
```

### Testando Ações

Ações podem ser um pouco mais complicadas de se testar pois podem chamar APIs externas. Quando estamos testando ações, geralmente precisamos fazer algum nível de imitação - por exemplo, podemos abstrair as chamadas de API em um serviço e imitar esse serviço dentro de nossos testes. Para imitar dependências facilmente, podemos usar Webpack e [inject-loader](https://github.com/plasticine/inject-loader) agrupar nossos arquivos de testes.

Exemplo de teste de uma ação assíncrona:

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

// use sintaxe de require para loaders inline
// com inject-loader, isso retorna uma fábrica de módulos
// que nos permite injetar dependências imitadas

import { expect } from 'chai'
const actionsInjector = require('inject!./actions')

// cria o módulo com nossas imitações
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* resposta imitada */ ])
      }, 100)
    }
  }
})

// helper para testar ações com as mutações esperadas
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // imita o commit
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

  // chama a ação com store e argumentos imitados
  action({ commit, state }, payload)

  // checa se nenhuma mutação deve ser despachada
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

### Testando Getters

Se seus getters tem computações complicadas, vale a pena testá-los. Getters também são bem diretos de testar, pela mesma razão que as mutações.


Exemplo testado um getter:

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
    // imita o getter
    const filterCategory = 'fruit'

    // recebe o resultado do getter
    const result = getters.filteredProducts(state, { filterCategory })

    // afirma o resultado
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### Rodando Testes

Se suas mutações e ações são escritas de forma apropriada, os testes não devem ter dependências diretas à API do navegador depois de fazer as devidas imitações. Portanto, você pode simplesmente agrupar os testes com Webpack e rodar diretamente pelo Node. Alterativamente, você pode usar `mocha-loader` ou Karma + `karma-webpack` para rodar os testes em navegadores reais.

#### Rodando no Node

Crie o seguinte arquivo de configuração de Webpack (junto do  [`.babelrc`](https://babeljs.io/docs/usage/babelrc/) apropriado):

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

Então:

``` bash
webpack
mocha test-bundle.js
```

#### Rodando no Browser

1. Instale `mocha-loader`
2. Altere a `entry` da configuração do Webpack acima para `'mocha!babel!./test.js'`.
3. Rode `webpack-dev-server` usando a configuração
4. Vá para `localhost:8080/webpack-dev-server/test-bundle`.

#### Rodando no Navegador com Karma + karma-webpack

Consulte a configuração na [documentação do vue-loader ](http://vue-loader.vuejs.org/en/workflow/testing.html).
