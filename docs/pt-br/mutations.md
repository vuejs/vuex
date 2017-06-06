# Mutações

A única forma de alterar um estado numa store do Vuex é cometendo uma mutação. As mutações do Vuex são muito parecidas com eventos: cada mutação possui uma string **type** (ou __tipo__ ) e um **handler** (ou __manipulador__). A função handler é onde acontece as modificações de estado de fato, e vai receber o estado como seu primeiro argumento.


``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // muta o estado
      state.count++
    }
  }
})
```
Você não pode chamar diretamente um handler de mutação. As opções aqui são bem parecidas com a de registro de eventos: "Quando uma mutação do tipo `increment` é disparada, chame esse handler." para invocar um handler de mutação, você precisa chamar `store.commit` com seu tipo:


``` js
store.commit('increment')
```

### Cometimento com carga (ou payload)

Você pode passar um argumento adicional para `store.commit`, que é chamado de **payload** (ou __carga__) para a mutação:
 

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

Na maioria dos casos, o payload deve ser um objeto para que possa conter múltiplos campos, e assim a mutação gravada vai ser mais descritiva.


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

### Cometimento no Estilo Objeto (ou Object-Style Commit)

Uma forma alternativa de cometer uma mutação é usar diretamente um objeto que possua a propriedade `type`:


``` js
store.commit({
  type: 'increment',
  amount: 10
})
```
Quando for usar um commit no estilo objeto, o objeto inteiro vai ser passado como payload para o handler da mutação, assim o handler permanece o mesmo.


``` js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### Mutações Seguem as Regras do Vue de Reatividade


A partir do momento que o estado de uma store é feito reativo pelo Vue, quando mutamos o estado, os componentes do Vue observando o estado vão se atualizar automaticamente. Também significa que as mutações Vuex são vítimas das mesmas ressalvas quando estamos trabalhando com Vue puro:

1. Prefira inicializar seu estado inicial da store com todos os campos desejados adiantadamente.

2. Quando for adicionar novas propriedades para um objeto, você deve ou:

  - Usar `Vue.set(obj, 'novaPropriedade', 123)`, ou - 

  - Substituir esse objeto por um novo. Por exemplo, usando a [sintaxe de espalhamento de objeto](https://github.com/sebmarkbage/ecmascript-rest-spread), podemos escrever assim:

      ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### Usando Constantes como Tipos de Mutação

Usar constantes em tipos de mutação é um padrão comumente visto em várias implementações de Flux. Permite que o código tire vantagem de ferramentas como linters, e colocar todas as constantes em um único arquivo permite que seus colaboradores tenham uma noção imediata ao olhar de quais mutações são possíveis na aplicação inteira.



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
    // podemos usar o recurso de nomeação de propriedades
    // computadas do ES2015 para usar uma constante como 
    // nome da função
    [SOME_MUTATION] (state) {
      // muta o estado
    }
  }
})
```

Usar ou não constantes é uma questão de preferência - pode ser útil em projetos grandes com muitos desenvolvedores, mas é totalmente opcional se você não gostar delas.


### Mutações devem ser Síncronas

Uma regra importante para se lembrar é que **handlers de mutações devem ser síncronos**. Por quê? Vamos considerar o seguinte exemplo:


``` js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```
Agora imagine que estamos debugando a aplicação e olhando para os logs de mutações da devtools. Para cada mutação logada, o devtool vai precisar capturar um "antes" e "depois" daquele snapshot de estado. Entretanto, os callbacks assíncronos dentro da mutação do exemplo acima torna isso impossível: o callback não é chamado quando a mutação é cometida, e não há forma do devtool saber quando o callback vai ser chamado - qualquer mutação de estado ocorrida dentro do callback é essencialmente não-rastreável!


### Cometendo Mutações em Componentes

Você pode cometer mutações em componentes com `this.$store.commit('xxx')`, ou usar o helper `mapMutations` que mapeia métodos do componentes nas chamadas (requer injeção do `store` da raiz):

``` js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // mapeia  `this.increment()` para `this.$store.commit('increment')`
      
      // `mapMutations` também suporta payloads:
      'incrementBy' // mapeia `this.incrementBy(amount)` para `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // mapeia `this.add()` para `this.$store.commit('increment')`
    })
  }
}
```

### Indo para Actions (ou Ações)

Assincronismo combinada com mutações de estados podem tornar seu programa muito difícil de analisar. Por exemplo, quando você pode chamar dois métodos, ambos com callbacks assíncronos que fazem mutação no estado, como você sabe quando eles são chamados e qual foi chamado primeiro? É exatamente por isso que queremos separar esses dois conceitos. No Vuex, **mutações são transações síncronas**


``` js
store.commit('increment')
// qualquer mudança de estado que a mutação "increment" cause deve  
// acontecer nesse momento
```

Para lidar com operações assíncronas, vamos apresentar a vocês as [Ações](actions.md). 
