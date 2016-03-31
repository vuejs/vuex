# Struttura dell'Applicazione

Vuex non ti obbliga a seguire nessuna convenzione per quanto riguarda la struttura del codice però ci sono dei principi che possono essere utili e vale la pena tenere in considerazione:

1. Lo stato dell'Applicazione è conservato in uno store, il quale è un singolo oggetto.

2. L'unico modo di mutare lo stato è quello di inviare una mutation allo store.

3. Le mutation sono sincrone, l'unico effetto che devono avere è quello di mutare uno stato.

4. Possiamo esporre uno strato più complesso di API tramite le action. Le action possono incapsulare mutation e codice asincrono ma il fine ultimo di una action dev'essere sempre quello che attivare una mutation.

5. I Componenti usano i getter per prelevare gli stati dallo store e chiamano le azioni per mutarli.

La cosa interessante delle mutation, action e getter in Vuex è il fatto che **sono tutte funzioni javascript**. Se seguirete queste piccole regolette sarà più facile interscambiare la logica tra progetti che utilizzano VuexT. Di seguito sono mostrate delle strutture di base per i vostri progetti in Vuex.

### Progetto Semplice

Quando si parla di applicazioni semplici possiamo definire **store** e **actions** in due file separati:

``` bash
.
├── index.html
├── main.js
├── components
│   ├── App.vue
│   └── ...
└── vuex
    ├── store.js     # file per lo store
    └── actions.js   # file per le action
```

Per un esempio pratico potete rivedere [L'esempio del Contatore](https://github.com/vuejs/vuex/tree/master/examples/counter) oppureß [L'esempio TodoMVC](https://github.com/vuejs/vuex/tree/master/examples/todomvc).

Alternativamente potete anche suddividere le mutation in un file a se stante.

### Medium to Large Project

Per tutte quelle applicazioni di medie o grosse dimensioni la struttura di Vuex può differire rispetto a quella vista precedentemente. Per esempio la suddivisione del codice in moduli atomici per ogni vario stato da monitorare (molto simile alla logica degli store in Flux o ai reducers in Redux), ognuno dei quali si occupa di uno specifico dominio nella vostra applicazione ecco un esempio di struttura:

``` bash
├── index.html
├── main.js
├── api
│   └── ... # api request
├── components
│   ├── App.vue
│   └── ...
└── vuex
    ├── actions.js        # Tutte le azioni
    ├── store.js          # Qui assembliamo i moduli
    ├── mutation-types.js # costanti globali
    └── modules
        ├── cart.js       # lo stato e le mutation per il carrello
        └── products.js   # lo stato e le mutation per i prodotti
```

Un modulo, di solito, assomiglia a qualcosa del tipo:

``` js
// vuex/modules/products.js
import {
  RECEIVE_PRODUCTS,
  ADD_TO_CART
} from '../mutation-types'

// stato iniziale
const state = {
  all: []
}

// mutations
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

Ed in vuex/store.js, possiamo assemblare tutti i moduli:

``` js
// vuex/store.js
import Vue from 'vue'
import Vuex from '../../../src'
// importiamo i moduli
import cart from './modules/cart'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  // combiniamoli
  modules: {
    cart,
    products
  }
})
```

Lo stato iniziale di `cart` verrà legato alla root dell'albero degli stati in modo tale da ottenere `store.state.cart`. In aggiunta **tutte le mutation sono definite in un sub modulo e ricevono solo lo stato associato a tale sub modulo**. Questo significa che il modulo `cart` riceverà sempre `store.state.cart` come primo argomento.

L'albero degli stati, e la sua root, non possono essere rimpiazzati all'interno dei moduli. Per esempio questo codice non funzionerà:

``` js
const mutations = {
  SOME_MUTATION (state) {
    state = { ... }
  }
}
```

Invece questo codice contiene la logica giusta per gestire gli alberi di ogni sub modulo:

``` js
const mutations = {
  SOME_MUTATION (state) {
    state.value = { ... }
  }
}
```

Dato che tutti i moduli esportano semplici funzioni ed oggetti javascript essi sono facili da testare e mantenere ma, soprattutto, possono essere aggiornati tramite "hot-reload". Ovviamente la guida descritta sopra è solo un indicazione di come dovrebbe essere strutturata un'applicazione tramite Vuex. Potete usare qualsiasi struttura voi riteniate adeguata.

Si noti che non ci sono action nei moduli, questo perchè una singola azione può attivare differenti mutation in differenti moduli. E' sempre una buona idea separare le action dall'implementazione dei moduli.

Per un esempio concreto potete rivedere [il Carrello della Spesa in Vuex](https://github.com/vuejs/vuex/tree/master/examples/shopping-cart).
