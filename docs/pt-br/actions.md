# A��es

As a��es s�o semelhantes �s muta��es, as diferen�as s�o as seguintes:
 - Em vez de mutar o estado, as a��es confirmam muta��es.
 - As a��es podem conter opera��es ass�ncronas arbitr�rias.
Vamos registrar uma simples a��o:

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

Os manipuladores de a��o recebem um objeto de contexto que exp�e o mesmo conjunto de m�todos / propriedades na inst�ncia da loja(store), para que voc� possa chamar `context.commit` para confirmar uma muta��o ou acessar o estado e os getters atrav�s do `context.state` e do `contexto. getters`. 
Veremos por que esse objeto de contexto n�o � a pr�pria inst�ncia da loja quando apresentamos [M�dulos] (modules.md) mais tarde.

Na pr�tica, muitas vezes usamos ES2015 [desestrutura��o de argumentos] (https://github.com/lukehoban/es6features#destructuring) para simplificar um pouco o c�digo(especialmente quando precisamos chamar `commit` v�rias vezes):

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### A��es de Despacho

As a��es s�o acionadas com o m�todo `store.dispatch`:

``` js
store.dispatch('increment')
```

Isso pode parecer �bvio � primeira vista: se quisermos incrementar a contagem, por que n�o chamamos `store.commit ('incremento') diretamente? Lembre-se de que ** as muta��es devem ser s�ncronas **? As a��es n�o. Podemos executar ** opera��es ass�ncronas ** dentro de uma a��o:

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

As a��es suportam o mesmo formato de carga �til e despacho de estilo de objeto:

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

Um exemplo mais pr�tico de a��es reais seria uma a��o para fazer check-out de um carrinho de compras, que envolve ** chamar uma API ass�ncrona ** e ** confirmar m�ltiplas muta��es **:

``` js
actions: {
  checkout ({ commit, state }, products) {
    // salva os itens que est�o no carrinho
    const savedCartItems = [...state.cart.added]
    // enviar solicita��o de checkout
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

Observe que estamos realizando um fluxo de opera��es ass�ncronas e gravando os efeitos colaterais (muta��es de estado) da a��o confirmando-os.

### A��es de Despacho em Componentes

Voc� pode despachar a��es em componentes com `this. $store.dispatch ('xxx')`, ou usar o auxiliar `mapActions` que mapeia m�todos de componente para chamadas do ` store.dispatch` (esta a��o requer a inje��o root `store`):

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

### Composi��o de a��es

As a��es geralmente s�o ass�ncronas, ent�o, como sabemos quando uma a��o � realizada? E, o mais importante, como podemos compor a��es m�ltiplas em conjunto para lidar com fluxos ass�ncronos mais complexos?

A primeira coisa a saber � que `store.dispatch` pode lidar com Promise retornado pelo manipulador de a��o desencadeada e tamb�m retorna Promise:

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

Agora, � possivel:

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

E em outra a��o tamb�m:

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

Por fim, se usarmos [async / await] (https://tc39.github.io/ecmascript-asyncawait/), podemos compor nossas a��es como esta:

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

> � poss�vel para um `store.dispatch` desencadear v�rios manipuladores de a��o em diferentes m�dulos. Neste caso, o valor retornado ser� uma Promise que resolve quando todos os manipuladores desencadeados foram resolvidos.

