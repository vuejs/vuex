# Getters

A veces necesitaremos computar estados derivados del estado almacenado. Por ejemplo, podemos necesitar filtrar una lista de items y contarlos:

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Si más de un componente tiene esta necesidad podemos acabar con una función duplicada ó teniendo que extraerla a un helper compartido e importarlo en múltiples lugares. Ambas són malas opciones.

Vuex nos permite definir "getters" en el almacén (consideralos propiedades computadas del almacén). Los Getters recibirán el estado como el 1er argumento:

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

Los getters serán expuestos a través del objeto `store.getters`:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Cada getter recibirá también los demás getters definidos como el 2º argumento:

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

Ahora podemos hacer uso de ellos dentro de cualquier componente:

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

También puedes pasar argumentos al getter haciendo que este devuelva una función. Esto es especialmente útil cuando quieres lanzar una 'query' sobre un array del almacén:

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


### El Helper `mapGetters`

El helper `mapGetters` sencillamente mapea los getters del almacén a las propiedades computadas locales:

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    localComputed () { /* ... */ },
    // Mezcla los getters con las propiedades computadas locales
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Si quieres mapear un getter con un nombre diferente al usado en el almacén, usa un objeto:

``` js
...mapGetters({
  // Mapea this.doneCount a store.getters.doneTodosCount
  doneCount: 'doneTodosCount'
})
```
