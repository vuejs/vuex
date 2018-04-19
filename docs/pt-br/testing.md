# Testando

As partes principais que queremos testar em Vuex s�o muta��es e a��es.
### Testando Muta��es
As muta��es s�o muito simples de testar, porque s�o apenas fun��es que dependem completamente de seus argumentos. Um truque � que se voc� estiver usando m�dulos ES2015 e colocar suas muta��es dentro do arquivo `store.js`, al�m da exporta��o padr�o, voc� tamb�m deve exportar as muta��es como uma exporta��o nomeada:

``` js
const state = { ... }

// exportar `muta��es` como uma exporta��o nomeada
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Exemplo de teste de uma muta��o usando Mocha + Chai (voc� pode usar qualquer biblioteca de estrutura / asser��o que voc� gosta):

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

### Testando a��es

As a��es podem ser um pouco mais complicadas porque podem chamar as APIs externas. Ao testar a��es, geralmente precisamos fazer algum n�vel de burla - por exemplo, podemos resumir as chamadas da API em um servi�o e simular esse servi�o dentro de nossos testes. A fim de simular facilmente as depend�ncias, podemos usar o webpack e [injetor-carregador](https://github.com/plasticine/inject-loader) para agrupar nossos arquivos de teste.

Exemplo de teste de uma a��o ass�ncrona:

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
// com injetor-carregador, isso retorna uma f�brica de m�dulos
// que nos permite injetar depend�ncias simuladas.import { expect } from 'chai'
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

// ajudante para teste de a��o com muta��es esperadas
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

  // chame a a��o com uma loja e argumentos simulados
   action({ commit, state }, payload)

  // verificar se nenhuma muta��o deveria ter sido enviada
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

Se seus getters tiverem uma computa��o complicada, vale a pena test�-los. Os Getters tamb�m s�o muito diretos para testar o mesmo motivo que as muta��es.

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

### Execu��o de testes

Se suas muta��es e a��es estiverem escritas corretamente, os testes n�o devem ter depend�ncia direta das APIs do navegador ap�s uma mudan�a apropriada. Assim, voc� pode simplesmente agrupar os testes com o webpack e execut�-lo diretamente no Node. Alternativamente, voc� pode usar `mocha-loader` ou Karma +` karma-webpack` para executar os testes em navegadores reais.

#### Rodando no Node

Crie a seguinte configura��o de webpack (juntamente com [`.babelrc` (https://babeljs.io/docs/usage/babelrc/)):

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

Ent�o:

``` bash
webpack
mocha test-bundle.js
```

#### Rodando no Browser

1. Instale `mocha-loader`.
2. Mude a `entrada 'da configura��o do webpack acima para`' mocha-loader! Babel-loader! ./ test.js'`.
3. Inicie `webpack-dev-server` usando a configura��o.
4. V� para `localhost: 8080 / webpack-dev-server / test-bundle`.

#### Rodando no Browser com Karma + karma-webpack

Consulte a instala��o em [vue-loader documentation](https://vue-loader.vuejs.org/en/workflow/testing.html).

