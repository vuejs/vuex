# Formulaires

Lorsque l'on utilise Vuex en mode strict, il peut être compliqué d'utiliser `v-modal` sur une partie du state qui appartient à Vuex :

``` html
<input v-model="obj.message">
```

Supposons que `obj` est une computed property qui retourne un Object depuis le store, le `v-model` tnetera de muer directement `obj.message` lorsque l'utilisateur saisit du texte dans le champ. En mode strict, cela produira une erreur car la mutation n'est pas effectuée dans un handler de mutation Vuex explicite.

La "façon Vuex" de gérer ça est de binder la valeur de l'`input` est d'appeler une action sur l'event `input` ou `change` :

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

Et voici le handler de mutation :

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### Computed property bi-directionnelle

Admettons tout de même que l'exemple ci-dessus est plus verbeux que le `v-model` couplé au state local, et on perd quelques fonctionnalités pratiques de `v-model` au passage. Une approche alternative consiste à utiliser une computed property bi-directionnelle avec un setter :

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
