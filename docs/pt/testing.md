 # Testes

As partes principais que nós queremos testar no Vuex são as mutações e as ações.

### Testando Mutações

Mutações são muito fáceis de testar, porque elas são apenas funções que dependem apenas de seus parâmetros. Uma dica é que se você estiver utilizando módulos ES2015 e colocar suas mutações dentro do seu arquivo `store.js`, além dos dados que são exportados por padrão, você também pode exportar mutações nomeadas:

``` js
const state = { ... }

// exportando as mutações com nomes
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Exemplo de testes de mutação utilizando Mocha + Chai (você pode usar qualquer framework/bibliotecas de teste que você quiser):

``` js
// mutations.js
export const INCREMENT = state => state.count++
```

``` js
// mutations.spec.js
import { expect } from 'chai'
import { mutations } from './store'

// destructure assign mutations
const { INCREMENT } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // mock state
    const state = { count: 0 }
    // apply mutation
    INCREMENT(state)
    // assert result
    expect(state.count).to.equal(1)
  })
})
```

### Testando Ações

Ações podem ser um pouco mais complicadas de testar porque talvez elas chamem APIs externas. Ao testar ações, nós geralmente precisamos realizar algum tipo de mocking - por exemplo, nós podemos abstrair as chamadas da api em um serviço e usar um mock para esse serviço em nossos testes. Para facilitar esse processo, você pode utizar o Webpack em conjunto com o [inject-loader](https://github.com/plasticine/inject-loader) para empacotar os arquivos de testes.

Exemplo de teste com uma ação assíncrona:

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

### Rodando os Testes

Se suas mutações e ações forem escritas corretamente, os testes não devem ter nenhuma dependÊncia direta nas APIs dos navegadores após o mocking bem realizado. Assim, você pode simplesmente agrupar os testes com Webpack e executá-lo diretamente no Node. Alternativamente, você pode utilizar o `mocha-loader` ou o Karma + `karma-webpack` para rodar os testes em um navegador real.

#### Testando no Node

Crie a seguinte configuração no webpack:

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

Então:

``` bash
webpack
mocha test-bundle.js
```

#### Testando no Navegador

1. Instale o `mocha-loader`
2. Mude o valor da opção `entry` na configuração acima do Webpack para `'mocha!babel!./test.js'`.
3. Inicie o `webpack-dev-server` usando a configuração
4. Va até o endereço `localhost:8080/webpack-dev-server/test-bundle`.

#### Testando no Navegador com Karma + karma-webpack

Consulte o setup na [documentação do vue-loader](http://vuejs.github.io/vue-loader/workflow/testing.html).
