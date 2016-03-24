# Stato e Getter

### Albero a Stato Singolo

Vuex utilizza un **albero a stato singolo** - questo singolo oggetto contiene tutti gli stati dell'applicazione e serve come "unica risorsa della verità". Vuex permette un solo store per applicazione. Un albero a stato singolo permette di localizzare specificatamente un singolo stato, modificarlo, salvarne una copia corrente ed effettuare debug e test.

Questo principio non va in conflitto con il concetto di modularità, più avanti capiremo come distribuire lo stato in più moduli.

### Sfruttare lo Stato nei Componenti di Vue

Come visualizziamo lo stato internamente ad un componente Vue? Il modo più semplice è quello di sfruttare le [proprietà derivate](http://it.vuejs.org/guide/computed.html):

``` js
// internamente ad un Componente di Vue
computed: {
  count: function () {
    return store.state.count
  }
}
```

Ogni volta che `store.state.count` cambia, verrà riflesso nella proprietà derivata e attiverà gli aggiornamenti del DOM necessari.

Questo metodo, seppur semplice, può portare ad avere uno o più componenti che dipendono da un singleton globale, lo store, il quale può complicare la situazione in fase di test o se si vuole riutilizzare un componente in un'altra applicazione.
Per evitare questo tipo di problemi, si può "iniettare" lo store internamente al componente, ecco come fare:

1. Installato Vuex, collegate il componente principale (root) con lo store:

  ``` js
  import Vue from 'vue'
  import Vuex from 'vuex'
  import store from './store'
  import MyComponent from './MyComponent'

  // Questo passo è fondamentale in quando dice a vue
  // Come comportarti con le opzioni relative a Vuex.
  Vue.use(Vuex)

  var app = new Vue({
    el: '#app',
    // Iniettiamo lo store direttamente nel componente
    // Così facendo sarà disponibile a tutti i componenti figli
    store,
    components: {
      MyComponent
    }
  })
  ```

  Iniettando lo store direttamente al componente principale, tutti i figli ne beneficeranno e lo store sarà disponibile tramite la proprietà `this.$store`. Comunque non è necessario utilizzare la referenza diretta:

2. Internamente al componente figlio, possiamo sfruttare una funzione **getter** e farci restituire l'opzione `vuex.getters`:

  ``` js
  // MyComponent.js
  export default {
    template: '...',
    data () { ... },
    // Qui e dove lavoriamo con Vuex
    vuex: {
      getters: {
        // Questo getter legherà `store.state.count` al componente tramite `this.count`
        count: function (state) {
          return state.count
        }
      }
    }
  }
  ```

  Si noti la sintassi speciale `vuex`. Al suo interno si specificano gli stati che il componente deve utilizzare dallo store. Per ogni proprietà dello store specificheremo un getter il quale riceve tutto l'albero degli stati dallo store
  e seleziona solo lo stato che specifichiamo noi il valore verrà inserito in una properità del componente, proprio come una proprietà derivata.

  In molti casi si può semplificare la sintassi del "getter" tramite ES2015:

  ``` js
  vuex: {
    getters: {
      count: state => state.count
    }
  }
  ```

### I Getter devono essere Puri

Tutti i getter Vuex devono essere [delle funzioni pure](https://en.wikipedia.org/wiki/Pure_function) - esse devono prendere l'intero albero degli stati e restituire solo e soltanto un valore di tale stato. Questo rende il tutto più facile da modularizzare, testare e comporre. Significa anche che **non potrete usare `this` nei getter**.

Se vi ritrovate nella situazione di dover usare `this`, per esempio per elaborare una properità derivata basata su uno stato locale del componente, allora dovrete definire un'altra proprietà derivata dedicata:

``` js
vuex: {
  getters: {
    currentId: state => state.currentId
  }
},
computed: {
  isCurrent () {
    return this.id === this.currentId
  }
}
```

### I Getter posso restituire Stati Derivati

Se consideriamo che i getter di Vuex dietro le quinte sono delle proprietà derivate, allora possiamo intuire che è possibile sfruttare alcune proprietà di quest'ultime per restituire uno stato più eleborato.
Per esempio, si consideri che lo stato ha un array di `messaggi` contenente tutti i messaggi, ed un `currentThreadID` che rappresenta il thread corrente visualizzato dall utente.
Ora, mettiamo caso di voler visualizzare tutti i messaggi che sono associati ad un Thread particolare:

``` js
vuex: {
  getters: {
    filteredMessages: state => {
      return state.messages.filter(message => {
        return message.threadID === state.currentThreadID
      })
    }
  }
}
```

Dato che le proprietà derivate di Vue.js sono messe in cache in modo automatico, non dovremo preoccuparci di chiamare questo metodo ad ogni mutazione dello stato!

### Condividere dei Getter su più Componenti

Come potete notare `filteredMessages` può essere utile in più componenti. In questo caso è buona idea esportare il metodo e condividerlo su più componenti:

``` js
// getters.js
export function filteredMessages (state) {
  return state.messages.filter(message => {
    return message.threadID === state.currentThreadID
  })
}
```

``` js
// In un componente..
import { filteredMessages } from './getters'

export default {
  vuex: {
    getters: {
      filteredMessages
    }
  }
}
```

Grazie al fatto che i Getter sono puri, tutti i getter possono essere condivisi tra i componenti e cachati in modo molto convenzionale: quando una dipendenza cambia viene rievalutata una sola volta per tutti i componenti!

> Referenza a Flux: I getter di Vuex sono simili a [`mapStateToProps`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) in Redux. Comounque dato che ci si appoggia al sistema di proprietà derivate di Vue, c'è una netta differenza di prestazioni a favore di Vuex, troviamo più similitudini a [reselect](https://github.com/reactjs/reselect).

### I Componenti Non Possono Mutare gli Stati

E' importante ricordare che **i componenti non dovrebbero mai mutare uno stato in Vuex in modo diretto**. Ogni stato dev'essere mutato in modo esplicito e tracciabile, possibilmente sfruttando il sistema mutations di Vuex stesso.

Per aiutare a rispettare questa regola, se in [Modalità Strict](strict.md), Vuex lancierà un errore se si prova a mutare uno stato in modo diretto.

Con questa regola i vostri componenti in Vue avranno meno responsabilità: essi sono legati allo Store di Vuex in modalità sola lettura tramite i getter, l'unico modo per cambiare lo stato in qualsiasi modo è attivando le **mutations** (ne parleremo dopo). Il vantaggio è che i componenti potranno continuare ad operare sui loro stati locali se necessario ma senza doversi preoccupare di gestire la logica per gli stati globali dell'applicazione dato che, quest'ultimi, sono centralizzati internamente in Vuex.
