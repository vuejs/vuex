# Mutaciones

El único modo de realizar cambios en el estado de un almacén Vuex es lanzando (commiteando) una mutación. Las mutaciones Vuex se definien dentro de la propiedad `mutations` y són muy similares a eventos: cada mutación tiene un string **type** y un **handler** (función en la que definimos la acción). Será dentro del handler donde realicemos las modificaciones al estado y donde recibamos el estado como el 1er argumento:

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // modificación del estado
      state.count++
    }
  }
})
```

Una mutación no se puede ejecutar directamente. El proceso se parece más al registro de un evento: "Cuando una mutación de tipo `increment` sea lanzada, ejecuta este handler". Deberás invocar **store.commit** con el tipo de la mutación para ejecutar su repspectivo handler:

``` js
store.commit('increment')
```

### Commit con Datos

Puedes pasar un argumento adicional a `store.commit`, el cual llamaremos el **payload** de la mutación:

``` js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```
``` js
store.commit('increment', 10)
```

En la mayoría de los casos el payload deberá ser un objeto con el que pasaremos múltiples campos. Esto también hará que la llamada a la mutación quede mejor descrita:

``` js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```
``` js
store.commit('increment', {
  amount: 10
})
```

### Commit Estilo Objeto

Alternativamente podrás commitear una mutación pasando únicamente un objeto con una propiedad `type` cuyo valor será el nombre de la mutación:

``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

Cuando hagas commits con este estilo el objeto completo será pasado como payload al handler de la mutación:

``` js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### Las Mutaciones siguen las Reglas de Reactividad de Vue

Dado que un estado almacenado por Vuex es reactivo gracias a Vue, cuando el estado cambie lo componentes que lo observan se actualizarán automaticamente. Esto implica que las mutaciones Vuex están sujetas a las mismas restricciones de reactividad que limitan a cualquier instancia Vue:

1. Trata de inicializar el estado inicial de tu almacén con todas las propiedades includas de primeras

2. Cuando añadas nuevas propiedades a un Objeto, deberías:

  - Usas `Vue.set(obj, 'newProp', 123)`, ó -

  - Reemplazar el Objeto con uno nuevo. Por ejemplo, haciendo uso del stage-3 [operador spread](https://github.com/sebmarkbage/ecmascript-rest-spread) podemos escribir lo siguiente:

    ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### Using Constants for Mutation Types
### Usar Constantes para definir Tipos de Mutaciones

El uso de constantes es un patrón común a varías implementaciones de Flux. Esto permite que el código pueda hacer uso de herramientas como linters. También permite que todos los colaboradores de un proyecto puedan sepan de un vistazo que mutaciones hay disponibles:

``` js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

``` js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // Podemos usar sintaxis ES2015 para definir nombres computados de propiedades
    // y así usar una constante como nombre de un método
    [SOME_MUTATION] (state) {
      // modificar estado
    }
  }
})
```

Usar constantes o no es una cuestión de preferencias. Puede ser de ayuda en grandes proyectos con muchos desarrolladores, pero completamente opcional.

### Mutations Must Be Synchronous
### Toda Mutación tiene que ser Síncrona

Una regla importante a recordar es que **el handler de una mutación tiene que ser síncrono**. ¿Por qué? Considera el siguiente ejemplo:

``` js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Ahora imagina que estamos depurando la aplicación y miramos los registros de mutaciones realizadas en las devtools. Para cada mutación registrada, la devtool necesita capturar snapshots del estado antes y después de la modificación. Sin embargo, el callback asíncrono del ejemplo hace que sea imposible: el callback no se ha ejecutado cuando la mutación se ha completado y no hay manera de que las devtools sepan cuando se la callback será ejecutada. Cualquier mutación del estado realizada dentro de la callback es en esencia irrastreable!

### Commitear Mutaciones en Componentes

Puedes commitear mutaciones en componentes con `this.$store.commit('xxx')` o haciendo uso del helper `mapMutations` el cual mapea métodos del componente a llamadas a `store.commit` (esto require de la inyección del `store` a nivel de Root):

``` js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment' // Mapea this.increment() a this.$store.commit('increment')
    ]),
    ...mapMutations({
      add: 'increment' // map this.add() to this.$store.commit('increment')
    })
  }
}
```

### Y ... Acción!

Combinar asincronicidad con mutaciones de estado puede hacer que tu lógica de aplicación sea dificil de seguir. Por ejemplo, si ejecutas dos métodos asíncronos que mutan el estado, ¿cómo cuando terminan su rutina o cúal termina primero? Esta es la razón por la que queremos mantener los dos conceptos separados. En Vuex, **toda mutación es una transacción síncrona**:

``` js
store.commit('increment')
// Cualquier modificación del estado que realice "increment"
// debe ocurrir en este momento.
```

Para administrar operaciones asíncronas haremos uso de [Acciones](actions.md).
