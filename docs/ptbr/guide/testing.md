# Testando

As partes principais que queremos testar no Vuex são mutações e ações.

### Testando Mutações

As mutações são muito simples de testar, porque são apenas funções que dependem completamente de seus argumentos. Um truque é que se você estiver usando módulos _ES2015_ e colocar suas mutações dentro do arquivo `store.js`, além da exportação padrão, você também deve exportar as mutações como uma exportação nomeada:

``` js
const state = { ... }

// exporta `mutações` como uma exportação nomeada
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Exemplo de teste de uma mutação usando _Mocha_ + _Chai_ (você pode usar qualquer biblioteca de estrutura/_framework_ que você gosta):

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

// desestrutura `mutações` atribuidas
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // mock o estado
    const state = { count: 0 }
    // aplica a mutação
    increment(state)
    // afirma o resultado
    expect(state.count).to.equal(1)
  })
})
```

### Testando Ações

As ações podem ser um pouco mais complicadas porque podem chamar as _APIs_ externas. Ao testar ações, geralmente precisamos fazer algum nível de _mocking_ - por exemplo, podemos resumir as chamadas da API em um serviço e simular esse serviço dentro de nossos testes. A fim de simular facilmente as dependências, podemos usar o _webpack_ e [inject-loader](https://github.com/plasticine/inject-loader) para agrupar nossos arquivos de teste.

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

// use a sintaxe 'require' para inline loaders.
// com inject-loader, isso retorna um factory de módulos
// que nos permite injetar dependências mocked (ou simuladas).
import { expect } from 'chai'
const actionsInjector = require('inject-loader!./actions')

// cria o módulo com nossos mocks
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* resposta simulada */ ])
      }, 100)
    }
  }
})

// auxiliar para teste de ação com mutações esperadas
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // mock commit (ou confirmação simulada)
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(type).to.equal(mutation.type)
      if (payload) {
        expect(payload).to.deep.equal(mutation.payload)
      }
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // chame a ação com store mocked (ou simulado) e argumentos
  action({ commit, state }, payload)

  // verifica se nenhuma mutação deveria ter sido enviada
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, null, {}, [
      { type: 'REQUEST_PRODUCTS' },
      { type: 'RECEIVE_PRODUCTS', payload: { /* resposta simulada */ } }
    ], done)
  })
})
```

Se você tem espiões disponíveis em seu ambiente de teste (por exemplo via [Sinon.JS](http://sinonjs.org/)), você pode usá-los em vez do auxiliar `testAction`:

``` js
describe('actions', () => {
  it('getAllProducts', () => {
    const commit = sinon.spy()
    const state = {}
    
    actions.getAllProducts({ commit, state })
    
    expect(commit.args).to.deep.equal([
      ['REQUEST_PRODUCTS'],
      ['RECEIVE_PRODUCTS', { /* resposta simulada */ }]
    ])
  })
})
```

### Testando Getters

Se seus _getters_ tiverem uma computação complicada, vale a pena testá-los. Os _Getters_ também são muito simples de testar pelo mesmo motivo que as mutações.

Exemplo testando um _getter_:

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
    // simulando estado
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // simulando getter
    const filterCategory = 'fruit'

    // obtem o resultado do getter
    const result = getters.filteredProducts(state, { filterCategory })

    // afirma o resultado
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### Executando Testes

Se suas mutações e ações estiverem escritas corretamente, os testes não devem ter dependência direta das APIs do navegador após uma simulação apropriada. Assim, você pode simplesmente agrupar os testes com o _webpack_ e executá-lo diretamente no _Node_. Alternativamente, você pode usar _mocha-loader_ ou _Karma_ + _karma-webpack_ para executar os testes em navegadores reais.

#### Executando no Node

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

#### Executando no Browser

1. Instale o _mocha-loader_.
2. Mude a `entrada` da configuração do _webpack_ acima para `'mocha-loader!babel-loader!./test.js'`.
3. Inicie o _webpack-dev-server_ usando a configuração.
4. Vá para _localhost:8080/webpack-dev-server/test-bundle_.

#### Executando no Browser com Karma + karma-webpack

Consulte a instalação na [documentação do vue-loader](https://vue-loader.vuejs.org/pt_BR/workflow/testing.html).
