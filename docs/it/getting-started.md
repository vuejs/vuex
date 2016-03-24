# Per Iniziare

Al centro di qualsiasi applicazione che utilizza Vuex si trova lo **store**. Uno `store` è sostanzialmente un contenitore che contiene, per l'appunto, tutti gli **stati dell'applicazione**. Ci sono due cose che differenziano Vuex da un oggetto globale tipico di JavaScript:

1. Lo store di Vuex è reattivo. Quando un componente preleva uno stato da store, quest'ultimo verrà aggiornato nel caso quello specifico stato venga cambiato.

2. Non potete cambiare uno stato nello store in modo diretto. L'unico modo per effettuare un cambiamento è quello di inviare in modo esplicito una **mutations**. Questa filosofia rende più facile tracciare qualsiasi cambiamento di stato.

### Lo Store più Semplice

> **NOTA:** Nel cosrso della guida utilizzeremo la sintassi JavaScript che si riferisce a `ES2015` se ancora non siete al corrente degli aggiornamenti [aggiornatevi al riguardo](https://babeljs.io/docs/learn-es2015/)!
Questa documentazione, insoltre, assume che voi siate al corrente con i concetti discussi nel capitolo: [Costruire un'Applicazione scalabile](http://vuejs.org/guide/application.html).

Creare uno Store in Vuex è un processo abbastanza semplice, si inizia con lo stato iniziale e qualche mutations:

``` js
import Vuex from 'vuex'

const state = {
  count: 0
}

const mutations = {
  INCREMENT (state) {
    state.count++
  }
}

const store = new Vuex.Store({
  state,
  mutations
})
```

Ora potrete accedere all oggetto stato tramite `store.state` ed eventualmente attivare mutazioni, per esempio sul nome:

``` js
store.dispatch('INCREMENT')

console.log(store.state.count) // -> 1
```

Se preferite l'approccio ad oggetti potete fare:

``` js
// stesso risultato
store.dispatch({
  type: 'INCREMENT'
})
```

Di nuovo, il motivo per il quale stiamo effettuando il dispatch invece di cambiare lo stato tramite `store.state.count` è perchè vogliamo esplicitamente tenere traccia del cambiamento in se. Questa semplice convenzione rende le nostre intenzioni più esplicite, aiutando anche a capire perchè cambiamo lo stato in determinati punti del nostro codice. In aggiunta, questo ci permette di implementare strumenti per tenere traccia delle mutazioni, salvarne una copia o fare anche debuggin trasversale.

Ovviamente questo è un esempio molto semplice di come funziona Vuex e la centralizzazione degli stati. Più avanti discuteremo di alcuni concetti in dettagli come: [Stati](state.md), [Mutazioni](mutations.md) ed [Azioni](actions.md).
