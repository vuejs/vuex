# Fluxo de Dados

Vamos construir um simples contador com Vuex para entender um pouco melhor o fluxo de dados dentro de aplicações Vuex. Note que esse é um exemplo trivial somente com o objetivo de explicar os conceitos - na prática você não precisa do Vuex para um app tão simples.

### O Armazém

``` js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// estado inicial do app
const state = {
  count: 0
}

// definindo as possíveis mutações
const mutations = {
  INCREMENT (state) {
    state.count++
  },
  DECREMENT (state) {
    state.count--
  }
}

// criando o armazém
export default new Vuex.Store({
  state,
  mutations
})
```

### Ações

``` js
// actions.js
export const increment = ({ dispatch }) => dispatch('INCREMENT')
export const decrement = ({ dispatch }) => dispatch('DECREMENT')
```

### Utilizando-o com o Vue

**Template**

``` html
<div id="app">
  Clicked: {{ count }} times
  <button v-on:click="increment">+</button>
  <button v-on:click="decrement">-</button>
</div>
```

**Script**

``` js
// Nós estamos importando e injetando o armazém aqui porque
// essa é nossa instância raiz. Em aplicações maiores você só precisa fazer isso uma vez.
import store from './store'
import { increment, decrement } from './actions'

const app = new Vue({
  el: '#app',
  store,
  vuex: {
    getters: {
      count: state => state.count
    },
    actions: {
      increment,
      decrement
    }
  }
})
```

Aqui você irá notar que o componente é extremamente simples: Ele exibe um estado do armazém Vuex (nem mesmo tem seus próprios dados), e chama algumas ações do armazém quando o usuário dispara um evento.

Você também irá perceber que o fluxo de dados é unidirecional, como deveria ser no Flux:

1. O input do usuário no componente dispara uma chamada para uma ação;
2. As Ações disparam mutações que modificam o estado;
3. As alterações no estado são refletidas no componente via getters.

<p align="center">
  <img width="700px" src="vuex.png">
</p>
