# Mutaciones

La única manera de modificar realmente el estado de un _store_ de Vuex es emitiendo una mutación. Las mutaciones de Vuex son muy similares a los eventos: cada una posee una cadena de texto **type** y una función **handler**. La función controladora (_handler_) es donde se realiza la modificación del estado y lo recibirá como primer parámetro:

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // Modificar el estado
      state.count++
    }
  }
})
```

No puedes ejecutar directamente una función controladora. Las alternativas aquí son similares a registrar un evento: "Cuando una mutación del tipo `increment` es emitida, ejecuta esta función controladora". Para invocar al controladora de la mutación, necesitas ejecutar **store.commit** con su tipo:

``` js
store.commit('increment')
```

### Emitiendo mutaciones con información extra

Puedes pasar parámetros adicionales a `store.commit`:

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

La mayor parte del tiempo, esta información extra debe ser un objeto para poder contener múltiples campos y que la mutación registrada sea más descriptiva:

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

### Emisión de mutaciones con objetos

Otra manera de emitir una mutación es utilizar directamente un objeto que tenga una propiedad `type`:

``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

Cuando utilices esta sintaxis, el objeto entero será pasado como parámetro a la función controladora de la mutación, por lo que esta no se modifica:

``` js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### Las mutaciones cumplen con las reglas de reactividad de Vue

Dado que el estado de los _store_ de Vuex es reactivo cuando lo modifiquemos, los componentes de Vue observandolo se actualizaran automáticamente. Esto significa si utilizas las mutaciones de Vuex debes tener en cuenta las mismas advertencias de reactividad que si trabajases con Vue directamente:

1. Inicializa el estado de tu _store_ declarando todas las propiedades que vayas a utilizar.

2. Cuando añadas una nueva propiedad a un objeto, debes:

  - Usar `Vue.set(obj, 'newProp', 123)`, o -

  - Reemplazar el objeto por uno nuevo. Por ejemplo, utilizando la [sintaxis de propagación de objetos](https://github.com/sebmarkbage/ecmascript-rest-spread) podemos escribirlo de la siguiente manera:

    ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### Utilizando constantes para los tipos de mutaciones

Es un patrón común utilizar constantes para los tipos de mutaciones en varias implementaciones de Flux. Esto permite aprovechar las ventajas de herramientas como los _linters_ y declarar todas las constantes en un solo archivo facilita la visualización por parte de los colaboradores de todas las mutaciones posibles en la aplicación:

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
    // podemos utilizar la característica de ES2015 de nombre computado
    // para usar una constante como nombre de la función
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

A pesar que utilizar constantes es claramente una decisión personal - puede ser útil en proyectos grandes con muchos desarrolladores, pero es totalmente opcional si no te gustan.

### Las mutaciones deben ser síncronas

Una regla importante que recordar es que **las funciones controladoras de las mutaciones deben ser síncronas**. ¿Por qué? Considera el siguiente ejmplo:

``` js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Ahora imagina que estás depurando la aplicación observando los registros de mutación de vue-devtools. Para cada mutación registrada, vue-devtool necesitará capturar instantáneas "anteriores" y "posteriores" del estado. Sin embargo, las _callbacks_ asíncronas dentro de la mutación del ejemplo anterior no lo permiten: la _callback_ no ha sido ejecutada cuando se emite la mutación, y no hay manera para vue-devtool de saber cuando será ejecutada - ¡por lo que cualquier mutación realizada en la _callback_ es irregistrable!

### Emitiendo mutaciones en los componentes

Puedes emitir mutaciones en los componentes ejecutando `this.$store.commit('xxx')`, o usando la función auxiliar `mapMutations` la cual mapea las llamadas a `store.commit` a métodos de los componentes (requiere haber inyectado el `store` en la instancia principal):

``` js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment' // mapea this.increment() a this.$store.commit('increment')
    ]),
    ...mapMutations({
      add: 'increment' // mapea this.add() a this.$store.commit('increment')
    })
  }
}
```

### Hacia las acciones

La asincronicidad combinada con las mutaciones de estado pueden hacer que el código de tu aplicación sea difícil de razonar. Por ejemplo, cuando ejecutas dos métodos con _callbacks_ asíncronas que modifican el estado, ¿cómo sabes cuando son ejecutadas y cúal lo hace primero? Esto es exactamente por que queremos separar los dos conceptos. En Vuex, **las mutaciones son transacciones síncronas**

``` js
store.commit('increment')
// cualquier cambio de estado que la mutación "increment" pueda causar
// debe ser hecha ahora mismo
```

Para manejar operaciones asíncronas, introducimos las [acciones](actions.md).
