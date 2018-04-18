# Testando

As partes principais que queremos testar em Vuex são mutações e ações.
### Testando Mutações
As mutações são muito simples de testar, porque são apenas funções que dependem completamente de seus argumentos. Um truque é que se você estiver usando módulos ES2015 e colocar suas mutações dentro do arquivo `store.js`, além da exportação padrão, você também deve exportar as mutações como uma exportação nomeada:

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

As ações podem ser um pouco mais complicadas porque podem chamar as APIs externas. Ao testar ações, geralmente precisamos fazer algum nível de burla - por exemplo, podemos resumir as chamadas da API em um serviço e simular esse serviço dentro de nossos testes. A fim de simular facilmente as dependências, podemos usar o webpack e [injetor-carregador] (https://github.com/plasticine/inject-loader) para agrupar nossos arquivos de teste.

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

// uso requer sintaxe para carregadores em linha.
// com injetor-carregador, isso retorna uma fábrica de módulos
// que nos permite injetar dependências simuladas.import { expect } from 'chai'
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

// ajudante para teste de ação com mutações esperadas
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

  // chame a ação com uma loja e argumentos simulados
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
      { type: 'RECEIVE_PRODUCTS', payload: { /* mocked response */ } }
    ], done)
  })
})
```

### Testando Getters

Se seus getters tiverem uma computação complicada, vale a pena testá-los. Os Getters também são muito diretos para testar o mesmo motivo que as mutações.

Exemplo testando um getter:
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

### Execução de testes

If your mutations and actions are written properly, the tests should have no direct dependency on Browser APIs after proper mocking. Thus you can simply bundle the tests with webpack and run it directly in Node. Alternatively, you can use `mocha-loader` or Karma + `karma-webpack` to run the tests in real browsers.

Se suas mutações e ações estiverem escritas corretamente, os testes não devem ter dependência direta das APIs do navegador após uma mudança apropriada. Assim, você pode simplesmente agrupar os testes com o webpack e executá-lo diretamente no Node. Alternativamente, você pode usar `mocha-loader` ou Karma +` karma-webpack` para executar os testes em navegadores reais.

#### Rodando no Node

Crie a seguinte configuração de webpack (juntamente com [`.babelrc` (https://babeljs.io/docs/usage/babelrc/)):

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

1. Instale `mocha-loader`.
2. Mude a `entrada 'da configuração do webpack acima para`' mocha-loader! Babel-loader! ./ test.js'`.
3. Inicie `webpack-dev-server` usando a configuração.
4. Vá para `localhost: 8080 / webpack-dev-server / test-bundle`.

#### Rodando no Browser com Karma + karma-webpack

Consulte a instalação em [vue-loader documentation](https://vue-loader.vuejs.org/en/workflow/testing.html).

