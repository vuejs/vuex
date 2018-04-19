# Ações

As ações são semelhantes às mutações, as diferenças são as seguintes:
 - Em vez de mutar o estado, as ações confirmam mutações.
 - As ações podem conter operações assíncronas arbitrárias.
Vamos registrar uma simples ação:

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

Os manipuladores de ação recebem um objeto de contexto que expõe o mesmo conjunto de métodos / propriedades na instância da loja(store), para que você possa chamar `context.commit` para confirmar uma mutação ou acessar o estado e os getters através do `context.state` e do `contexto. getters`.
Veremos por que esse objeto de contexto não é a própria instância da loja quando apresentamos [Módulos](modules.md) mais tarde.

Na prática, muitas vezes usamos ES2015 [desestruturação de argumentos](https://github.com/lukehoban/es6features#destructuring) para simplificar um pouco o código(especialmente quando precisamos chamar `commit` várias vezes):

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### Ações de Despacho

As ações são acionadas com o método `store.dispatch`:

``` js
store.dispatch('increment')
```

Isso pode parecer óbvio à primeira vista: se quisermos incrementar a contagem, por que não chamamos `store.commit ('incremento') diretamente? Lembre-se de que ** as mutações devem ser síncronas **? As ações não. Podemos executar ** operações assíncronas ** dentro de uma ação:

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

As ações suportam o mesmo formato de carga útil e despacho de estilo de objeto:

``` js
// dispatch com payload
store.dispatch('incrementAsync', {
  amount: 10
})

// dispatch com objeto
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

Um exemplo mais prático de ações reais seria uma ação para fazer check-out de um carrinho de compras, que envolve ** chamar uma API assíncrona ** e ** confirmar múltiplas mutações **:

``` js
actions: {
  checkout ({ commit, state }, products) {
    // salva os itens que estão no carrinho
    const savedCartItems = [...state.cart.added]
    // enviar solicitação de checkout
    // limpa o carrinho
    commit(types.CHECKOUT_REQUEST)
    // a API da loja aceita um callback bem-sucedido e um callback com falha
    shop.buyProducts(
      products,
      // callback em caso de sucesso
      () => commit(types.CHECKOUT_SUCCESS),
      // callback em caso de falha
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

Observe que estamos realizando um fluxo de operações assíncronas e gravando os efeitos colaterais (mutações de estado) da ação confirmando-os.

### Ações de Despacho em Componentes

Você pode despachar ações em componentes com `this. $store.dispatch ('xxx')`, ou usar o auxiliar `mapActions` que mapeia métodos de componente para chamadas do ` store.dispatch` (esta ação requer a injeção root `store`):

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // map `this.increment()` to `this.$store.dispatch('increment')`

      // `mapActions` also supports payloads:
      'incrementBy' // map `this.incrementBy(amount)` to `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // map `this.add()` to `this.$store.dispatch('increment')`
    })
  }
}
```

### Composição de ações

As ações geralmente são assíncronas, então, como sabemos quando uma ação é realizada? E, o mais importante, como podemos compor ações múltiplas em conjunto para lidar com fluxos assíncronos mais complexos?

A primeira coisa a saber é que `store.dispatch` pode lidar com Promise retornado pelo manipulador de ação desencadeada e também retorna Promise:

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

Agora, é possivel:

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

E em outra ação também:

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

Por fim, se usarmos [async / await](https://tc39.github.io/ecmascript-asyncawait/), podemos compor nossas ações como esta:

``` js
// Assumindo que `getData ()` e `getOtherData ()` retornam Promessas

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // esperar que `actionA` termine
    commit('gotOtherData', await getOtherData())
  }
}
```

> É possível para um `store.dispatch` desencadear vários manipuladores de ação em diferentes módulos. Neste caso, o valor retornado será uma Promise que resolve quando todos os manipuladores desencadeados foram resolvidos.

