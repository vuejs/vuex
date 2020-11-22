# Mutações

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/ckMZp4HN" target="_blank" rel="noopener noreferrer">Tente esta lição no Scrimba</a></div>

A única maneira de realmente mudar de estado em um _store_ Vuex é por confirmar (ou fazer _commit_ de) uma mutação. As mutações do Vuex são muito semelhantes aos eventos: cada mutação tem uma _String_ **_type_** e um **_handler_**. Na função manipuladora (ou _handler_) é onde realizamos modificações de estado reais e ele receberá o estado como o 1º argumento:


```js
const store = createStore({
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

Você não pode chamar diretamente uma função manipuladora de mutação. Pense nisso mais como registro de evento: "Quando uma mutação com o _type_ `increment` é acionada, chame este _handler_." Para invocar uma função manipuladora de mutação (_handler_), você precisa chamar `store.commit` com seu tipo (_type_):

```js
store.commit('increment')
```

## Confirmação (ou Commit) com Payload

Você pode passar um argumento adicional para o `store.commit`, que é chamado de **_payload_** para a mutação:

```js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```

```js
store.commit('increment', 10)
```

Na maioria dos casos, o _payload_ deve ser um objeto para que possa conter vários campos, e a mutação gravada também será mais descritiva:

```js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

```js
store.commit('increment', {
  amount: 10
})
```

## Confirmação (ou Commit) Estilo-Objeto

Uma maneira alternativa de confirmar (ou fazer um _commit_ de) uma mutação é usando diretamente um objeto que tenha uma propriedade `type`:

```js
store.commit({
  type: 'increment',
  amount: 10
})
```

Ao usar a Confirmação Estilo-Objeto, o objeto inteiro será passado como o _payload_ para os manipuladores de mutação, portanto, a função manipuladora permanecerá a mesma:

```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

## Usando Constantes para Declarar os Tipos de Mutação

É um padrão comumente visto usar constantes para declarar tipos de mutação em várias implementações do _Flux_. Isso permite que o código aproveite as ferramentas como os _linters_, e colocar todas as constantes em um único arquivo permite que seus colaboradores tenham uma visão geral das mutações possíveis em toda a aplicação:

```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

```js
// store.js
import { createStore } from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = createStore({
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

## Mutações Devem Ser Síncronas

Uma regra importante a lembrar é que **as funções manipuladoras de mutação devem ser síncronas**. Por quê? Considere o seguinte exemplo:

```js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Agora imagine que estamos depurando a aplicação e observando os logs de mutação do _devtool_. Para cada mutação registrada, o _devtool_ precisará capturar os momentos "antes" e "depois" do estado. No entanto, o _callback_ assíncrono dentro da mutação de exemplo acima torna isso impossível: o _callback_ ainda não é chamado quando a mutação é confirmada (ou o _commit_ da mutação é feito) e não há como o _devtool_ saber quando o _callback_ será realmente chamado - qualquer mutação de estado executada no _callback_ é essencialmente impossível de rastrear!

## Confirmando (ou fazendo Commits de) Mutações em Componentes

Você pode confirmar (ou fazer _commit_ de) mutações em componentes com `this.$store.commit('xxx')`, ou use o método auxiliar `mapMutations` que mapeia métodos de componentes para chamadas `store.commit` (requer injeção do _store_ raiz):

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // mapeia `this.increment()` para `this.$store.commit('increment')`

      // `mapMutations` also supports payloads:
      'incrementBy' // mapeia `this.incrementBy(amount)` para`this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // mapeia `this.add()` para`this.$store.commit('increment')`
    })
  }
}
```

## Vamos as Ações

A assincronicidade combinada com mutação de estado pode tornar seu programa muito difícil de entender. Por exemplo, quando você chama dois métodos com retornos de _callbacks_ assíncronos que alteram o estado, como saber quando eles são chamados e qual retorno de _callback_ foi chamado primeiro? É exatamente por isso que queremos separar os dois conceitos. No Vuex, **mutações são transações síncronas**:

```js
store.commit('increment')
// qualquer mudança de estado que a mutação "increment" pode causar
// deve ser feito neste momento.
```

Para lidar com operações assíncronas, vamos apresentar [Ações](actions.md).
