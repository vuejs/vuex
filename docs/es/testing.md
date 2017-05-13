# Testing

Las partes que principalmente querremos testear en Vuex serán las mutaciones y las acciones.

### Testear Mutaciones

Las mutaciones son muy sencillas de testear ya que solo son funciones que dependen completamente de sus argumentos. Un truco, si estás usando módulos ES2015 y defines las mutaciones dentro del archivo `store.js`, es exportar, además del `store`, las mutaciones:

``` js
const state = { ... }

// Exporta mutaciones con nombre específico
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Ejemplo de testeo de una mutación usando Mocha + Chai (puedes usar cualquier framework/librería de aserciones):

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

// Asiganción por desestructuración de mutaciones
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // mockear estado
    const state = { count: 0 }
    // aplicar mutación
    increment(state)
    // asertar resultado
    expect(state.count).to.equal(1)
  })
})
```

### Testear Acciones

Las acciones pueden ser un poco más complicadas de testear ya que pueden hacer uso de APIs externas. En el testeo de acciones, habitualmente necesitaremos mockear algo - por ejemplo, podemos abstraer las llamadas a APIs en un servicio y mockear ese servicio en nuestros tests. Con el fin de poder mockear con facilidad las dependencias, podemos usar Webpack y [inject-loader](https://github.com/plasticine/inject-loader) para empaquetar nuestros tests.

Ejemplo de testeo de una acción asíncrona:

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

// uso de require para cargas en linea.
// con inject-loader, esto nos devuelve una módulo factoria
// que nos permite inyectar dependencias mockeadas.
import { expect } from 'chai'
const actionsInjector = require('inject!./actions')

// crear el módulo con nuestros mocks
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* respuesta mockeada */ ])
      }, 100)
    }
  }
})

// helper para el testeo de acciones con mutaciones previstas
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // mockear commit
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

  // ejecutar la acción con el almacén mockeado y argumentos
  action({ commit, state }, payload)

  // verificar si alguna mutación ha sido ejecutada
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, null, {}, [
      { type: 'REQUEST_PRODUCTS' },
      { type: 'RECEIVE_PRODUCTS', payload: { /* respuesta mockeada */ } }
    ], done)
  })
})
```

### Testear Getters

Si tus getters contienen una rutina compleja, merece la pena testearlos. Los getters son también sencillos de testear por la misma razón que los són las mutaciones.

Ejemplo de testeo de un getter:

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
    // mockear estado
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // mockear getter
    const filterCategory = 'fruit'

    // obtener el resultado del getter
    const result = getters.filteredProducts(state, { filterCategory })

    // asertar el resultado
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### Ejecutar Tests

Si tus mutaciones y acciones ha sido escritas correctamente, los tests no deberían tener ninguna dependencia directa con APIs del Browser. Por lo tanto puedes empaquetar los tests con Webpack y ejecutarlos directamente con Node. Alternativamente puedes usar `mocha-loader` ó Karma + `karma-webpack` para ejecutar los tests en un browser real.

#### Ejecutar en Node

Créa la siguiente configuración webpack (junto con un [`.babelrc`](https://babeljs.io/docs/usage/babelrc/) apropiado):

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

Después:

``` bash
webpack
mocha test-bundle.js
```

#### Ejecutar en Browser

1. Instalar `mocha-loader`
2. Cambiar `entry` de la configuración webpack anterior a `'mocha!babel!./test.js'`.
3. Iniciar `webpack-dev-server` usando la configuración
4. Ir a `localhost:8080/webpack-dev-server/test-bundle`.

#### Ejecutar en Browser con Karma + karma-webpack

Ver la instalación en la [documentación de vue-loader](http://vue-loader.vuejs.org/en/workflow/testing.html).
