# Mutaciones

Las mutaciones Vuex son esencialmente eventos: cada mutación tiene un **nombre** y un **manejador**. La función del manejador recibirá el estado como el primer argumento:

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state) {
      // mutar estado
      state.count++
    }
  }
})
```

El uso de mayúsculas para los nombres de mutación es sólo una convención para que sea más fácil diferenciarlos de las funciones planas.

No puedes llamar directamente a un manejador de mutación. Las opciones aquí son más bien un registro de eventos: "Cuando un evento `INCREMENT` es despachado, llama a este manejador." Para invocar un manejador de mutación, es necesario despachar un evento de mutación:

``` js
store.dispatch('INCREMENT')
```

### Despachar con argumentos

También es posible pasar argumentos:

``` js
// ...
mutations: {
  INCREMENT (state, n) {
    state.count += n
  }
}
```
``` js
store.dispatch('INCREMENT', 10)
```

Aquí `10` será pasado al controlador de la mutación como el segundo argumento siguiendo `state`. Lo mismo para cualquier argumento adicional. Estos argumentos se denominan **carga útil** o "payload" para la mutación dada.

### Despacho al estilo objeto

> requiere >=0.6.2

También puedes despachar mutaciones utilizando objetos:

``` js
store.dispatch({
  type: 'INCREMENT',
  payload: 10
})
```

Ten en cuenta que cuando uses el estilo objeto debes incluir todos los argumentos como propiedades en el objeto despachado. El objeto entero será pasado como el segundo argumento a los manipuladores de mutación:

``` js
mutations: {
  INCREMENT (state, mutation) {
    state.count += mutation.payload
  }
}
```

### Despacho silencioso

> requiere >=0.6.3

En algunos casos puede que no desees que los middlewares registren el cambio de estado. Múltiples despachos al almacén en un período corto o encuestados no siempre tienen que ser rastreados. En estas situaciones puede considerarse apropiado silenciar las mutaciones.

*Nota:* Esto debería evitarse cuando sea necesario. Las mutaciones silenciosas rompen el contrato de todos los cambios de estado siendo rastreados por el devtool. Utilizar con moderación y cuando sea absolutamente necesario.

Despachar sin golpear middlewares se puede lograr con un indicador `silent`.

``` js
/**
 * Ejemplo: Acción de progreso.
 * Despacha a menudo cambios que no necesariamente deben ser rastreados
 **/
export function start(store, options = {}) {
  let timer = setInterval(() => {
    store.dispatch({
      type: INCREMENT,
      silent: true,
      payload: {
        amount: 1,
      },
    });
    if (store.state.progress === 100) {
      clearInterval(timer);
    }
  }, 10);
}
```

### Las mutaciones siguen las reglas de reactividad de Vue

Dado que el estado de almacenes Vuex es hecho reactivo por Vue, cuando mutamos el estado, componentes Vue que estén observando el estado se actualizarán automáticamente. Esto también significa que las mutaciones Vuex están sujetas a las mismas advertencias de reactividad que cuando se trabaja con Vue a secas:

1. Prefiere inicializar el estado inicial de tu almacén con todos los campos deseados por adelantado.

2. Cuando se añaden nuevas propiedades a un Objeto, deberás:

  - Usar `Vue.set(obj, 'newProp', 123)`, o -

  - Sustituir ese Objeto con uno nuevo. Por ejemplo, usando la etapa-2 [sintaxis de objetos de propagación](https://github.com/sebmarkbage/ecmascript-rest-spread) podemos escribirla así:

  ``` js
  state.obj = { ...state.obj, newProp: 123 }
  ```

### Usando constantes para los nombres de mutación

También es común el uso de constantes para los nombres de mutación - permiten al código tomar ventaja de herramientas como linters, y poniendo todas las constantes en un archivo único permite a tus colaboradores obtener de un vistazo qué mutaciones son posibles en toda la aplicación:

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
  actions: { ... },
  mutations: {
    // podemos utilizar la función nombre de propiedad computerizada del ES2015
    // para usar una constante como el nombre de la función
    [SOME_MUTATION] (state) {
      // mutar estado
    }
  }
})
```

Utilizar constantes es en gran parte una preferencia - puede ser útil en grandes proyectos con muchos desarrolladores, pero es totalmente opcional si no te gustan.

### Las mutaciones deben ser síncronas

Una regla importante a recordar es que **las funciones de controlador de mutación deben ser síncronas**. ¿Por qué? Considera el siguiente ejemplo:

``` js
mutations: {
  SOME_MUTATION (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Ahora imaginemos que estamos depurando la app y mirando nuestros registros de mutación. Por cada mutación anotada, queremos ser capaces de comparar capturas de estado *antes* y *después* de la mutación. Sin embargo, la retrollamada asíncrona dentro de la mutación del ejemplo anterior lo hace imposible: la retrollamada no es ejecutada todavía cuando la mutación es despachada, y no sabemos cuándo la retrollamada será realmente ejecutada. Cualquier mutación de estado realizada en la retrollamada es esencialmente no rastreable!

### Sobre acciones

Asincronía combinada con mutación de estado puede hacer que tu programa sea muy difícil de razonar. Por ejemplo, cuando llames a dos métodos los dos con devoluciones de llamada asíncronas que mutan el estado, ¿cómo sabes cuando son llamadas y cual retrollamada se ejecutó primero? Esto es exactamente por lo que queremos separar los dos conceptos. En Vuex, llevamos a cabo todas las mutaciones de estado de manera síncrona. Realizaremos todas las operaciones asíncronas dentro de [acciones](actions.md).
