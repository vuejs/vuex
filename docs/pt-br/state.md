# Estado 

### Àrvore de Estado Único

Vuex usa uma  **árvore de estado único** - que é o único objeto que contém todo o estado a nível de aplicação e serve como a "fonte única da verdade". Também significa que geralmente você só vai ter uma única store para cada aplicação. A árvore de estado único torna direto o processo de localização de um pedaço específico do estado, e nos permite facilmente tirar snapshots do estado atual da aplicação para fins de debug.

A árvore de estado único não conflita com a modularidade - em capítulos mais avançados vamos discutir como dividir seu estado e mutações em submódulos.


### Recebendo os estados do Vuex em componentes do Vue

Então como exibimos estados dentro do store nos nossos componentes? Já que as stores do Vuex são reativas, a forma mais simples de "receber" o estado é simplesmente retornar algum estado da store de dentro de uma [propriedade computada](http://vuejs.org/guide/computed.html):

``` js
// Vamos criar um componente Contador
const Contador = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```


Toda vez que `store.state.count` muda, vai fazer com que a propriedade computada seja reavaliada, e vai disparar as atualizações associadas ao DOM.

Entretanto, esse padrão faz com que o componente dependa do singleton de store global. Ao usar um sistema de módulos, precisamos importar a store em todos os componentes que usam estados da store, além de fazer a mesma coisa quando vamos testar o componente.

Vuex fornece um mecanismo para "injetar" a store em todos os componentes filhos do componente raiz. Basta usar a opção `store` (habilitada pelo `Vue.use(Vuex)`):

``` js
const app = new Vue({
  el: '#app',
  // fornece a store usando a opção "store"
  // isso vai injetar a instância da store em todos os componentes filho
  store,
  components: { Contador },
  template: `
    <div class="app">
      <contador></contador>
    </div>
  `
})
```

Ao usar a opção `store` na instância raiz, a store vai ser injetada em todos os componentes filhos da raiz e vai estar disponível nelas como `this.$store`. Vamos atualizar a implementação do nosso `Contador`:

``` js
const Contador = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

### O  Helper `mapState`

Quando um componente precisa fazer uso de múltiplas propriedades do estado da store, ou quando precisa de getters, declarar todas essas propriedades computadas pode se tornar uma tarefa repetitiva e verbosa. Para lidar com isso, podemos fazer uso do helper `mapState` que gera funções do tipo getter computadas para nós, ajudando a economizar algumas digitadas.


``` js
// Nas builds completas, os helpers são expostos como Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // arrow functions tornam o código bem sucinto!
    count: state => state.count,

    // passar a string 'count' é o mesmo que `state => state.count`
    countAlias: 'count',
    
    // para acessar o estado local com `this`, uma função normal deve ser usada 
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

também podemos passar uma array de strings para `mapState` quando o nome da propriedade computada mapeada é o mesmo nome da sub-árvore de estado.

``` js
computed: mapState([
  // mapeia this.count para store.state.count
  'count'
])
```

### Operador de Espalhamento de Objeto (ou Object Spread Operator)

Perceba que `mapState` retorna um objeto. Como usamos ele em combinação com outras propriedades computadas locais? Normalmente teríamos que usar um utilitário para combinar múltiplos objetos em um só para que possamos passar o objeto final para `computed`. Entretanto, com o [óperador de espalhamento de objeto](https://github.com/sebmarkbage/ecmascript-rest-spread) (que é uma proposta ECMAScript em estágio 3), podemos simplificar muito a sintaxe:

``` js
computed: {
  localComputed () { /* ... */ },
  // Mistura no objeto externo com o operador de espalhamento de objeto
  ...mapState({
    // ...
  })
}
```

### Componentes ainda podem ter estado local

Usar Vuex não significa que você deva colocar **todo** o estado em Vuex. Embora colocar os estados no Vuex faz com que suas mutações de estado fiquem mais explícitas e debugáveis, às vezes também pode tornar o código mais verboso e indireto. Se uma parte do estado pertence estritamente a um único componente, tudo bem deixá-lo como estado local. Você deve medir as vantagens e desvantagens e tomar decisões que se encaixem nas necessidades de desenvolvimento da sua aplicação.
 
