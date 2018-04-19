# Getters

�s vezes, talvez precisemos calcular o estado derivado com base no estado da loja, por exemplo, filtrar atrav�s de uma lista de itens e cont�-los:

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Se mais do que um componente precisa fazer uso disso, temos que duplicar a fun��o, ou extra�-lo em um auxiliar compartilhado e import�-lo em v�rios lugares - ambos s�o menos do que o ideal.
O Vuex nos permite definir "getters" na loja. Voc� pode pensar neles como propriedades computafas para lojas. Como as propriedades computadas, o resultado de um getter � armazenado em cache com base em suas depend�ncias e s� ir� avaliar novamente quando algumas de suas depend�ncias mudaram.

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

Os getters ser�o descritos no objeto `store.getters`:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getters tamb�m receber� outros getters como o segundo argumento:

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

Voc� tamb�m pode passar argumentos para getters retornando uma fun��o. Isso � particularmente �til quando voc� deseja consultar uma matriz na loja:

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

O auxiliar `mapGetters` simplesmente mapeia os getters da loja para propriedades locais computadas:

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Se voc� deseja mapear um getter para um nome diferente, use um objeto:

``` js
...mapGetters({
  // map `this.doneCount` to `store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```

