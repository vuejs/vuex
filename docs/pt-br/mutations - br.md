# Muta��es

A �nica maneira de mudar o estado em uma loja Vuex � comitando uma muta��o. As muta��es Vuex s�o muito semelhantes aos eventos: cada muta��o possui uma string ** tipo ** e um ** manipulador **. A fun��o do manipulador � onde n�s executamos modifica��es de estado reais e receber� o estado como o primeiro argumento:

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // mutate state
      state.count++
    }
  }
})
```

Voc� n�o pode chamar diretamente um manipulador de muta��o. Pense nisso mais como registro de eventos: "Quando uma muta��o com tipo` incremento '� ativada, chame esse manipulador. " Para invocar um manipulador de muta��o, voc� precisa chamar `store.commit` com seu tipo:

``` js
store.commit('increment')
```

### Commit com payload

Voc� pode passar um argumento adicional para `store.commit`, que � chamado de ** payload ** para a muta��o:

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

Na maioria dos casos, o payload deve ser um objeto para que ele possa conter v�rios campos e a muta��o gravada tamb�m ser� mais descritiva:

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

Uma maneira alternativa de confirmar uma muta��o � usando diretamente um objeto que possui uma propriedade `type`:
``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

Ao comitar com object-style, todo o objeto ser� passado como o payload para manipuladores de muta��o, de modo que o manipulador permane�a o mesmo:

``` js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### Muta��es seguem as regras de reatividade do Vue

Uma vez que o estado de uma loja Vuex � reativo pela Vue, quando mutar o estado, os componentes Vue que observam o estado ser�o atualizados automaticamente. Isso tamb�m significa que as muta��es Vuex est�o sujeitas �s mesmas ressalvas de reatividade quando se trabalha com apenas Vue:

1. Prefira inicializar o estado inicial da sua loja com todos os campos desejados antecipadamente.

2. Ao adicionar novas propriedades a um objeto, voc� deve:

  - Use `Vue.set(obj, 'newProp', 123)`, ou

  
  - Substitua esse Objeto por um novo. Por exemplo, usando o est�gio 3 [object spread syntax] (https://github.com/sebmarkbage/ecmascript-rest-restpread), podemos grav�-lo assim:


    ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### Usando Constantes para Tipos de Muta��o

� um padr�o normalmente visto para usar constantes para tipos de muta��o em v�rias implementa��es de Flux. Isso permite que o c�digo aproveite ferramentas como linters e colocar todas as constantes em um �nico arquivo permite que seus colaboradores tenham uma vis�o r�pida de quais muta��es s�o poss�veis em todo o aplicativo:

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
    // usar uma constante como o nome da fun��o
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

Querer usar constantes � ,em grande parte, uma prefer�ncia - pode ser �til em grandes projetos com muitos desenvolvedores, mas � totalmente opcional se voc� n�o gosta deles.

### Muta��es devem ser s�ncronas

Uma regra importante a lembrar � que ** as fun��es do manipulador de muta��o devem ser s�ncronas **. Por qu�? Considere o seguinte exemplo:
``` js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Agora imagine que estamos depurando o aplicativo e observamos os registros de muta��o do devtool. Para cada muta��o registrada, o devtool precisar� capturar instant�neos "antes" e "depois" do estado. No entanto, o retorno de chamada ass�ncrono dentro da muta��o de exemplo acima torna isso imposs�vel: a devolu��o de chamada ainda n�o � chamada quando a muta��o est� comitada, e n�o existe nenhuma maneira para o devtool saber quando a chamada de retorno ser� chamada - qualquer muta��o de estado realizada no retorno de chamada � essencialmente n�o rastre�vel!

### Comitando Muta��es em Componente
Voc� pode comitar muta��es em componentes com `this. $ Store.commit ('xxx')`, ou use o auxiliar `mapMutations` que mapeia m�todos de componente para chamadas` store.commit` (requer a inje��o root `store`):
``` js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // map `this.increment()` to `this.$store.commit('increment')`

      // `mapMutations` also supports payloads:
      'incrementBy' // map `this.incrementBy(amount)` to `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // map `this.add()` to `this.$store.commit('increment')`
    })
  }
}
```

### A��es

Asincronicidade combinada com a muta��o do estado pode tornar o seu programa muito dif�cil de aconteccer. Por exemplo, quando voc� chama dois m�todos com retrocessos ass�ncronos que mutam o estado, como voc� sabe quando eles s�o chamados e qual callback foi chamado primeiro? � exatamente por isso que queremos separar os dois conceitos. No Vuex, as muta��es ** s�o transa��es s�ncronas **:

``` js
store.commit('increment')
// qualquer altera��o de estado que a muta��o "incrementar" possa causar
// deve ser feita neste momento
```

Para lidar com opera��es ass�ncronas, vamos apresentar [Actions](actions.md).

