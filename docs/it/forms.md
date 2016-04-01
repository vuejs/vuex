# Gestione dei Form

Quando si utilizza Vuex in modalità strict, può risultare difficile utilizzare `v-model` su uno stato che appartiene a Vuex:

``` html
<input v-model="obj.message">
```

Presupponendo che `obj` sia una proprietà derivata che restituisce un oggetto dallo store, avremmo una situazione dove `v-model` cerca di mutare direttamente `obj.message` quando l'utente modifica l'input. In modalità strict questo solleverebbe un errore a causa di una mutazione non avvenuta internamente ad una mutation di Vuex.

Un modo per risolvere questo conflitto in Vuex è quello di legare l `<input>` ad una chiamata che si riferisce ad un'azione. L'input si lega tramite `input` oppure l'evento `change`:

``` html
<input :value="message" @input="updateMessage">
```
``` js
// ...
vuex: {
  getters: {
    message: state => state.obj.message
  },
  actions: {
    updateMessage: ({ dispatch }, e) => {
      dispatch('UPDATE_MESSAGE', e.target.value)
    }
  }
}
```

E ora scriviamo la mutation:

``` js
// ...
mutations: {
  UPDATE_MESSAGE (state, message) {
    state.obj.message = message
  }
}
```

Questo approccio rendere l'utilizzo di `v-model` leggermente più complesso ma è un trade-off necessario per rendere il vincolo tra l'input e lo stato tracciabile. Detto questo è giusto ricordare che Vuex non obbliga l'inserimento di tutti gli stati dentro ad uno store, se avete bisogno di tracciare degli stati che sono specifici di un solo componente è possibile farlo benissimo fuori dallo store di Vuex.