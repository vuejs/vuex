# Ações

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/c6ggR3cG" target="_blank" rel="noopener noreferrer">Tente esta lição no Scrimba</a></div>

As ações são semelhantes às mutações, as diferenças são as seguintes:

- Em vez de mudar o estado, as ações confirmam (ou fazem _commit_ de) mutações.
- As ações podem conter operações assíncronas arbitrárias.

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

Os manipuladores de ação recebem um objeto _context_ que expõe o mesmo conjunto de métodos/propriedades na instância do _store_, para que você possa chamar `context.commit` para confirmar uma mutação ou acessar o estado e os _getters_ através do `context.state` e do `context.getters`. Veremos por que esse objeto _context_ não é a própria instância do _store_ quando apresentarmos [Módulos](modules.md) mais tarde.

Na prática, muitas vezes usamos ES2015 [desestruturação de argumentos](https://github.com/lukehoban/es6features#destructuring) para simplificar um pouco o código (especialmente quando precisamos usar _commit_ várias vezes):

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

Isso pode parecer óbvio à primeira vista: se quisermos incrementar a contagem, por que não chamamos `store.commit('increment')` diretamente? Você se lembra que **as mutações devem ser síncronas**? As ações não. Podemos executar **operações assíncronas** dentro de uma ação:

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

As ações suportam o mesmo formato de _payload_ e despacho estilo-objeto:

``` js
// despacho com um payload
store.dispatch('incrementAsync', {
  amount: 10
})

// despacho com objeto
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

Um exemplo mais prático de ações reais seria uma ação para fazer _checkout_ de um carrinho de compras, que envolve **chamar uma API assíncrona** e **confirmar múltiplas mutações**:

``` js
actions: {
  checkout ({ commit, state }, products) {
    // salva os itens que estão no carrinho
    const savedCartItems = [...state.cart.added]
    // envia solicitação de checkout, e otimista
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

Observe que estamos realizando um fluxo de operações assíncronas, e gravando os efeitos colaterais (mutações de estado) da ação confirmando-os (ou fazendo _commit_ deles).

### Ações de Despacho em Componentes

Você pode despachar ações em componentes com `this.$store.dispatch('xxx')`, ou usar o auxiliar _mapActions_ que mapeia métodos do componente para chamadas do `store.dispatch` (esta ação requer injeção do _store_ na instância raiz):

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // mapeia `this.increment()` para `this.$store.dispatch('increment')`

      // `mapActions` também suporta payloads:
      'incrementBy' // mapeia `this.incrementBy(amount)` para `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // mapeia `this.add()` para `this.$store.dispatch('increment')`
    })
  }
}
```

### Composição de Ações

As ações geralmente são assíncronas, então como sabemos quando uma ação é realizada? E mais importante, como podemos compor ações múltiplas em conjunto para lidar com fluxos assíncronos mais complexos?

A primeira coisa a saber é que o `store.dispatch` pode manipular o _Promise_ retornado pelo manipulador de ação acionado e também retorna _Promise_:

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

Agora você pode fazer:

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

E também em outra ação:

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

Finalmente, se fizermos uso de [async / await](https://tc39.github.io/ecmascript-asyncawait/), podemos compor nossas ações como esta:

``` js
// assumindo que `getData()` e `getOtherData()` retornam Promises

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // espera que `actionA` termine
    commit('gotOtherData', await getOtherData())
  }
}
```

> É possível para um `store.dispatch` desencadear vários manipuladores de ação em diferentes módulos. Neste caso, o valor retornado será um _Promise_ que resolve quando todos os manipuladores desencadeados foram resolvidos.
