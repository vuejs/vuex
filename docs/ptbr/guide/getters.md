# Getters

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/c2Be7TB" target="_blank" rel="noopener noreferrer">Tente esta lição no Scrimba</a></div>

Às vezes, talvez precisemos calcular o estado derivado com base no estado do _store_, por exemplo, filtrar através de uma lista de itens e contá-los:

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Se mais do que um componente precisa fazer uso disso, temos que duplicar a função, ou extraí-lo em um auxiliar compartilhado e importá-lo em vários lugares - ambos são menos do que o ideal.

O Vuex nos permite definir _getters_ no _store_. Você pode pensar neles como dados computados para os _stores_. Como os dados computados, o resultado de um _getter_ é armazenado em cache com base em suas dependências e só será reavaliado quando algumas de suas dependências forem alteradas.

Os _getters_ receberão o estado como 1º argumento:

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

## Acesso Estilo-Propriedade

Os _getters_ serão expostos no objeto `store.getters` e você acessa valores como propriedades:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Os _getters_ também recebem outros _getters_ como o 2º argumento:

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

Agora podemos usar facilmente isso dentro de qualquer componente:

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

Observe que os _getters_ acessados ​​como propriedades são armazenados em cache como parte do sistema de reatividade do Vue.

## Acesso Estilo-Método

Você também pode passar argumentos para os _getters_ retornando uma função. Isso é particularmente útil quando você deseja consultar um _Array_ no _store_:

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

Observe que os _getters_ acessados ​​via métodos serão executados toda vez que você os chamar, e o resultado não será armazenado em cache.

## O Auxiliar `mapGetters`

O auxiliar _mapGetters_ simplesmente mapeia os _getters_ do _store_ para os dados computados locais:

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // mistura os getters nos dados computatos com o operador spread
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Se você deseja mapear um _getter_ com um nome diferente, use um objeto:

``` js
...mapGetters({
  // mapeia `this.doneCount` para `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```
