# Probando

Las partes principales por las que queremos pasar las unidades de prueba en Vuex son mutaciones y acciones.

### Probando las mutaciones

Las mutaciones son muy fáciles de probar, ya que son sólo funciones que dependen completamente de sus argumentos. Un truco es que si estás usando módulos ES2015 y pones tus mutaciones dentro de tu archivo `store.js`, en adición a la exportación por defecto, también puedes exportar las mutaciones como una exportación nombrada:

``` js
const state = { ... }

// exporta las mutaciones como una exportación nombrada
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Ejemplo probando una mutación usando Mocha + Chai (puedes utilizar cualquier biblioteca/aserción que quieras):

``` js
// mutations.js
export const INCREMENT = state => state.count++
```

``` js
// mutations.spec.js
import { expect } from 'chai'
import { mutations } from './store'

// asignación mutaciones destructurada
const { INCREMENT } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // estado simulado
    const state = { count: 0 }
    // aplicar mutación
    INCREMENT(state)
    // asegurar resultado
    expect(state.count).to.equal(1)
  })
})
```

### Probando acciones

Las acciones pueden ser un poco más complejas ya que pueden llamar APIs externas. Cuando probamos acciones, por lo general tenemos que hacer un cierto nivel de simulación - por ejemplo, podemos abstraer las llamadas a la API en un servicio y simular ese servicio dentro de nuestras pruebas. Con el fin de simular fácilmente las dependencias, podemos utilizar Webpack e [inject-loader](https://github.com/plasticine/inject-loader) para compilar nuestros archivos de pruebas.

Ejemplo probando una acción asíncrona:

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

// usa la sintaxis 'require' para los cargadores en línea.
// con inject-loader, esto devuelve un 'module factory'
// que nos permite inyectar dependencias simuladas.
import { expect } from 'chai'
const actionsInjector = require('inject!./actions')

// crea el módulo con nuestras simulaciones
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* mocked response */ ])
      }, 100)
    }
  }
})

// helper para probar la acción con mutaciones esperadas
const testAction = (action, args, state, expectedMutations, done) => {
  let count = 0
  // simular despacho
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
  // llama a la acción con almacén y argumentos simulados
  action({dispatch, state}, ...args)

  // comprobar si no deberían haber sido despachadas mutaciones
  if (count === 0) {
    expect(expectedMutations.length).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, [], {}, [
      { name: 'REQUEST_PRODUCTS' },
      { name: 'RECEIVE_PRODUCTS', payload: [ /* respuesta simulada */ ] }
    ], done)
  })
})
```

### Ejecutando pruebas

Si tus mutaciones y acciones son correctamente escritos, las pruebas deberían no tener dependencia directa de las APIs de navegador después de una simulación apropiada. De esta manera puedes simplemente agrupar las pruebas con Webpack y ejecutarlas directamente en Node. Como alternativa, puedes usar `mocha-loader` o Karma + `karma-webpack` para ejecutar las pruebas en navegadores reales.

#### Ejecutando en Node

Crea la siguiente configuración webpack:

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

Entonces:

``` bash
webpack
mocha test-bundle.js
```

#### Ejecutando en navegadores

1. Instala `mocha-loader`
2. Cambia el `entry` de la configuración de Webpack anterior a `'mocha!babel!./test.js'`.
3. Inicia `webpack-dev-server` utilizando la configuración
4. Ves a `localhost:8080/webpack-dev-server/test-bundle`.

#### Ejecutando en navegador con Karma + karma-webpack

Consulta la configuración en la documentación de [vue-loader](http://vuejs.github.io/vue-loader/workflow/testing.html).
