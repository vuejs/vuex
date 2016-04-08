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

Forse avrete notato che le azioni, e le funzioni legate ad esse, non possono essere chiamate direttamente senza una referenza all'istanza dello store. Tecnicamente si potrebbe fare chiamando `action(this.$store)` internamente ad un metodo, è comunque consigliato esporre un set di API dal componente tramite `vuex.actions`, per esempio:

``` js
// internamente ad un componente
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... }, // i getter
    actions: {
      incrementBy // Utilizziamo la sintassi ES6 per gli oggetti
    }
  }
})
```

Il codice appena visto lega l'azione `incrementBy` con l'istanza di uguale nome nello store ed espone tale istanza al componente tramite `vm.incrementBy`. Tutti gli argomenti passati ad `vm.incrementBy` saranno passai prima all'azione e poi allo store in questo modo:

``` js
vm.incrementBy(1)
```

è uguale a scrivere:

``` js
incrementBy(vm.$store, 1)
```

ma il beneficio di avere tale sintassi è che ora possiamo usare:

``` html
<button v-on:click="incrementBy(1)">Incrementa di uno</button>
```

Ovviamente potete utilizzare un altro nome dentro il componente, l'importante è referenziarlo all'istanza nello store:

``` js
// il componente
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions: {
      plus: incrementBy // usiamo un altro nome
    }
  }
})
```

Ora l'action sarà legata a `vm.plus` invece che `vm.incrementBy`.

### Action Inline

Se un'azione è specifica per un determinato componente, allora possiamo usare una scorciatoia e definirla inline:

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

### Legare tutte le Action

Possiamo vincolare un componente ad avere tutte le action senza specificarne nessuna:

``` js
import * as actions from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions // il componente ora accede a tutte le action
  }
})
```
