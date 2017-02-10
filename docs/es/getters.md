# Getters

En ocasiones podemos necesitar computar estado derivado del estado del _store_, por ejemplo, filtrar una lista de elementos o el total:

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Si más de un componente necesita utilizar esta información, tendremos que duplicar la función o extraerla como función auxiliar para importarla en más de un lugar - ambas opciones están lejos de ser ideales.

Vuex nos permite definir _getters_ en el _store_ (piensa en ellos como propiedades computadas). Los _getters_ reciben el estado como primer parámetro:

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

Son expuestos en el objeto `store.getters`:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

También puede recibir otros _getters_ como segundo argumento:

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

Ahora podemos utilizarlos fácilmente dentro de cualquier componente:

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

También puedes pasar argumentos a los _getters_ retornando una función. Esto es útil cuando deseas consultar información de un arreglo en el _store_:
```js
getters: {
  // ...
  getTodoById: (state, getters) => (id) => {
    return getters.todos.find(todo => todo.id === id)
  }
}
```

``` js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```


### La función auxiliar `mapGetters`

La función auxiliar `mapGetters` simplemente mapea _getters_ del _store_ a propiedades computadas locales:

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // Combina los getters con las propiedades computadas utilizando el operador de propagación
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Si deseas mapear un _getter_ a un nombre diferente, utiliza un objeto:

``` js
...mapGetters({
  // map this.doneCount to store.getters.doneTodosCount
  doneCount: 'doneTodosCount'
})
```
