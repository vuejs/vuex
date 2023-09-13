# Manipulation des formumaires

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cqKRgEC9" target="_blank" rel="noopener noreferrer">Try this lesson on Scrimba</a></div>

Lorsque vous utilisez Vuex en mode strict, il peut être un peu délicat d'utiliser `v-model` sur un élément d'état qui appartient à Vuex :

``` html
<input v-model="obj.message">
```

En supposant que `obj` est une propriété calculée qui renvoie un Object du store, le `v-model` ici va essayer de muter directement `obj.message` lorsque l'utilisateur tape l'entrée. En mode strict, cela entraînera une erreur car la mutation n'est pas effectuée dans un gestionnaire de mutation Vuex explicite.

La "manière Vuex" de traiter cela est de lier la valeur de `<input>` et d'appeler une méthode sur l'événement `input` ou `change` :

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

## Propriété calculée à deux voies

Certes, ce qui précède est un peu plus verbeux que `v-model` + état local, et nous perdons également certaines des fonctionnalités utiles de `v-model`. Une approche alternative consiste à utiliser une propriété calculée à double sens avec un setter :

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
