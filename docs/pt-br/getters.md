# Getters

Às vezes precisamos computar estados derivados baseados no estado da store, por exemplo, quando precisamos filtrar uma lista de itens e fazer a contagem deles:

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Se  mias de um componente precisa fazer o uso disso, podemos ou duplicar essa função, ou extraí-la em um helper compartilhado e importá-la em ǘários lugares - ambas não são as ideais.

Vuex nos permite definir "getters" no store (pense nelas como se fossem propriedades computadas para stores). Getters vão receber o estado como seu primeiro argumento:

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

Os getters vão ser expostos no objeto `store.getters`:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getters também vão receber outros getters como o segundo argumento:

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

Agora podemos facilmente fazer uso dele dentro de qualquer componente:


``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```
Você também pode passar argumentos para getters se retornar uma função. Isso é particularmente útil quando você quer buscar uma array no store:


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


### O Helper `mapGetters`

O helper `mapGetters` simplesmente mapeia getters do store para propriedades computadas locais.

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // mistura os getters com as computadas com o operador de espalhamento de objeto
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Se você quer mapear o getter com um nome diferente, use um objeto:


``` js
...mapGetters({
  // mapeia `this.doneCount` para `store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```
