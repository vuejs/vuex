# Mutações

Mutações do Vuex são essenciamente eventos? cada mutação tem um **nome** e um **handler**. A função handler irá receber o estado como primeiro parâmetro:

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state) {
      // mutate state
      state.count++
    }
  }
})
```

Utilizar apenas letras para nomes de mutações é apenas uma convenção para fazer com que seja mais fácil diferenciá-las de simples funções.

Você não pode chamar diretamente um handler de mutação. As opções aqui são mais parecidas com um registro de um evento: "Quando um evento `INCREMENT` é disparado, chame esse handler". Para invocar um handler de uma mutação, você precisa disparar um evento de mutação:

``` js
store.dispatch('INCREMENT')
```

### Disparando Eventos com Argumentos

Também é possível passar parâmetros para o handler:

``` js
// ...
mutations: {
  INCREMENT (state, n) {
    state.count += n
  }
}
```
``` js
store.dispatch('INCREMENT', 10)
```

Aqui o valor `10` será passado para o handler da mutação como o segundo arumento, já que o primeiro sempre será o `state`. O mesmo serve para qualquer parâmetro adicional. Esses parâmetros são chamados de **payload**.

### Disparando no Estilo Objeto

> necessita do vuex >=0.6.2

Você também pode disparar mutações utilizando objetos:

``` js
store.dispatch({
  type: 'INCREMENT',
  payload: 10
})
```

Note que ao utilizar o estilo objeto, você deve incluir todos os argumentos como propriedades no objeto despachado. O objeto inteiro será passado como o segundo parâmetro para os handlers das mutações:

``` js
mutations: {
  INCREMENT (state, mutation) {
    state.count += mutation.payload
  }
}
```

### Mutações seguem as regras de Reatividade do Vue.js

Como um armazém de estado Vuex é feito reativo pelo Vue, quando nós mudamos o estado, os compoentes Vue que estão observando-o irão atualizar automaticamente. Isso também significa que as mutações do Vuex estão subjetivas para as mesmas regras e ressalvas de quando utilizamos apenas o Vue.js
Since a Vuex store's state is made reactive by Vue, when we mutate the state, Vue components observing the state will update automatically. This also means Vuex mutations are subject to the same reactivity caveats when working with plain Vue:

1. Prefira inicializar o estado inicial do seu armazém com todos os campos definidos previamente.

2. Ao adicionar novas propriedades para um objeto, você deve seguir uma das duas opções abaixo:

  - Utilize `Vue.set(obj, 'newProp', 123)`, ou -

  - Substitua o objeto antigo por um novo. Por exemplo, utilizando o stage-2 [object spread syntax](https://github.com/sebmarkbage/ecmascript-rest-spread) nós poderíamos escrever assim:

  ``` js
  state.obj = { ...state.obj, newProp: 123 }
  ```

### Utilizando Constantes para nomes de Mutações

Também é uma prática comum utilizar constantes para os nomes das mutações - elas irão permitir que o código tome vantagens de ferramentas como linters, e colocar todas as constantes em um único arquivo permite que seus colaboradores possam ter uma visualização geral de todas as mutações que são possíveis em sua aplicação:

``` js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

``` js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  actions: { ... },
  mutations: {
    // we can use the ES2015 computed property name feature
    // to use a constant as the function name
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

Whether to use constants is largely a preference - it can be helpful in large projects with many developers, but it's totally optional if you don't like them.

### Mutações Precisam ser Síncronas

Uma regra importante para se lembrar é que **o handler de uma mutação sempre deve ser síncrono**. Por que? Considere o exemplo a seguir:

``` js
mutations: {
  SOME_MUTATION (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Agora imagine que nós estamos debugando o app e olhando nosso log de mutações. Para todas as mutações que estão no log, nós queremos compará-las com <i>snapshots</i> do estado *antes* e *depois* da mutação. Entretanto, os callbacks assíncronos dentro do exemplo de mutação acima faz com que isso seja impossível: o callback não é chamado quando a mutação é disparada, e nós não sabemos quando o callback será chamado de verdade. Qualquer mutação no estado que for realizada no callback é essencialmente irrastreável!

### Ações

Assincronidade combinada com mutações do estado podem fazer nossa aplicação ser de difícil compreensão. Por exemplo, quando você chama dois métodos, e ambos possuem callbacks assíncronos para modificar o estado, como você sabe qual método foi chamado e qual callback foi executado primeiro? É por isso que nós separamos os dois conceitos. Com o Vuex, nós realizamos todas as mutações no estado de forma síncrona. Nós iremos realizar qualquer ação assíncrona dentro de [Ações](actions.md).
