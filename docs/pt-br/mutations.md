# Mutações

A única maneira de mudar o estado em uma loja Vuex é comitando uma mutação. As mutações Vuex são muito semelhantes aos eventos: cada mutação possui uma string ** tipo ** e um ** manipulador **. A função do manipulador é onde nós executamos modificações de estado reais e receberá o estado como o primeiro argumento:

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // muda o state
      state.count++
    }
  }
})
```

Você não pode chamar diretamente um manipulador de mutação. Pense nisso mais como registro de eventos: "Quando uma mutação com tipo` incremento 'é ativada, chame esse manipulador. " Para invocar um manipulador de mutação, você precisa chamar `store.commit` com seu tipo:

``` js
store.commit('increment')
```

### Commit com payload

Você pode passar um argumento adicional para `store.commit`, que é chamado de ** payload ** para a mutação:

``` js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```
``` js
store.commit('increment', 10)
```

Na maioria dos casos, o payload deve ser um objeto para que ele possa conter vários campos e a mutação gravada também será mais descritiva:

``` js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

``` js
store.commit('increment', {
  amount: 10
})
```

### Comitar com Object-Style

Uma maneira alternativa de confirmar uma mutação é usando diretamente um objeto que possui uma propriedade `type`:
``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

Ao comitar com object-style, todo o objeto será passado como o payload para manipuladores de mutação, de modo que o manipulador permaneça o mesmo:

``` js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### Mutações seguem as regras de reatividade do Vue

Uma vez que o estado de uma loja Vuex é reativo pela Vue, quando mutar o estado, os componentes Vue que observam o estado serão atualizados automaticamente. Isso também significa que as mutações Vuex estão sujeitas às mesmas ressalvas de reatividade quando se trabalha com apenas Vue:

1. Prefira inicializar o estado inicial da sua loja com todos os campos desejados antecipadamente.

2. Ao adicionar novas propriedades a um objeto, você deve:

  - Use `Vue.set(obj, 'newProp', 123)`, ou

  
  - Substitua esse Objeto por um novo. Por exemplo, usando o estágio 3 [object spread syntax] (https://github.com/sebmarkbage/ecmascript-rest-restpread), podemos gravá-lo assim:


    ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### Usando Constantes para Tipos de Mutação

É um padrão normalmente visto para usar constantes para tipos de mutação em várias implementações de Flux. Isso permite que o código aproveite ferramentas como linters e colocar todas as constantes em um único arquivo permite que seus colaboradores tenham uma visão rápida de quais mutações são possíveis em todo o aplicativo:

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
  mutations: {
    // podemos usar o recurso de propriedade computada do ES2015
    // usar uma constante como o nome da função
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

Querer usar constantes é ,em grande parte, uma preferência - pode ser útil em grandes projetos com muitos desenvolvedores, mas é totalmente opcional se você não gosta deles.

### Mutações devem ser síncronas

Uma regra importante a lembrar é que ** as funções do manipulador de mutação devem ser síncronas **. Por quê? Considere o seguinte exemplo:
``` js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Agora imagine que estamos depurando o aplicativo e observamos os registros de mutação do devtool. Para cada mutação registrada, o devtool precisará capturar instantâneos "antes" e "depois" do estado. No entanto, o retorno de chamada assíncrono dentro da mutação de exemplo acima torna isso impossível: a devolução de chamada ainda não é chamada quando a mutação está comitada, e não existe nenhuma maneira para o devtool saber quando a chamada de retorno será chamada - qualquer mutação de estado realizada no retorno de chamada é essencialmente não rastreável!

### Comitando Mutações em Componente
Você pode comitar mutações em componentes com `this. $ Store.commit ('xxx')`, ou use o auxiliar `mapMutations` que mapeia métodos de componente para chamadas` store.commit` (requer a injeção root `store`):
``` js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // mapeia `this.increment()` para `this.$store.commit('increment')`

      // `mapMutations` também suporta payloads:
      'incrementBy' // mapeia `this.incrementBy(amount)` para `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // mapeia `this.add()` para `this.$store.commit('increment')`
    })
  }
}
```

### Ações

Assincronicidade combinada com a mutação do estado pode tornar o seu programa muito difícil de acontecer. Por exemplo, quando você chama dois métodos com retrocessos assíncronos que mutam o estado, como você sabe quando eles são chamados e qual callback foi chamado primeiro? É exatamente por isso que queremos separar os dois conceitos. No Vuex, as mutações ** são transações síncronas **:

``` js
store.commit('increment')
// qualquer alteração de estado que a mutação "incrementar" possa causar
// deve ser feita neste momento
```

Para lidar com operações assíncronas, vamos apresentar [Actions](actions.md).

