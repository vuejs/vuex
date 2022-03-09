# Getters

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/c2Be7TB" target="_blank" rel="noopener noreferrer">Essayez cette leçon sur Scrimba</a></div>

Parfois, nous pouvons avoir besoin de calculer un état dérivé basé sur l'état du magasin, par exemple en filtrant une liste d'articles et en les comptant :

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Si plusieurs composants doivent l'utiliser, nous devons soit dupliquer la fonction, soit l'extraire dans une aide partagée et l'importer à plusieurs endroits - ces deux solutions sont loin d'être idéales.

Vuex nous permet de définir des "getters" dans le store. Vous pouvez les considérer comme des propriétés calculées pour les magasins.

::: warning WARNING
Depuis Vue 3.0, le résultat du getter n'est **pas mis en cache** comme le fait la propriété calculée. Il s'agit d'un problème connu qui nécessite la publication de Vue 3.1. Pour en savoir plus, consultez [PR #1878](https://github.com/vuejs/vuex/pull/1878).
:::

Les Getters recevront l'état comme leur premier argument :

``` js
const store = createStore({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos (state) {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

## Accès sous forme de propriété

Les getters seront exposés sur l'objet `store.getters`, et vous accédez aux valeurs comme des propriétés :

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Les getters recevront également d'autres getters comme second argument :

``` js
getters: {
  // ...
  doneTodosCount (state, getters) {
    return getters.doneTodos.length
  }
}
```

``` js
store.getters.doneTodosCount // -> 1
```

Nous pouvons maintenant l'utiliser facilement dans n'importe quel composant :

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

Notez que les getters accédés en tant que propriétés sont mis en cache dans le cadre du système de réactivité de Vue.

### Accès de type méthode

Vous pouvez également passer des arguments aux getters en retournant une fonction. Ceci est particulièrement utile lorsque vous souhaitez interroger un tableau dans le store :

```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```

``` js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

Notez que les getters accessibles via des méthodes seront exécutés à chaque fois que vous les appellerez, et le résultat ne sera pas mis en cache.

## L'aide `mapGetters'.

L'aide `mapGetters` fait simplement correspondre les getters du magasin aux propriétés locales calculées :

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // mélanger les getters dans le computed avec l'opérateur de propagation d'objet.
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Si vous voulez affecter un getter à un nom différent, utilisez un objet :

``` js
...mapGetters({
  // faire correspondre `this.doneCount` à `this.$store.getters.doneTodosCount`.
  doneCount: 'doneTodosCount'
})
```
