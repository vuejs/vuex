# Manipulação de Formulários

Ao utilizar o modo strict do Vuex, é um pouquinho diferente o uso do `v-model`, já que o estado pertence ao Vuex:

``` html
<input v-model="obj.message">
```

Assumindo que `obj` é uma computed property que retorna um Objeto do armazém, o `v-model` aqui irá tentar modificar o valor do `obj.message` diretamente quando o usuário digitar algo. Com o modo strict, isso vai resultar em um erro, porque a mutação não é realizada dentro de uma mutação explícita do Vuex.

A maneira "Vuex" de lidar com os formulários é vincular o valor do `<input>`' e chamar uma ação nos eventos `input` ou `change`:

``` html
<input :value="message" @input="updateMessage">
```
``` js
// ...
vuex: {
  getters: {
    message: state => state.obj.message
  },
  actions: {
    updateMessage: ({ dispatch }, e) => {
      dispatch('UPDATE_MESSAGE', e.target.value)
    }
  }
}
```

E aqui é o handler da mutação:

``` js
// ...
mutations: {
  UPDATE_MESSAGE (state, message) {
    state.obj.message = message
  }
}
```

Sim, isso é bem mais extenso do que simplesmente utilizar um `v-model`, mas esse é o custo de fazer com que as modificações do estado sejam explícitas e rastreáveis. Ao mesmo tempo, note que o Vuex não demanda que você adicione todo o estado no armazém - se você não quiser rastrear mas mutações para as interações de formulário, você pode simplesmente manter o estado do formulário fora do Vuex como o estado local do componente, o que lhe permite utilizar livremente o `v-model`.
