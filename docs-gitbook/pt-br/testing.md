# Testando

As partes principais que queremos testar em Vuex são mutações e ações.

### Testando Mutações

As mutações são muito simples de testar, porque são apenas funções que dependem completamente de seus argumentos. Um truque é que se você estiver usando módulos _ES2015_ e colocar suas mutações dentro do arquivo `store.js`, além da exportação padrão, você também deve exportar as mutações como uma exportação nomeada:

``` js
const state = { ... }

// exportar `mutações` como uma exportação nomeada
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Exemplo de teste de uma mutação usando Mocha + Chai (você pode usar qualquer biblioteca de estrutura / asserção que você gosta):

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

### Testando ações

As ações podem ser um pouco mais complicadas porque podem chamar as _APIs_ externas. Ao testar ações, geralmente precisamos fazer algum nível de _mocking_ - por exemplo, podemos resumir as chamadas da API em um serviço e simular esse serviço dentro de nossos testes. A fim de simular facilmente as dependências, podemos usar o webpack e [injetor-carregador](https://github.com/plasticine/inject-loader) para agrupar nossos arquivos de teste.

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

// uso a sintaxe 'require' para inline loaders.
// com inject-loader, isso retorna uma factory de módulos
// que nos permite injetar dependências simuladas. import { expect } from 'chai'
const actionsInjector = require('inject-loader!./actions')

// crie o módulo com nossos mocks
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* mocked response */ ])
      }, 100)
    }
  }
})

// auxiliar para teste de ação com mutações esperadas
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // mock commit
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

  // chame a ação com store mockada e argumentos
   action({ commit, state }, payload)

  // verificar se nenhuma mutação deveria ter sido enviada
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, null, {}, [
      { type: 'REQUEST_PRODUCTS' },
      { type: 'RECEIVE_PRODUCTS', payload: { /* retorno mockado */ } }
    ], done)
  })
})
```

### Testando _Getters_

Se seus _getters_ tiverem uma computação complicada, vale a pena testá-los. Os _Getters_ também são muito simples de testar pelo mesmo motivo que as mutações.

Exemplo testando um _getter_ :
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

    // obter o resultado do getter
    const result = getters.filteredProducts(state, { filterCategory })

    // afirma o resultado
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### Execução de testes

Se suas mutações e ações estiverem escritas corretamente, os testes não devem ter dependência direta das APIs do navegador após uma mudança apropriada. Assim, você pode simplesmente agrupar os testes com o webpack e executá-lo diretamente no Node. Alternativamente, você pode usar _mocha-loader_ ou _Karma_ + _karma-webpack_ para executar os testes em navegadores reais.

#### Rodando no _Node_

Crie a seguinte configuração de _webpack_ (juntamente com [`.babelrc`](https://babeljs.io/docs/usage/babelrc/)):

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

1. Instale _mocha-loader_.
2. Mude a `entrada` da configuração do _webpack_ acima para `'mocha-loader! Babel-loader! ./ test.js'`.
3. Inicie _webpack-dev-server_ usando a configuração.
4. Vá para _localhost: 8080 / webpack-dev-server / test-bundle_.

#### Rodando no Browser com _Karma_ + _karma-webpack_

Consulte a instalação na [documentação do vue-loader](https://vue-loader.vuejs.org/pt_BR/workflow/testing.html).
