# Referenza alle API

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...opzioni })
```

### Opzioni per il Costruttore

- **state**

  - tipo: `Oggetto`

    Lo stato principale per lo store di Vuex.

    [Dettagli](state.md)

- **mutations**

  - tipo: `Oggetto`

    Un Oggetto che ha come chiavi i nomi delle mutation e come valore il nome della funzione (handler) della mutation stessa. L'handler ricevere sempre `state` come primo argomento.

    [Dettagli](mutations.md)

- **modules**

  - tipo: `Oggetto`

    Un  Oggetto contenente tutti i sub moduli che si uniranno allo store, di solito è formato tipo:

    ``` js
    {
      key: {
        state,
        mutations
      },
      ...
    }
    ```

    Ogni modulo può contenere uno stato `state` e delle `mutations`, molto simile al'opzione di root. Lo stato di un modulo sarà legato a quello principale dello store e sarà accessibile tramite il nome del modulo. Una mutation in un modulo riceverà solo lo stato del modulo stesso invece di quello principale (root state).

- **middlewares**

  - tipo: `Array<Oggetto>`

    Un oggetto che contiene tutti i middleware del tipo:

    ``` js
    {
      snapshot: Boolean, // predefinito: false
      onInit: Funzione,
      onMutation: Funzione
    }
    ```

    Tutti i campi sono facoltativi. [Dettagli](middlewares.md)

- **strict**

  - tipo: `Boolean`
  - predefinito: `false`

    Forza Vuex ad avere lo store in modalità strict. In questa modalità tutte le mutazioni al di fuori del sistema di mutation di Vuex solleveranno un Errore.

    [Dettagli](strict.md)

### Proprietà di istanza di Vuex.Store

- **state**

  - tipo: `Oggetto`

    Lo stato principale. In sola lettura.

### Metodi di istanza di Vuex.Store

- **dispatch(nomeMutazione: Stringa, ...argomenti)**

  Directly dispatch a mutation. This is useful in certain situations are in general you should prefer using actions in application code.

- **watch(pathOrGetter: Stringa|Funzione, cb: Funzione, [opzioni: Oggetto])**

  Watch a path or a getter Funzione's value, and call the callback when the value changes. Accepts an optional opzioni Oggetto that takes the same opzioni as Vue's `vm.$watch` method.

  To stop watching, call the returned handle Funzione.

- **hotUpdate(opzioni: Oggetto)**

  Hot swap new actions and mutations. [Dettagli](hot-reload.md)
