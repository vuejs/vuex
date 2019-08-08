# Estado

### Árvore Única de Estado

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cWw3Zhb" target="_blank" rel="noopener noreferrer">Tente esta lição no Scrimba</a></div>

O Vuex usa uma **árvore única de estado** - ou seja, esse único objeto contém todo o estado do seu nível de aplicação e serve como a "única fonte da verdade". Isso também significa que você terá apenas um _store_ para cada aplicativo. Uma árvore única de estado facilita a localização de uma parte específica do estado, e permite capturar facilmente momentos do estado atual do aplicativo para fins de depuração.

A árvore única de estado não entra em conflito com a modularidade - em capítulos posteriores, discutiremos como dividir seu estado e mutações em sub-módulos.

### Obtendo o Estado Vuex nos Componentes Vue

Então, como exibimos o estado dentro do _store_ em nossos componentes Vue? Uma vez que os _stores_ Vuex são reativos, a maneira mais simples de "recuperar" o estado é simplesmente retornar algum estado do _store_ dentro de um [dado computado](https://br.vuejs.org/v2/guide/computed.html):

``` js
// vamos criar um componente de Contador
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

Sempre que o _store.state.count_ muda, fará com que o dado computado seja reavaliado e ative as atualizações de _DOM_ associadas.

No entanto, esse padrão faz com que o componente dependa do _store_ _singleton_ global. Ao usar um sistema de módulo, ele precisa importar o _store_ em todos os componentes que usam o estado do _store_ e também requer _mocking_ ao testar o componente.

O Vuex fornece um mecanismo para "injetar" o _store_ em todos os componentes filho do componente raiz com a opção _store_ (habilitada por `Vue.use(Vuex)`):

``` js
const app = new Vue({
  el: '#app',
  // fornece o store usando a opção "store".
  // isso irá injetar a instância do store em todos os componentes filhos.
  store,
  components: { Counter },
  template: `
    <div id="app">
      <counter></counter>
    </div>
  `
})
```

Ao fornecer a opção _store_ para a instância raiz, o _store_ será injetado em todos os componentes filho da raiz e estará disponível neles como `this.$store`. Vamos atualizar a nossa implementação _Counter_:

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

### O Auxiliar `mapState`

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/c8Pz7BSK" target="_blank" rel="noopener noreferrer">Tente esta lição no Scrimba</a></div>

Quando um componente precisa fazer uso de várias propriedades do estado do _store_ ou _getters_, declarar todos esses dados computados pode ser repetitivo e verboso. Para lidar com isso, podemos usar o auxiliar `mapState` que gera funções _getter_ computadas para nós, economizando algumas linhas de código:

``` js
// em builds completos, os auxiliares são expostos como Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // As arrow functions (ou funções de seta) podem tornar o código muito sucinto!
    count: state => state.count,

    // passar o valor da String 'count' é o mesmo que `state => state.count`
    countAlias: 'count',

    // para acessar o estado local com `this`, uma função normal deve ser usada
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

Também podemos passar um _Array_ de _Strings_ para _mapState_ quando o nome de um dado computado mapeado é o mesmo que um nome de árvore secundária do estado.

``` js
computed: mapState([
  // mapeia this.count para store.state.count
  'count'
])
```

### Objeto Spread Operator

Observe que _mapState_ retorna um objeto. Como usá-lo em combinação com outros dados computados locais? Normalmente, teríamos que usar um utilitário para fundir vários objetos em um para que possamos passar o objeto final para `computado`. No entanto, com o [Spread Operator](https://github.com/sebmarkbage/ecmascript-rest-spread) (que é uma proposta de ECMAScript em estágio 4), podemos simplificar muito a sintaxe:

``` js
computed: {
  localComputed () { /* ... */ },
  // mistura isso no objeto externo com o objeto spread operator
  ...mapState({
    // ...
  })
}
```

### Componentes Ainda Podem Ter Um Estado Local

O uso do Vuex não significa que você deve colocar **tudo** no estado do Vuex. Embora colocar mais estado no Vuex torna suas mutações de estado mais explícitas e depuráveis, às vezes também pode tornar o código mais verboso e indireto. Se um pedaço de estado pertence estritamente a um único componente, pode ser bom deixá-lo apenas como um estado local. Você deve pesar os prós e contras e tomar decisões que atendam às necessidades de desenvolvimento da sua aplicação.
