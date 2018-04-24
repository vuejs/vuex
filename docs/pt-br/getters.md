# _Getters_

Às vezes, talvez precisemos calcular o estado derivado com base no estado do _store_, por exemplo, filtrar através de uma lista de itens e contá-los:

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Se mais do que um componente precisa fazer uso disso, temos que duplicar a função, ou extraí-lo em um auxiliar compartilhado e importá-lo em vários lugares - ambos são menos do que o ideal.
O Vuex nos permite definir _getters_ no _store_. Você pode pensar neles como dados computados para os _stores_. Como os dados computados, o resultado de um _getter_ é armazenado em cache com base em suas dependências e só irá avaliar novamente quando algumas de suas dependências mudarem.

_Getters_ receberam o estado como seu 1º argumento:

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

Os _getters_ serão descritos no objeto `store.getters`:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

_Getters_ também podem receber outros _getters_ como o 2º argumento:

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

Agora podemos usar facilmente isso dentro de qualquer componente:

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

Você também pode passar argumentos para os _getters_ retornando uma função. Isso é particularmente útil quando você deseja consultar um _array_ no _store_ :

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

### O auxiliar `mapGetters`

O auxiliar `mapGetters` simplesmente mapeia os _getters_ do _store_ para os dados computados locais:

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // misturar os getters em dados computados com o spread operator
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Se você deseja mapear um _getter_ para um nome diferente, use um objeto:

``` js
...mapGetters({
  // mapeia `this.doneCount` para `store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```
