# API de Composição (ou Composition API)

Para acessar o _store_ dentro do gatilho (ou _hook_) `setup`, você pode chamar a função` useStore`. Isso é o equivalente a recuperar `this.$store` dentro de um componente usando a API de Opções (ou _Option_ API).

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
  }
}
```

## Acessando Estado e Getters

Para acessar o estado e os _getters_, você deve criar referências `computed` para reter a reatividade. Isso é o equivalente a criar dados computados usando a API de Opções (ou _Option_ API).

```js
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // acessar um estado em uma função de dados computados
      count: computed(() => store.state.count),

      // acessar um getter em uma função de dados computados
      double: computed(() => store.getters.double)
    }
  }
}
```

## Acessando Mutações e Ações

Ao acessar mutações e ações, você pode simplesmente fornecer as funções `commit` e` dispatch` dentro do gatilho (ou _hook_) `setup`.

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // acessa uma mutação
      increment: () => store.commit('increment'),

      // acessa uma ação
      asyncIncrement: () => store.dispatch('asyncIncrement')
    }
  }
}
```

## Exemplos

Confira o [exemplo da API de Composição](https://github.com/vuejs/vuex/tree/4.0/examples/composition) para ver exemplos de aplicações que utilizam Vuex e a API de Composição do Vue.
