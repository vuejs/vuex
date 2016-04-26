# Acciones

> Acciones en Vuex son de hecho "creadores de acción" en las definiciones de vanilla flux, pero encuentro ese término más confuso que útil.

Acciones son simplemente funciones que despachan mutaciones. Por convenio, las acciones de Vuex siempre esperan una instancia del almacén como su primer argumento, seguido por argumentos adicionales opcionales.

``` js
// la acción más simple
function increment (store) {
  store.dispatch('INCREMENT')
}

// acción con argumentos adicionales
// usando la destructuración de argumentos del ES2015
function incrementBy ({ dispatch }, amount) {
  dispatch('INCREMENT', amount)
}
```

Esto puede parecer tonto a primera vista: ¿Por qué no despachamos las mutaciones directamente? Bien, recuerda que **las mutaciones deben ser síncronas**. Las acciones no. Podemos realizar operaciones **asíncronas** dentro de una acción:

``` js
function incrementAsync ({ dispatch }) {
  setTimeout(() => {
    dispatch('INCREMENT')
  }, 1000)
}
```

Un ejemplo más práctico sería una acción para procesar un carrito de la compra, lo cual involucra **llamar a una API asíncrona** y **despachar múltiples mutaciones**:

``` js
function checkout ({ dispatch, state }, products) {
  // guarda los actuales artículos del carrito
  const savedCartItems = [...state.cart.added]
  // envía la solicitud y con optimismo vacía el carrito
  dispatch(types.CHECKOUT_REQUEST)
  // el API de la tienda acepta una retrollamada en caso de éxito
  // y otra en caso de fallo
  shop.buyProducts(
    products,
    // éxito
    () => dispatch(types.CHECKOUT_SUCCESS),
    // fallo
    () => dispatch(types.CHECKOUT_FAILURE, savedCartItems)
  )
}
```

Ten en cuenta que en vez de esperar valores de retorno o pasar retrollamadas a acciones, el resultado de llamar al API asíncrono es también gestionado despachando mutaciones. La regla de oro es que **los únicos efectos secundarios producidos por llamar acciones deberían ser mutaciones despachadas**.

### Llamando acciones en componentes

Puedes haber notado que las funciones asociadas a las acciones no son directamente ejecutables sin la referencia a una instancia del almacén. Técnicamente, podemos invocar una acción llamando `action(this.$store)` dentro de un método, pero es mejor si directamente podemos asignar las acciones como métodos de los componentes para así poder fácilmente referenciarlos dentro de las plantillas. Podemos hacerlo usando la opción `vuex.actions`:

``` js
// dentro del componente
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... }, // getters del estado
    actions: {
      incrementBy // abreviación de un objeto literal en ES6, asignación usando el mismo nombre
    }
  }
})
```

Lo que el código anterior hace es asignar la acción pura `incrementBy` a la instancia del almacén del componente, y exponerlo en el componente como un método de instancia, `vm.incrementBy`. Cualquier argumento pasado a `vm.incrementBy` será pasado a la función de la acción después del primer argumento que es el almacén, así pues:

``` js
vm.incrementBy(1)
```

es equivalente a:

``` js
incrementBy(vm.$store, 1)
```

Pero la ventaja es que se puede asignar más fácilmente dentro de la plantilla del componente:

``` html
<button v-on:click="incrementBy(1)">incrementar por uno</button>
```

Puedes obviamente usar un nombre de método diferente cuando asignes las acciones:

``` js
// dentro del componente
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions: {
      plus: incrementBy // asignar usando un nombre diferente
    }
  }
})
```

Ahora la acción será asignada como `vm.plus` en vez de `vm.incrementBy`.

### Acciones en línea

Si la acción es específica del componente, puedes usar un atajo y definirla en línea:

``` js
const vm = new Vue({
  vuex: {
    getters: { ... },
    actions: {
      plus: ({ dispatch }) => dispatch('INCREMENT')
    }
  }
})
```

### Asignando todas las acciones

Si simplemente quieres asignar todas las acciones compartidas:

``` js
import * as actions from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions // asignar todas las acciones
  }
})
```
