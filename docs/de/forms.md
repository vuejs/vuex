# Formulare

Wenn Vuex in Strict-Mode genutzt wird, könnte es etwas schwerer werden `v-model` an einem State zu nutzen, der zu Vuex gehört.

``` html
<input v-model="obj.message">
```

Wenn angenommen wird, dass `obj` eine Computed Property ist, die ein Objekt vom Store wiedergibt, so versucht `v-model` eine direkte Änderung von `obj.message` vorzunehmen, wenn der Nutzer Eingaben tätigt.

In Strict-Mode würde das einen Fehler auslösen, da die Änderung nicht in einem Vuex-Handler vonstattenging.

Um es Vuex-konform zu halten, sollte der `<input>`-Wert gebunden werden und eine Action für `input` oder dem `change`-Event auslösen.

``` html
<input :value="message" @input="updateMessage">
```
``` js
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```

Und hier ist der Mutation-Handler:

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### Zweiseitige Computed Property

Zugegeben ist das obige Beispiel etwas wortreicher als `v-model` mit lokalem State und man verliert ebenfalls einige nützliche Features von `v-model`. Eine Alternative wäre eine zweisteitige Computed Property mit einem Setter:

``` js
// ...
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```
