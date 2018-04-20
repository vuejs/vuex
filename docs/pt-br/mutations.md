# Mutações

A única maneira de mudar o estado em uma _store_  Vuex é fazendo _commit_  de uma mutação. As mutações Vuex são muito semelhantes aos eventos: cada mutação possui uma string **tipo** e um **manipulador**. A função do manipulador é onde nós executamos modificações de estado reais e receberá o estado como o primeiro argumento:

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // muda o estado
      state.count++
    }
  }
})
```

Você não pode chamar diretamente um manipulador de mutação. Pense nisso mais como registro de eventos: "Quando uma mutação com tipo `incremento` é ativada, chame esse manipulador." Para invocar um manipulador de mutação, você precisa chamar `store.commit` com seu tipo:

``` js
store.commit('increment')
```

### Commit com payload

Você pode passar um argumento adicional para `store.commit`, que é chamado de **payload** para a mutação:

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

### Commit com Object-Style

Uma maneira alternativa de confirmar uma mutação é usando diretamente um objeto que possui uma propriedade `type`:
``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

Ao fazer um _commit_  com object-style, todo o objeto será passado como payload para os manipuladores de mutação, de modo que o manipulador permaneça o mesmo:

``` js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### Mutações seguem as regras de reatividade do Vue

Uma vez que o estado de uma _store_  Vuex é reativo para o Vue, quando mutar o estado, os componentes Vue que observam o estado serão atualizados automaticamente. Isso também significa que as mutações Vuex estão sujeitas às mesmas ressalvas de reatividade quando se trabalha com apenas Vue:

1. Prefira inicializar o estado inicial da sua _store_  com todos os campos desejados antecipadamente.

2. Ao adicionar novas propriedades a um objeto, você deve:

  - Use `Vue.set(obj, 'newProp', 123)`, ou


  - Substitua esse Objeto por um novo. Por exemplo, usando o estágio 3 [object spread syntax](https://github.com/sebmarkbage/ecmascript-rest-restpread), podemos gravá-lo assim:


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
    // podemos usar o recurso de dado computado do ES2015
    // usar uma constante como o nome da função
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

Querer usar constantes é ,em grande parte, uma preferência - pode ser útil em grandes projetos com muitos desenvolvedores, mas é totalmente opcional se você não gosta deles.

### Mutações devem ser síncronas

Uma regra importante a lembrar é que **as funções do manipulador de mutação devem ser síncronas**. Por quê? Considere o seguinte exemplo:

``` js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Agora imagine que estamos depurando o aplicativo e observamos os registros de mutação do devtool. Para cada mutação registrada, o devtool precisará capturar "antes" e "depois" _snapshots_  do estado. No entanto, o retorno de chamada assíncrono dentro da mutação de exemplo acima torna isso impossível: o _callback_  ainda não foi chamado quando a mutação foi comitada, e não existe nenhuma maneira para o devtool saber quando o _callback_  será chamado - qualquer mutação de estado realizada no retorno desse _callback_  é essencialmente não rastreável!

### Fazendo commit de Mutações em Componente
Você pode fazer um commit de mutações em componentes com `this.$store.commit('xxx')`, ou use o auxiliar `mapMutations` que mapeia métodos de componente para chamadas `store.commit` (requer a injeção root `store`):
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

Assincronicidade combinada com a mutação do estado pode tornar o seu programa muito difícil de acontecer. Por exemplo, quando você chama dois métodos com retrocessos assíncronos que mutam o estado, como você sabe quando eles são chamados e qual callback foi chamado primeiro? É exatamente por isso que queremos separar os dois conceitos. No Vuex, as mutações **são transações síncronas**:

``` js
store.commit('increment')
// qualquer alteração de estado que a mutação "incrementar" possa causar
// deve ser feita neste momento
```

Para lidar com operações assíncronas, vamos apresentar as [Ações](actions.md).
