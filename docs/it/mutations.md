# Mutations

In Vuex le mutations, o mutazioni, sono degli eventi essenziali: ogni mutazione ha un **nome** ed un **handler**. L'handler è la funzione che riceverà lo stato come primo argomento:

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state) {
      // stato in fase di mutazione
      state.count++
    }
  }
})
``` 

Utilizzare il nome della mutations tutto in maiuscolo è solo una convenzione che aiuta a distinguere le mutations da funzioni normali.

Non è possibile richiamare un handler direttamente. Bisogna registrarlo tramite il sistema di dispatch dello store: "Quando `INCREMENT` è in dispatch allora chiama questo handler", ecco un esempio pratico:

``` js
store.dispatch('INCREMENT')
```

### Disptach con Argomenti

E' possibile passare gli argomenti alla mutation:

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

In questo caso, `10` verrà passato al handler come secondo argomento. Nello specifico delle mutation questi argomenti vengono definiti **payload**.

### Disptach tramite Oggetti

> Richiede una versione >=0.6.2

Si può eseguire il dispatch delle mutation tramite oggetti:

``` js
store.dispatch({
  type: 'INCREMENT',
  payload: 10
})
```

Qundo si effettua questo tipo di dispatch, tramite oggetti, è buona norma includere tutti gli argomenti richiesti dalla mutation. Tutto l'oggetto verrà passato come secondo argomento all handler della mutation:

``` js
mutations: {
  INCREMENT (state, mutation) {
    state.count += mutation.payload
  }
}
```

### Le Mutation Seguono le Regole di Vue sulla Reattività

Dato che lo stato di Store in Vuex segue la filosofia "reattiva" di Vue, quando mutiamo uno stato, tutti i componenti che osservano tale stato riceveranno l'aggiornamento in modo automatico.
Questo significa che anche le mutation hanno bisogno di qualche precauzione:

1. E' preferibile inizializzare ogni stato all interno dello store.

2. Quando si aggiunge una proprietà ad un oggetto è consigliato:

  - Utilizzare `Vue.set(obj, 'newProp', 123)`, o -

  - Rimpiazzare l'oggetto corrente con uno nuovo che include la nuova proprietà. Per esempio utilizzando la `stage-2` della [sintassi di diffusione](https://github.com/sebmarkbage/ecmascript-rest-spread) possiamo scrivere una cosa del tipo:

  ``` js
  state.obj = { ...state.obj, newProp: 123 }
  ```

### Utilizzare delle Regole per i Nomi delle Mutation

E' pratica comune utilizzare costanti per i nomi delle mutation, tale pratica favorisce il debug tramite strumenti come linter ed è poi possibile distinguere bene ogni mutation

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
    // possiamo sfruttare la sintassi ES2015 
    // per utilizzare una costante come nome di una funzione!
    [SOME_MUTATION] (state) {
      // stato mutato
    }
  }
})
```

L'utilizzo delle costanti è altamente consigliato soprattutto quando si divide in più moduli un'applicazione di larga scala. Tutta via non c'è nessuna regola che vi obbliga ad utilizzare tale sintassi se non vi piace.

### Le Mutation devono essere Sincrone

Una regola importante da tenere a mente è che **gli handler delle mutation devono essere sincroni** Perchè? Considerate il seguente esempio:

``` js
mutations: {
  SOME_MUTATION (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Ora immaginate di dover debuggare l'applicazione e guardate il log delle mutation. Per ogni log sarebbe utile avere un immagine dello stato **prima** e **dopo** la mutazione, purtroppo la chiamata asincrona non ci permette di farlo dato che non viene eseguita quando la mutazione viene chiamata. Non sappiamo quando la chiamata asincrona viene effettivamente chiamata.

### Sulle Azioni

Le mutazioni di stato combinate con eventi asincroni possono portare difficoltà nel capire che cosa succede in un determinato momento. Per sempio se chiamate due metodi, entrambi implementano internamente delle chiamate asincrone, come potete stabilire l'ordine di chiamata? Ecco perchè dev'essere chiaro il motivo per il quale qualsiasi tipo di operazione asincrona dev'essere fatto tramite le [Azioni](actions.md)
