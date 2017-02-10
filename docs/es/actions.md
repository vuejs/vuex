# Acciones

Las acciones son similares a las mutaciones, con la diferencia que:

- En lugar de modificar el estado, las acciones emiten mutaciones.
- Las acciones pueden contener operaciones asíncronas.

Registremos una acción simple:

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

Las funciones controladoras de las acciones reciben un objeto de contexto, el cual expone el mismo conjunto de métodos/propiedades encontrados en la instancia del _store_, por lo que puedes ejecutar `context.commit` para emitir una mutación, o acceder al estado y _getters_ a través de `context.state` y `context.getters`. Veremos por qué este objeto de contexto no es la instancia propiamente dicha cuando introduzcamos los [módulos](modules.md) más adelante.

En la práctica, normalmente utilizamos la [desestructuración de argumentos de ES2015](https://github.com/lukehoban/es6features#destructuring) para simplificar un poco el código (especialmente cuando necesitamos ejecutar `commit` muchas veces):

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### Enviando acciones

Las acciones son disparadas con el método `store.dispatch`:

``` js
store.dispatch('increment')
```

Esto puede parecer tonto a primera vista: si queremos incrementar el contador, ¿por qué no ejecutamos directamente `store.commit('increment')`? Bueno, ¿recuerdas que **las mutaciones deben ser síncronas**? Las acciones no. Podemos realizar operacions **asíncronas** dentro de las acciones:

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Las acciones soportan el mismo formato de parámetros adicionales e información extra con el formato de objetos:

``` js
// envio con parámtros adicionales
store.dispatch('incrementAsync', {
  amount: 10
})

// envio con un objeto
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

Un ejemplo más cercano al mundo real sería una acción para verificar un carrito de compras, lo cual involucaría **llamadas a una API asíncrona** y **emitir múltiples mutaciones**:

``` js
actions: {
  checkout ({ commit, state }, products) {
    // guardar los elementos que se encuentran actualmente en el carrito
    const savedCartItems = [...state.cart.added]
    // enviar pedidos de verificación y limpiar el carrito
    commit(types.CHECKOUT_REQUEST)
    // la API de la tienda acepta _callbacks_ en caso de éxito y falla
    shop.buyProducts(
      products,
      // manejamos el éxito
      () => commit(types.CHECKOUT_SUCCESS),
      // manejamos la falla
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

Nota que estamos utilizando un flujo de operaciones asíncronas y registrando los efectos colaterales (mutaciones de estado) de la acción cuando las emitimos.

### Enviando acciones dentro de componentes

Puedes enviar acciones dentro de los componentes con `this.$store.dispatch('xxx')`, o usando la función auxiliar `mapActions` la cual mapea métodos del componente a llamadas a `store.dispatch` (requiere haber inyectado el `store` en la instancia principal):

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment' // mapea this.increment() a this.$store.dispatch('increment')
    ]),
    ...mapActions({
      add: 'increment' // mapea this.add() a this.$store.dispatch('increment')
    })
  }
}
```

### Componiendo acciones

Las acciones son usualmente asíncronas entonces, ¿cómo sabemos cuando una acción finalizó? Y más importante, ¿cómo componemos múltiples acciones juntas para manejar un flujo asíncrono complejo?

Lo primero que debes saber es que `store.dispatch` puede manejar una _Promise_ devuelta por la función controladora de la acción ejecutada y también devuelve una _Promise_:

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

Y también, en otra acción:

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

Finalmente, si usamos [async / await](https://tc39.github.io/ecmascript-asyncawait/), una característica de JavaScript que llegará pronto, podemos componer nuestras acciones de la siguiente manera:

``` js
// asumiendo que getData() y getOtherData() devuelven Promises

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

> Es posible que una llamada a `store.dispatch` dispare múltiples funciones controladoras de acciones en diferentes módulos. En ese caso, el valor retornado será una _Promise_ que se resuelve cuando todas estas funciones han sido resueltas.
