# Gestion des formulaires

Lorsque l'on utilise Vuex en mode strict, il peut être compliqué d'utiliser `v-model` sur une partie de l'état qui appartient à Vuex :

``` html
<input v-model="obj.message">
```

Supposons que `obj` est une propriété calculée qui retourne un objet depuis le store, le `v-model` tentera de muter directement `obj.message` lorsque l'utilisateur saisit du texte dans le champ. En mode strict, cela produira une erreur car la mutation n'est pas effectuée dans un gestionnaire de mutation Vuex explicite.

La « méthode Vuex » pour gérer ça est de lier la valeur de l'`input` et d'appeler une action sur l'évènement `input` ou `change` :

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

Et voici le gestionnaire de mutation :

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### Propriété calculée bidirectionnelle

Admettons tout de même que l'exemple ci-dessus est plus verbeux que le `v-model` couplé à l'état local (tout en perdant quelques fonctionnalités pratiques de `v-model` au passage). Une approche alternative consiste à utiliser une propriété calculée bidirectionnelle avec un mutateur :

``` html
<input v-model="message">
```
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
