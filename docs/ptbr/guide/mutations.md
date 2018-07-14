# Mutações

A única maneira de realmente mudar de estado em um _store_ Vuex é por confirmar (ou fazer _commit_ de) uma mutação. As mutações do Vuex são muito semelhantes aos eventos: cada mutação tem uma cadeia de caracteres **tipo** e um **manipulador**. A função do manipulador é onde realizamos modificações de estado reais e ele receberá o estado como o 1º argumento:

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

Você não pode chamar diretamente um manipulador de mutação. Pense nisso mais como registro de evento: "Quando uma mutação com o tipo _increment_ é acionada, chame este manipulador." Para invocar um manipulador de mutação, você precisa chamar _store.commit_ com seu tipo:

``` js
store.commit('increment')
```

### Commit com Payload

Você pode passar um argumento adicional para o _store.commit_, que é chamado de **_payload_** para a mutação:

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

Na maioria dos casos, o _payload_ deve ser um objeto para que possa conter vários campos, e a mutação gravada também será mais descritiva:

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

### Confirmação (ou Commit) Estilo-Objeto

Uma maneira alternativa de confirmar (ou fazer um _commit_ de) uma mutação é usando diretamente um objeto que tenha uma propriedade `type`:

``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

Ao usar a Confirmação Estilo-Objeto, o objeto inteiro será passado como o _payload_ para os manipuladores de mutação, portanto, o manipulador permanecerá o mesmo:

``` js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### Mutações Seguem as Regras de Reatividade do Vue

Como o estado de um _store_ Vuex é reativado pelo Vue, quando alteramos o estado, os componentes do Vue observando o estado serão atualizados automaticamente. Isso também significa que as mutações do Vuex estão sujeitas às mesmas ressalvas de reatividade ao trabalhar com o Vue simples:

1. Prefira inicializar o estado inicial do seu _store_ com todos os campos desejados antecipadamente.

2. Ao adicionar novas propriedades a um Objeto, você deve:

  - Usar `Vue.set(obj, 'newProp', 123)`, ou

  - Substitua esse objeto por um novo. Por exemplo, usando o _stage-3_ [object spread syntax](https://github.com/sebmarkbage/ecmascript-rest-spread) nós podemos escrevê-lo assim:

    ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### Usando Constantes para Tipos de Mutação

É um padrão comumente visto usar constantes para tipos de mutação em várias implementações do _Flux_. Isso permite que o código aproveite as ferramentas como os _linters_, e colocar todas as constantes em um único arquivo permite que seus colaboradores tenham uma visão geral das mutações possíveis em todo o aplicativo:

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
    // podemos usar o recurso de nome do dado computado do ES2015
    // para usar uma constante como o nome da função
    [SOME_MUTATION] (state) {
      // muda o estado
    }
  }
})
```

Se usar constantes é em grande parte uma preferência - pode ser útil em grandes projetos com muitos desenvolvedores, mas é totalmente opcional se você não gostar deles.

### Mutações Devem Ser Síncronas

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

Agora imagine que estamos depurando o aplicativo e observando os logs de mutação do devtool. Para cada mutação registrada, o devtool precisará capturar os momentos "antes" e "depois" do estado. No entanto, o _callback_ assíncrono dentro da mutação de exemplo acima torna isso impossível: o _callback_ ainda não é chamado quando a mutação é confirmada (ou o _commit_ da mutação é feito) e não há como o devtool saber quando o _callback_ será realmente chamado - qualquer mutação de estado executada no _callback_ é essencialmente impossível de rastrear!

### Confirmando (ou fazendo Commits de) Mutações em Componentes

Você pode confirmar (ou fazer _commit_ de) mutações em componentes com `this.$store.commit('xxx')`, ou use o auxiliar `mapMutations` que mapeia métodos de componentes para chamadas _store.commit_ (requer injeção _store_ raiz):

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

### Vamos as Ações

Assincronia combinada com mutação de estado pode tornar seu programa muito difícil de ser compreendido. Por exemplo, quando você chama dois métodos com _callbacks_ assíncronos que alteram o estado, como você sabe quando eles são chamados e qual _callback_ foi chamado primeiro? É exatamente por isso que queremos separar os dois conceitos. No Vuex, **mutações são transações síncronas**:

``` js
store.commit('increment')
// qualquer mudança de estado que a mutação "increment" pode causar
// deve ser feito neste momento.
```

Para lidar com operações assíncronas, vamos apresentar [Ações](actions.md).
