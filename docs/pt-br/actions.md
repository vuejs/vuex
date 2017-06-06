# Ações

Ações são similares às mutações, sendo que as diferenças são:

- Ao invés de mudar os estados, ações cometem mutações.
- Ações podem conter operações assíncronas arbitrárias.


Vamos registrar uma ação simples:

``` js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

Os handlers de ações recebem um objeto de contexto que expõe a mesma quantidade de métodos/propriedades na instância da store, portanto, você pode chamar `context.commit` para cometer uma mutação, ou acessar o estado e getters via `context.state` e `context.getters`. Vamos  ver por que esse objeto de contexto não é a própria instância quando formos ver sobre [Módulos](modules.md) mais tarde.

Na prática, geralmente usamos  [desestruturação de argumentos](https://github.com/lukehoban/es6features#destructuring) do ES2015 para simplificar um pouco o código (especialmente quando precisamos chamar `commit` várias vezes):

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### Despachando Ações

Ações são disparadas com o método `store.dispatch`



``` js
store.dispatch('increment')
```

Pode parecer burrice à primeira vista: se queremos incrementar o contador, por que não simplesmente chamamos `store.commit('incrment')` diretamente? Bem, lembra que **mutações devem ser síncronas?** Ações não. Podemos realizar operações **assíncronas** dentro de uma ação.


``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Ações suportam o mesmo formato de payload e despachamento no estilo objeto:

Actions support the same payload format and object-style dispatch:

``` js
// despachando com payload
store.dispatch('incrementAsync', {
  amount: 10
})

// despachando com objeto
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

Um exemplo mais prático de ações no mundo real seria uma ação para fazer checkout de um carrinho, que envolve **chamar uma API assíncrona** e **cometer múltiplas mutações**:


``` js
actions: {
  checkout ({ commit, state }, products) {
    // salva os itens atualmente no carrinho
    const savedCartItems = [...state.cart.added]
    // manda a requisição de checkout
    // e limpa o carrinho otimisticamentev
    commit(types.CHECKOUT_REQUEST)
    // a API de compra aceita um callback de sucesso e outro de fracasso
    shop.buyProducts(
      products,
      // lida com o sucesso
      () => commit(types.CHECKOUT_SUCCESS),
      // lida com o fracasso
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

Perceba que estamos realizando um fluxo de operações assíncronas, e gravando os efeitos colaterais (mutações de estado) da ação cometendo-as.


### Despachando Ações em Componentes

Você pode despachar ações em componentes com  `this.$store.dispatch('xxx')`, ou usar o helper `mapActions` que mapeia os métodos dos componentes em chamadas de  `store.dispatch`  (requer injeção do `store` da raiz):

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // mapeia `this.increment()` para `this.$store.dispatch('increment')`
      
      // `mapActions` also supports payloads:
      'incrementBy' // mapeia `this.incrementBy(amount)` para `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // mapeia `this.add()` para `this.$store.dispatch('increment')`
    })
  }
}
```

### Compondo Ações

Já que frequentemente ações são assíncronas, como sabemos quando uma ação é realizada? E mais importante ainda, como conseguimos compor múltiplas ações juntas para lidar com fluxos assíncronos mais complexos?

A primeira coisa a se saber é que `store.dispatch` pode lidar com Promises retornadas pelo handler da ação disparada, e também retorna uma Promise:


``` js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

Agora pode fazer:

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

E em outra ação:

``` js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```
Por fim, se fizermos uso  de [async / await](https://tc39.github.io/ecmascript-asyncawait/), um recurso do Javascript que vai chegar em breve, podemos compor nossas ações assim:

``` js
// assumindo que  `getData()` e `getOtherData()` retornam Promises

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // espera `actionA` terminar
    commit('gotOtherData', await getOtherData())
  }
}
```

> É possível fazer com que um  `store.dispatch` dispare múltiplos handlers de ações em módulos diferentes. Nesse caso, o valor retornado vai ser uma Promise que resolve quando todos os handlers disparados forem resolvidos. 