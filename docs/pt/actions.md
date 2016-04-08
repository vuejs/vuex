# Ações

> Ações no Vuex são na verdade "action creators" em definições puras do Flux, mas eu achei esse termo mais confuso do que útil.

Ações são apenas funções que disparam mutações. Por convenção, as ações Vuex sempre esperam uma instância de um armazem (store) como primeiro parâmetro, seguido por parâmetros adicionais, que são opcionais:

``` js
// the simplest action
function increment (store) {
  store.dispatch('INCREMENT')
}

// a action with additional arguments
// with ES2015 argument destructuring
function incrementBy ({ dispatch }, amount) {
  dispatch('INCREMENT', amount)
}
```

Isso pode parecer bobo a primeira vista: por que nós simplesmente não disparamos mutações diretamente? Bem, você se lembra que **mutações devem ser síncronas**? Ações não. Nós podemos realizar operações **assíncronas** dentro de uma ação:

``` js
function incrementAsync ({ dispatch }) {
  setTimeout(() => {
    dispatch('INCREMENT')
  }, 1000)
}
```

Um exemplo mais prático seria uma ação para realizar o checkout em um carrinho de compras, o que envolve **chamar uma API assíncrona** e **disparar múltiplas mutações**:

``` js
function checkout ({ dispatch, state }, products) {
  // save the current in cart items
  const savedCartItems = [...state.cart.added]
  // send out checkout request, and optimistically
  // clear the cart
  dispatch(types.CHECKOUT_REQUEST)
  // the shop API accepts a success callback and a failure callback
  shop.buyProducts(
    products,
    // handle success
    () => dispatch(types.CHECKOUT_SUCCESS),
    // handle failure
    () => dispatch(types.CHECKOUT_FAILURE, savedCartItems)
  )
}
```

Note que ao invés de esperar um retorno ou passar callback para ações, o resultado de chamar uma API assíncrona é lidado ao disparar novas mutações. A política de boa prática vizinhança aqui é que **o único efeito colateral gerado ao chamar ações deve ser disparar mutações**.

### Chamando Ações em Componentes

Você deve ter percebido que uma função de ação não pode ser chamada diretamente sem referenciar uma instância do armazém. Tecnicamente, nós podemos invocar uma ação utilizando `action(this.$store)` dentro de um método, mas é melhor se nós pudermos expor versões de ações diretamente "ligadas" aos métodos dos componentes, e assim nós poderíamos facilmente referenciá-las dentro de templates. Nós podemos fazer isso utilizando a opção `vuex.actions`:

``` js
// inside a component
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... }, // state getters
    actions: {
      incrementBy // ES6 object literal shorthand, bind using the same name
    }
  }
})
```

O que o código acima faz é vincular a ação `incrementBy` a instância local do armazém do componente, e expô-lo no componente como se fosse um método da instância, acessado via `vm.incrementBy`. Qualquer argumento passado para o método `vm.incrementBy` será passado para a ação que importamos depois do primeiro argumento, que é nosso armazém. Então, ao chamar:

``` js
vm.incrementBy(1)
```

é o mesmo que:

``` js
incrementBy(vm.$store, 1)
```

Mas o benefício é que nós podemos vincular essa ação ao template do componente e utilizá-lo mais facilmente:

``` html
<button v-on:click="incrementBy(1)">increment by one</button>
```

E você pode usar um nome diferente ao método ao vincular uma ação:

``` js
// inside a component
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions: {
      plus: incrementBy // bind using a different name
    }
  }
})
```

Agora a ação será conectada como `vm.plus` ao invés de `vm.incrementBy`.

### Ações Inline

Se uma ação é específica à um componente, você pode utilizar um atalho e definí-la diretamente no componente:

``` js
const vm = new Vue({
  vuex: {
    getters: { ... },
    actions: {
      plus: ({ dispatch }) => dispatch('INCREMENT')
    }
  }
})
```

### Vinculando todas Ações

Se você quiser vincular todas as ações compartilhadas:

``` js
import * as actions from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions // bind all actions
  }
})
```
