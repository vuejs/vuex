# Estructura de la aplicación

Vuex en realidad no restringe la forma de estructurar tu código. Más bien, hace cumplir un conjunto de principios de alto nivel:

1. El estado de la aplicación es retenido en el almacén, como un solo objeto.

2. La única forma de mutar el estado es despachando mutaciones en el almacén.

3. Las mutaciones deben ser síncronas, y los únicos efectos secundarios que producen debería ser mutar el estado.

4. Podemos exponer una API de mutación de estado más expresiva mediante la definición de acciones. Las acciones pueden encapsular lógica asincrónica como ir a buscar los datos, y los únicos efectos secundarios que producen debería ser despachar mutaciones.

5. Los componentes utilizan obtenedores para recuperar el estado del almacén, y llaman acciones para mutar el estado.

Lo bueno de las mutaciones Vuex, acciones y obtenedores es que **todos ellos son simplemente funciones**. Mientras sigas estas reglas, depende de ti cómo estructurar tu proyecto. Sin embargo, es bueno tener algunas convenciones para que puedas familiarizarte al instante con otro proyecto que utilice Vuex, así que aquí tienes algunas estructuras recomendadas en función de la escala de tu aplicación.

### Proyecto simple

Para un proyecto sencillo, simplemente podemos definir el **almacén** y las **acciones** en los archivos respectivos:

``` bash
.
├── index.html
├── main.js
├── components
│   ├── App.vue
│   └── ...
└── vuex
    ├── store.js     # exporta el almacén (con el estado inicial y mutaciones)
    └── actions.js   # exporta todas las acciones
```

Para un ejemplo real, echa un vistazo al [ejemplo Contador](https://github.com/vuejs/vuex/tree/master/examples/counter) o al [ejemplo TodoMVC](https://github.com/vuejs/vuex/tree/master/examples/todomvc).

Como alternativa, también puedes separar las mutaciones en su propio archivo.

### Proyecto mediano o grande

Para cualquier aplicación no trivial, es probable que queramos seguir dividiendo aún más el código relacionado con Vuex en múltiples "módulos" (más o menos comparable a "almacenes" en vainilla Flux, y "reductores" en Redux), cada uno dedicado a un dominio específico de nuestra aplicación. Cada módulo estaría administrando un sub-árbol del estado, exportando el estado inicial para ese sub-árbol y todas las mutaciones que operan en ese sub-árbol:

``` bash
├── index.html
├── main.js
├── api
│   └── ... # abstracciones para hacer solicitudes de API
├── components
│   ├── App.vue
│   └── ...
└── vuex
    ├── actions.js        # exporta todas las acciones
    ├── store.js          # donde montamos los módulos y exportamos el almacén
    ├── mutation-types.js # constantes
    └── modules
        ├── cart.js       # estado y mutaciones para el carro
        └── products.js   # estado y mutaciones para los productos
```

Un módulo típico luce así:

``` js
// vuex/modules/products.js
import {
  RECEIVE_PRODUCTS,
  ADD_TO_CART
} from '../mutation-types'

// estado inicial
const state = {
  all: []
}

// mutaciones
const mutations = {
  [RECEIVE_PRODUCTS] (state, products) {
    state.all = products
  },

  [ADD_TO_CART] (state, productId) {
    state.all.find(p => p.id === productId).inventory--
  }
}

export default {
  state,
  mutations
}
```

Y en `vuex/store.js`, "ensamblamos" múltiples módulos juntos para crear la instancia Vuex:

``` js
// vuex/store.js
import Vue from 'vue'
import Vuex from '../../../src'
// importa partes de los módulos
import cart from './modules/cart'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  // combina sub-módulos
  modules: {
    cart,
    products
  }
})
```

Aquí, el estado inicial del módulo `cart` será adjuntado al árbol raíz del estado como `store.state.cart`. Además, **todas las mutaciones definidas en un sub-módulo solamente reciben el estado del sub-árbol al que están asociadas**. Así mutaciones definidas en el módulo `cart` recibirán `store.state.cart` como primer argumento.

La raíz del estado del sub-árbol es insustituible dentro del propio módulo. Por ejemplo esto no funcionará:

``` js
const mutations = {
  SOME_MUTATION (state) {
    state = { ... }
  }
}
```

En su lugar, siempre almacena el estado concreto como una propiedad de la raíz del sub-árbol:

``` js
const mutations = {
  SOME_MUTATION (state) {
    state.value = { ... }
  }
}
```

Dado que todos los módulos simplemente exportan objetos y funciones, son bastante fáciles de probar y mantener, y pueden ser recargados en vivo. También eres libre de alterar los patrones utilizados aquí para encontrar una estructura que se adapte a tus preferencias.

Ten en cuenta que no ponemos las acciones en módulos, ya que una sola acción puede despachar mutaciones que afectan a múltiples módulos. Es también una buena idea desacoplar las acciones de la forma del estado y los detalles de implementación de mutaciones para una mejor separación de los cometidos. Si el archivo de acciones se hace demasiado grande, podemos convertirlo en una carpeta y separar las implementaciones de acciones asíncronas largas en archivos individuales.

Para un ejemplo real, echa un vistazo al [ejemplo Carrito](https://github.com/vuejs/vuex/tree/master/examples/shopping-cart).
