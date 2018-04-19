# Estado

### Árvore simples de estado

O Vuex usa uma ** árvore de estado único ** - isto é, este único objeto contém todo o seu nível de aplicativo e serve como "fonte única de verdade". Isso também significa que você terá apenas uma loja para cada aplicativo. Uma única árvore de estados torna direto localizar um pedaço de estado específico e nos permite facilmente tirar instantâneos do estado do aplicativo atual para fins de depuração.

A árvore de um único estado não entra em conflito com a modularidade - em capítulos posteriores, discutiremos como dividir seu estado e mutações em sub-módulos.
### Obtendo o Vuex State em Vue Components

Então, como exibimos o estado dentro da loja em nossos componentes do Vue? Uma vez que as lojas Vuex são reativas, a maneira mais simples de "recuperar" o estado é simplesmente retornar algum estado da loja dentro de um [dado computado](https://br.vuejs.org/v2/guide/computed.html):

``` js
// vamos criar um componente de contador
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

Sempre que o `store.state.count` muda, fará com que a propriedade computada seja reavaliada e ative as atualizações de DOM associadas.
No entanto, esse padrão faz com que o componente dependa no singleton da loja global. Ao usar um sistema de módulo, ele precisa importar a loja em todos os componentes que usam o estado da loja e também requer mocking ao testar o componente.

O Vuex fornece um mecanismo para "injetar" a loja em todos os componentes filho do componente raiz com a opção `store` (habilitada por` Vue.use (Vuex) `):
``` js
const app = new Vue({
  el: '#app',
  // forneça a loja usando a opção "store".
  // isso irá injetar a instância da loja em todos os componentes filho.  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

Ao fornecer a opção `store` para a instância raiz, a loja será injetada em todos os componentes filho da raiz e estará disponível neles como esta. $ Store`. Vamos atualizar a nossa implementação `Counter`:

``` js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

### O auxiliar `mapState`

Quando um componente precisa fazer uso de várias propriedades de estado da loja ou getters, declarar que todas essas propriedades computadas podem ser repetitivas e verbosas. Para lidar com isso, podemos usar o ajudante `mapState` que gera funções getter computadas para nós, economizando algumas linhas de código:

``` js
// em pleno desenvolvimento, os ajudantes são expostos como Vuex.mapState
 import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // As funções de seta podem tornar o código muito sucinto!    count: state => state.count,

    // passar o valor da string 'count' é o mesmo que `state => state.count`
    countAlias: 'count',

    // para acessar o estado local com `this`, uma função normal deve ser usada
     countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

Também podemos passar uma matriz de seqüência de caracteres para `mapState` quando o nome de uma propriedade calculada mapeada é o mesmo que um nome de árvore secundária de estado.

``` js
computed: mapState([
  // map this.count to store.state.count
  'count'
])
```

### Operador de propagação de objetos (_ES2015_ _Spread_ _Operator_ )

Observe que `mapState` retorna um objeto. Como usá-lo em combinação com outras propriedades locais computadas? Normalmente, teríamos que usar um utilitário para fundir vários objetos em um para que possamos passar o objeto final para `computado`. No entanto, com o [operador de propagação de objetos](https://github.com/sebmarkbage/ecmascript-rest-spread) (que é uma proposta de ECMAScript em estágio 3), podemos simplificar muito a sintaxe:

``` js
computed: {
  localComputed () { /* ... */ },
  // Misture isso no objeto externo com o operador de propagação do objeto

  ...mapState({
    // ...
  })
}
```

### Componentes ainda podem ter um estado local

O uso do Vuex não significa que você deve colocar ** all ** no estado no Vuex. Embora colocar mais estado no Vuex torna suas mutações estatais mais explícitas e devolvíveis, às vezes também pode tornar o código mais detalhado e indireto. Se um pedaço de estado pertence estritamente a um único componente, pode ser apenas bom deixá-lo como um estado local. Você deve pesar os trade-offs e tomar decisões que atendam às necessidades de desenvolvimento do seu aplicativo.
