# Estado

## Árvore Única de Estado

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cWw3Zhb" target="_blank" rel="noopener noreferrer">Tente esta lição no Scrimba</a></div>

Vuex usa uma **única árvore de estado** - ou seja, este único objeto contém todo o estado da sua aplicação e serve como "fonte única da verdade". Isso também significa que normalmente você terá apenas uma _store_ para cada aplicação. Uma única árvore de estado facilita a localização de uma parte específica do estado e nos permite capturar facilmente momentos do estado atual da aplicação para fins de depuração.

A árvore única de estado não entra em conflito com a modularidade - em capítulos posteriores, discutiremos como dividir seu estado e mutações em sub-módulos.

Os dados que você armazena no Vuex seguem as mesmas regras que o `data` em uma instância do Vue, ou seja, o objeto de estado deve ser simples. **Veja também:** [Vue#data](https://v3.vuejs.org/api/options-data.html#data-2).

## Obtendo o Estado Vuex nos Componentes Vue

Então, como exibimos o estado dentro do _store_ em nossos componentes Vue? Como os _stores_ Vuex são reativos, a maneira mais simples de "recuperar" o estado dele é simplesmente retornar algum estado do _store_ de dentro de um [dado computado](https://vuejs.org/guide/computed.html):

```js
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

Sempre que o `store.state.count` mudar, fará com que o dado computado seja reavaliado e ative as atualizações de DOM associadas.

No entanto, esse padrão faz com que o componente dependa do _singleton_ do _store_ global. Ao usar um sistema de módulo, ele precisa importar o _store_ em todos os componentes que usam o estado do _store_ e também requer dados fictícios (ou _mocking_) ao testar o componente.

O Vuex "injeta" o _store_ em todos os componentes filhos do componente raiz através do sistema de _plugins_ do Vue e estará disponível neles como `this.$store`. Vamos atualizar nossa implementação do `Counter`:

```js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

## O Método Auxiliar `mapState`

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/c8Pz7BSK" target="_blank" rel="noopener noreferrer">Tente esta lição no Scrimba</a></div>

Quando um componente precisa usar várias propriedades ou _getters_ de estado do _store_, declarar todas esses dados computados pode ser repetitivo e verboso. Para lidar com isso, podemos fazer uso do método auxiliar `mapState` que gera funções _getter_ computadas para nós, economizando algumas linhas de código:

```js
// em builds completos, os métodos auxiliares são expostos como Vuex.mapState
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

Também podemos passar um _Array_ de _Strings_ para `mapState` quando o nome de um dado computado mapeado é o mesmo que um nome de árvore secundária do estado.

```js
computed: mapState([
  // mapeia this.count para store.state.count
  'count'
])
```

## Objeto Spread Operator

Observe que `mapState` retorna um objeto. Como usá-lo em combinação com outros dados computados locais? Normalmente, teríamos que usar um utilitário para fundir vários objetos em um para que possamos passar o objeto final para `computed`. No entanto, com o [objeto spread operator](https://github.com/tc39/proposal-object-rest-spread), podemos simplificar muito a sintaxe:

```js
computed: {
  localComputed () { /* ... */ },
  // mistura isso no objeto externo com o objeto spread operator
  ...mapState({
    // ...
  })
}
```

## Componentes Ainda Podem Ter Um Estado Local

Usar Vuex não significa que você deve colocar **todo** o estado no Vuex. Embora colocar mais estado no Vuex torna suas mutações de estado mais explícitas e depuráveis, às vezes também pode tornar o código mais verboso e indireto. Se uma parte do estado pertencer estritamente a um único componente, não haverá problema em deixá-lo apenas como um estado local. Você deve pesar os prós e contras e tomar decisões que atendam às necessidades de desenvolvimento da sua aplicação.
