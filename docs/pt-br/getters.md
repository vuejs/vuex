# Getters

Às vezes, talvez precisemos calcular o estado derivado com base no estado da _store_  , por exemplo, filtrar através de uma lista de itens e contá-los:

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Se mais do que um componente precisa fazer uso disso, temos que duplicar a função, ou extraí-lo em um auxiliar compartilhado e importá-lo em vários lugares - ambos são menos do que o ideal.
O Vuex nos permite definir "getters" na _store_ . Você pode pensar neles como dados computados para _stores_ . Como os dados computados, o resultado de um getter é armazenado em cache com base em suas dependências e só irá avaliar novamente quando algumas de suas dependências mudarem.

Getters receberam o estado como seu primeiro argumento:

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

Os getters serão descritos no objeto `store.getters`:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getters também receberá outros getters como o segundo argumento:

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

Você também pode passar argumentos para getters retornando uma função. Isso é particularmente útil quando você deseja consultar um _array_  na _store_ :

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

O auxiliar `mapGetters` simplesmente mapeia os getters da _store_  para os dados computados locais:

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

Se você deseja mapear um getter para um nome diferente, use um objeto:

``` js
...mapGetters({
  // mapeia `this.doneCount` para `store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```

