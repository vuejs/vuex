
# Accesseurs

Parfois nous avons besoin de calculer des valeurs basées sur le state du store, par exemple pour filtrer une liste d'éléments et les compter :

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Si plus d'un composant a besoin d'utiliser cela, il nous faut ou bien dupliquer cette fonction, ou bien l'extraire dans un helper séparé et l'importer aux endroits nécessaires &mdash; les deux idées sont loin d'être idéales.

Vuex nous permet de définir des "getters" dans le store (voyez-les comme les computed properties des store). Les getters prennent le state en premier argument :

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

Les getters seront exposé sur l'objet `store.getters` :

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Les getters recevront également les autres getters en second argument :

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

### Le helper `mapGetters`

Le helper `mapGetters` attache simplement vos getters du store aux computed properties locales :

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // rajouter les getters dans computed avec l'object spread operator
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Si vous voulez attacher un getter avec un nom différent, utilisez un objet :

``` js
mapGetters({
  // attacher this.doneCount à store.getters.doneTodosCount
  doneCount: 'doneTodosCount'
})
```
