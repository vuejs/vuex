# Actions

> Le azioni, action, in Vuex sono i cosidetti "Actions creator" nel mondo di Flux. Ma questo termine è fuorviante.

Le action sono semplici funzioni che inviano le mutation. Per convenzione, le action in Vuex si aspettano sempre un istanza di store come primo argomento, seguito da altri argomenti opzionali:

``` js
// l'action più semplice
function increment (store) {
  store.dispatch('INCREMENT')
}

// una semplice azione con più argomenti
// che sfrutta il distruttore dei ES2015
function incrementBy ({ dispatch }, amount) {
  dispatch('INCREMENT', amount)
}
```

La domanda può sorgere spontanea, perchè non inviamo direttamente le mutation senza passare per le azioni? Ricordate che **le mutation sono sempre sincrone**? Bene, tramite le action noi possiamo scavalcare questo problema in quanto, internamente ad una action, possiamo gestire codice asincrono!

``` js
function incrementAsync ({ dispatch }) {
  setTimeout(() => {
    dispatch('INCREMENT')
  }, 1000)
}
```

Un esempio pratico può essere il sistema di checkout di un carrello che richiede **chiamate asincrone ad API** e **l'invio di mutation multiple**:

``` js
function checkout ({ dispatch, state }, products) {
  // salviamo l'oggetto corrente
  const savedCartItems = [...state.cart.added]
  // inviamo una richiesta di checkout
  dispatch(types.CHECKOUT_REQUEST)
  // in questo caso le API accettano due callback per success e failure
  shop.buyProducts(
    products,
    // success
    () => dispatch(types.CHECKOUT_SUCCESS),
    // failure
    () => dispatch(types.CHECKOUT_FAILURE, savedCartItems)
  )
}
```

Si noti che invece di aspettarsi un valore di ritorno, la gestione delle API asincrone è fatta chiamando altre mutation. Possiamo quindi definire una regola di base dove **l'unico effetto prodotto dalla chiamata ad azioni è l'invio di mutation**.

### Chiamare gli Action nei Componenti

You may have noticed that action functions are not directly callable without reference to a store instance. Technically, we can invoke an action by calling `action(this.$store)` inside a method, but it's better if we can directly expose "bound" versions of actions as the component's methods so that we can easily refer to them inside templates. We can do that using the `vuex.actions` option:

``` js
// inside a component
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... }, // state getters
    actions: {
      incrementBy // ES6 object literal shorthand, bind using the same name
    }
  }
})
```

What the above code does is binding the raw `incrementBy` action to the component's store instance, and expose it on the component as an instance method, `vm.incrementBy`. Any arguments passed to `vm.incrementBy` will be passed to the raw action function after the first argument which is the store, so calling:

``` js
vm.incrementBy(1)
```

is equivalent to:

``` js
incrementBy(vm.$store, 1)
```

But the benefit is that we can bind to it more easily inside the component's template:

``` html
<button v-on:click="incrementBy(1)">increment by one</button>
```

You can obviously use a different method name when binding actions:

``` js
// inside a component
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions: {
      plus: incrementBy // bind using a different name
    }
  }
})
```

Now the action will be bound as `vm.plus` instead of `vm.incrementBy`.

### Inline Actions

If an action is specific to a component, you can take the shortcut and just define it inline:

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

### Binding All Actions

If you simply want to bind all the shared actions:

``` js
import * as actions from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions // bind all actions
  }
})
```
