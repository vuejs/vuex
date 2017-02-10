# Testeo

Las partes principales de Vuex a las que queramos realizarle testeos unitarios son mutaciones y acciones.

### Testeando mutaciones

Las mutaciones son sencillas de testear, porque son funciones que se basan completamente en sus parámetros. Un truco es que si estás utilizando módulos ES2015 y pones tus mutaciones dentro de tu archivo `store.js`, además de exportar el módulo _default_ puedes exportar las mutaciones con un nombre:

``` js
const state = { ... }

// exportar las mutaciones con un nombre
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Ejemplo de testeo utilizando Mocha + Chai (puedes usar cualquier biblioteca que desees):

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

// asignar mutaciones desestructuradamente 
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // mock el estado
    const state = { count: 0 }
    // aplicar las mutaciones
    increment(state)
    // verificar resultados
    expect(state.count).to.equal(1)
  })
})
```

### Testeando acciones

Las acciones pueden ser un poco más complicadas porque pueden hacer llamadas a APIs externas. Cuando testeamos acciones, normalmente necesitamos algún tipo de _mocking_ - por ejemplo, podemos abstraer las llamadas a las API dentro de un servicio y _mockear_ ese servicio dentro de nuestras pruebas. Para _mockear_ dependencias fácilmente, podemos usar [inject-loader](https://github.com/plasticine/inject-loader) de Webpack para empaquetar nuestros archivos de pruebas.

Ejemplo testeando una acción asíncrona:

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

// utiliza la sintaxis require para cargadores en linea.
// con inject-loader, esto devuelve una factoría de módulos
// que nos permite inyectar las dependencias mockeadas
import { expect } from 'chai'
const actionsInjector = require('inject!./actions')

// crear el módulo con nuestros mocks
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* mocked response */ ])
      }, 100)
    }
  }
})

// función auxiliar para testear acciones con las mutaciones esperadas
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // mock commit
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

  // ejecuta la acción con el store mockeado y los parámetros
  action({ commit, state }, payload)

  // verifica si no deben haber sido emitidas mutaciones
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

### Testeando _getters_

Si tus _getters_ poseen lógica complicada, vale la pena testearlos. Los _getters_ son también muy sencillos de testear por las mismas razones que las mutaciones.

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

    // obtén el resultado del getter
    const result = getters.filteredProducts(state, { filterCategory })

    // verifica el resultado
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### Ejecutando las pruebas

Si tus mutaciones y acciones están escritas correctamente, las pruebas no deberían tener dependencia directa de las APIs del navegador luego de un correcto _mockeo_. Entonces, puedes simplemente empaquetarlas con Webpack y ejecutarlas directamente con Node. Como alternativa, puedes usar`mocha-loader` o Karma + `karma-webpack` para ejecutar las pruebas en navegadores reales.

#### Ejecutando con Node

Crea la siguiente configuración de webpack (en conjunto con un [`.babelrc`](https://babeljs.io/docs/usage/babelrc/)):

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

Luego:

``` bash
webpack
mocha test-bundle.js
```

#### Ejecutando en navegadores

1. Instala `mocha-loader`
2. Cambia el valor de `entry` de la configuración anterior a `'mocha!babel!./test.js'`.
3. Inicia `webpack-dev-server` usando la configuración
4. Ve a `localhost:8080/webpack-dev-server/test-bundle`.

#### Ejecutando en navegadores con Karma + karma-webpack

Consulta la configuración en la [documentación de vue-loader](http://vue-loader.vuejs.org/en/workflow/testing.html).
