# Estado and Getters

### Árvore única de estado

O Vuex utiliza uma **árvore única de estado** - ou seja, esse único objeto contém todo estado do nível de Aplicação e funciona como uma "fonté única de verdade". Isso também significa que você terá somente um armazém por aplicação. Uma única árvore de estado faz com seja simples localizar uma parte específica do seu estado, e nos permite facilmente tirar <i>snapshots</i> da aplicação para debugar.

A árvore única de estado não é conflitante com o conceito de modularidade - nos próximos capítulos nós iremos discutir como separar o estado e as mutações em submódulos.

### Recuperando Estado do Vuex em Componentes Vue

Então como nós exibimos o estado do armazém em nossos componentes Vue? Já que os armazéns são reativos, a forma mais simples de "recupearar" o estado dele é simplesmente retornar o estado a partir de uma [computed property](http://vuejs.org/guide/computed.html):

``` js
// na definição de um componente Vue
computed: {
  count: function () {
    return store.state.count
  }
}
```

A qualquer momento que o valor de `store.state.count` for modificado, ele irá obrigar a <i>computed property</i>, a se atualizar, e irá disparar as mudanças nos DOM's associados.

Entretanto, esse padrão faz com que o componente esteja ligado com a instância única global do armazém. Isso faz com que seja mais difcíl para testar o componente, e também mais difícil para executar múltiplas instâncias do aplicativo utilizando o mesmo conjunto de componentes. Em aplicações maiores, nós provavelmente iremos preferir "injetar" o armazém em componentes filhos. Você pode fazer como no exeplo a seguir:

1. Instale o Vuex e conecte seu componente raíz ao armazém:

  ``` js
  import Vue from 'vue'
  import Vuex from 'vuex'
  import store from './store'
  import MyComponent from './MyComponent'

  // important, teaches Vue components how to
  // handle Vuex-related options
  Vue.use(Vuex)

  var app = new Vue({
    el: '#app',
    // provide the store using the "store" option.
    // this will inject the store instance to all child components.
    store,
    components: {
      MyComponent
    }
  })
  ```

  Ao informar a opção `store` para a instância principal, o armazém será injetado em todos os componentes filhos da instância principal e estará disponível neles a partir da opção `this.$store`. Entretando, dificilmente você terá que referenciá-lo.

2. Dentro dos componentes filhos, recupere o estado utilizando funções **getter** na opção `vuex.getters`:

  ``` js
  // MyComponent.js
  export default {
    template: '...',
    data () { ... },
    // this is where we retrieve state from the store
    vuex: {
      getters: {
        // a state getter function, which will
        // bind `store.state.count` on the component as `this.count`
        count: function (state) {
          return state.count
        }
      }
    }
  }
  ```

  Note o bloco de opções especial chamado `vuex`. É aqui que nós especificamos qual estado o componente estará utilizando do armazem. Para cada propriedade, nós especificamos uma função <i>getter</i> que recebe a árvore de estados como argumento único, e então seleciona e retorna parte do estado, ou um valor computado derivado do estado. O resultado retornado será setado no componente utilizando uma propriedade nomeada, como uma computed property.

  Em vários casos, a função "getter" pode ser bem sucinta utilizando as arrow functions do ES2015:

  ``` js
  vuex: {
    getters: {
      count: state => state.count
    }
  }
  ```

### Getters Devem ser puros

Todos os getters Vuex devem ser [funções puras](https://en.wikipedia.org/wiki/Pure_function) - eles recebem toda a árove de estados, e retornam um valor baseado somente no estado. Isso faz com que elas sejam mais testáveis e eficientes. Isso também significa que **você não pode utilizar o `this` em getters**.

Se você precisar acessar o `this`, por exemplo, para computar um estado derivado baseado no estado do componente local ou propriedades deles, você precisa definir computed properties separadas:

``` js
vuex: {
  getters: {
    currentId: state => state.currentId
  }
},
computed: {
  isCurrent () {
    return this.id === this.currentId
  }
}
```

### Getters Podem retornar estado derivado

No Vuex, Getters de estado na verdade são computed, e isso significa que você pode utilizá-los de forma reativa (e eficiente) como uma computed property. Por exemplo, vamos dizer que no estado nós possuímos um array de mensagens chamado `messages`, e um `currentThreadID` representando a conversa atual que o usuário está participando. Nós queremos exibir para o usuário uma listra de mensagens filtradas que são referentes a conversa atual:

``` js
vuex: {
  getters: {
    filteredMessages: state => {
      return state.messages.filter(message => {
        return message.threadID === state.currentThreadID
      })
    }
  }
}
```

Como as Computed properties do Vue js ficam em cache automaticamente e são apenas atualizadas quando uma dependência é modificada, você não precisa se preocupar com essa função sendo chamada em todas as mutações.

### Compartilhando Getters em Múltiplos Componentes

Como você pode ver, o getter `filteredMessages` pode ser útil dentro de vários componentes. Nesse caso, é uma boa ideia compartilhar essa função entre esses componentes:

``` js
// getters.js
export function filteredMessages (state) {
  return state.messages.filter(message => {
    return message.threadID === state.currentThreadID
  })
}
```

``` js
// in a component...
import { filteredMessages } from './getters'

export default {
  vuex: {
    getters: {
      filteredMessages
    }
  }
}
```

Como os getters são puros, getters compartilhados são colocados em cache de forma eficiente: quando as dependências mudam, eles só precisam se atualizar uma vez e todos os componentes terão o valor atualizado.

> Referência Flux: Os getters do Vuex podem ser mais ou menos comparados com [`mapStateToProps`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) on Redux. Entretando, como eles utilizam o sistema do Vue.js para computed properties por trás das cortinas, eles são mais eficientes que o `mapStateToProps`, e mais similares ao [reselect](https://github.com/reactjs/reselect).

### Componentes Não São Permitidos a Modificarem o Estado Diretamente

É importante se lembrar que **componentes nunca devem modificar o estado do armazém Vuex diretamente**. Já que nós queremos que todas as mutações sejam explícitas e rastreáveis, todas as mutações de estado no Vuex devem ser conduzidas dentro dos handlers das mutações do armazém..

Para ajudar a "obrigar" essa regra, quando você estiver com o [Strict Mode](strict.md) habilitado, se o estado do armazém é modificado fora dos handlers de mutação, o Vuex vai disparar um erro.

Com essa regra ativa, nossos componentes Vue agora tem muito menos responsabilidades: eles estão ligados ao armazém de estado do Vuex com getters apenas de leitura, e a única maneira para eles modificarem o estado é de alguma forma disparando **mutações** (que nós vamos discutir mais tarde). Eles ainda podem conter e modificar seu estado local se necessário, mas nós não colocamos nenhuma lógica para buscar dados ou modificar o estado global dentro de componentes individuais. Eles agora estão centralizados nos arquivos relacionados ao Vuex, o que torna aplicações grandes e complexas fáceis de se entender e manter.
