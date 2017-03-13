# Acciones

Las acciones son similares a las mutaciones. Las diferencias son:

- En lugar de mutar el estado, las acciones commitean mutaciones.
- Un acción puede contener operaciones asíncronas.

Registremos una acción sencilla:

``` js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

La función handler de una acción recibe un Objeto contexto que expone los mismos métodos y propiedades disponibles en una instancia de almacén. Por lo tanto puedes ejecutar `context.commit` para commitear una mutación o acceder al estado ó getters a través de `context.state` ó `context.getters`. Veremos porque este Objeto contexto no es la instancia del almacén en sí cuando presentemos los [Modules](modules.md).

En la práctica usaremos con frecuencia la [desestructuración de argumentos](https://github.com/lukehoban/es6features#destructuring) de ES2015 para simplificar nuestro código (especialmente cuando tengamos que llamar a `commit` múltiples veces).

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### Ejecutar Acciones

Las acciones pueden ser ejecutadas con el método `store.dispatch`:

``` js
store.dispatch('increment')
```

Esto puede parecer algo inútil a primera vista: si queremos incrementar el contador, ¿por qué no llamar a `store.commit('increment')` directamente? Recordemos que **las mutaciones deben ser síncronas**. Las acciones no se acogen a esta limitación por lo tanto pueden contener operaciones asíncronas:

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Las acciones pueden ser ejecutadas con el mismo formado de payload y estilo-objeto que las mutaciones:

``` js
// Ejecutar con payload
store.dispatch('incrementAsync', {
  amount: 10
})

// Ejecutar con un object
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

Un ejemplo más real puede ser una acción de confirmación de un carrito de compra, el cual puede incluir **llamas asíncronas a APIs** y **commitear múltiples mutaciones**.

``` js
actions: {
  checkout ({ commit, state }, products) {
    // Guardar referencia de los productos actualmente en el carrito
    const savedCartItems = [...state.cart.added]
    // Enviar una petición de confirmación, modo optimista
    // Limpiar el carrito
    commit(types.CHECKOUT_REQUEST)
    // La API accepta callbacks de error y éxito
    shop.buyProducts(
      products,
      // Gestión caso éxito
      () => commit(types.CHECKOUT_SUCCESS),
      // Gestión caso error
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

Hagase notar que estamos ejecutando un flujo de operaciones asíncronas y registrando los efectos laterales (modificaciones de estado) de la acción por medio de commits.

### Ejecutar Acciones en Componentes

Puedes ejecutar acciones en componentes con `this.$store.dispatch('xxx')` ó hacer uso del helper `mapActions` para mapear métodos del componente a llamadas tipo `store.dispatch` (esto require de la inyección de `store` en el Root).

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // Mapear this.increment() a this.$store.dispatch('increment')
      
      // mapActions también acepta payloads:
      'incrementBy' // this.incrementBy(amount) se mapea a this.$store.dispatch('incrementBy', amount)
    ]),
    ...mapActions({
      add: 'increment' // map this.add() to this.$store.dispatch('increment')
    })
  }
}
```

### Composición de Acciones

Las acciones son a menudo asíncronas. ¿Como sabremos que han terminado su rutina? Es más, ¿como compondremos múltiples acciones juntas para gestionar un flujo asíncrono más complejo?

Lo primero que hay que saber es que `store.dispatch` puede manejar Promesas (Promise) retornadas por el hanlder ejecutado, devolviendo a su vez una Promesa.

``` js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

Ahora puedes hacer:

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

Y en otra acción:

``` js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

Finalmente puedes hacer uso de [async / await](https://tc39.github.io/ecmascript-asyncawait/), nueva funcionalidad de JavaScript que llegará muy pronto. Con ella podemos componer acciones de la siguiente manera:

``` js
// Asimuendo que getData() y getOtherData() devuelven Promesas

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // wait for actionA to finish
    commit('gotOtherData', await getOtherData())
  }
}
```

> Es posible que `store.dispatch` lance múltiples acciones en diferentes módulos. En ese caso, el valor devuelto será una Promesa que se resolverá cuando todos los handlers de las acciones se hayan resuelto.
