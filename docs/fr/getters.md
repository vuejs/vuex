# Accesseurs

Parfois nous avons besoin de calculer des valeurs basées sur l'état du store, par exemple pour filtrer une liste d'éléments et les compter :

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Si plus d'un composant a besoin d'utiliser cela, il nous faut ou bien dupliquer cette fonction, ou bien l'extraire dans une fonction utilitaire séparée et l'importer aux endroits nécessaires. Les deux idées sont loin d'être idéales.

Vuex nous permet de définir des accesseurs (« getters ») dans le store. Voyez-les comme les propriétés calculées des stores. Comme pour les propriétés calculées, le résultat de l'accesseur est mis en cache en se basant sur ses dépendances et il ne sera réévalué que lorsqu'une de ses dépendances aura changé.

Les accesseurs prennent l'état en premier argument :

``` js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

Les accesseurs seront exposés sur l'objet `store.getters` :

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Les accesseurs recevront également les autres accesseurs en second argument :

``` js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```

``` js
store.getters.doneTodosCount // -> 1
```

Nous pouvons maintenant facilement les utiliser dans n'importe quel composant :

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

Vous pouvez aussi passer des arguments aux accesseurs en retournant une fonction. Cela est particulièrement utile quand vous souhaitez interroger un tableau dans le store :

```js
getters: {
  // ...
  getTodoById: (state, getters) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```

``` js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

### La fonction utilitaire `mapGetters`

La fonction utilitaire `mapGetters` attache simplement vos accesseurs du store aux propriétés calculées locales :

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // rajouter les accesseurs dans `computed` avec l'opérateur de décomposition
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Si vous voulez attacher un accesseur avec un nom différent, utilisez un objet :

``` js
...mapGetters({
  // attacher `this.doneCount` à `store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```
