# O que é Vuex?

::: tip NOTE
Esta documentação é para o Vuex 3, que funciona com Vue 2. Se você está procurando a documentação para o Vuex 4, que funciona com Vue 3, [por favor, confira aqui](https://next.vuex.vuejs.org/ptbr/).
:::

<VideoPreview />

O Vuex é um **padrão de gerenciamento de estado + biblioteca** para aplicações Vue.js. Ele serve como um _store_ centralizado para todos os componentes em uma aplicação, com regras garantindo que o estado só possa ser mutado de forma previsível. Ele também se integra com a extensão oficial [Vue devtools](https://github.com/vuejs/vue-devtools) para fornecer recursos avançados sem configurações adicionais, como depuração viajando pelo histórico de estado (_time travel_) e exportação/importação de registros de estado em determinado momento.

### O que é um "Padrão de Gerenciamento do Estado"?

Vamos começar com uma aplicação simples de contador Vue:

``` js
new Vue({
  // state
  data () {
    return {
      count: 0
    }
  },
  // view
  template: `
    <div>{{ count }}</div>
  `,
  // actions
  methods: {
    increment () {
      this.count++
    }
  }
})
```

É uma aplicação independente com as seguintes partes:

- O **estado** (_state_), que é a fonte da verdade que direciona nossa aplicação;
- A **_view_**, que é apenas um mapeamento declarativo do **estado**;
- As **ações** (_actions_), que são as possíveis maneiras pelas quais o estado pode mudar em reação às interações dos usuários da **_view_**.

Esta é uma representação extremamente simples do conceito de "fluxo de dados unidirecional" (_one-way_):

<p style="text-align: center; margin: 2em">
  <img style="width:100%;max-width:450px;" src="/flow.png">
</p>

No entanto, a simplicidade é quebrada rapidamente quando temos **vários componentes que compartilham um estado comum**:

- Múltiplas _views_ podem depender do mesmo pedaço de estado.
- Ações de diferentes _views_ podem precisar mudar o mesmo pedaço de estado.

Para o problema um, passar propriedades pode ser entediante para componentes profundamente aninhados e simplesmente não funcionam para componentes irmãos. Para o problema dois, frequentemente nos encontramos recorrendo a soluções como alcançar referências diretas da instância pai/filho ou tentar alterar e sincronizar várias cópias do estado por meio de eventos. Ambos os padrões são frágeis e levam rapidamente a um código não-sustentável.

Então, por que não extraímos o estado compartilhado dos componentes, e o gerenciamos em um _singleton_ global? Com isso, nossa árvore de componentes se torna uma grande "_view_", e qualquer componente pode acessar o estado ou acionar ações, não importando onde elas estejam na árvore!

Além disso, definindo e separando os conceitos envolvidos no gerenciamento do estado e aplicando certas regras, também damos ao nosso código mais estrutura e sustentabilidade.

Esta é a ideia básica por trás do Vuex, inspirada por [Flux](https://facebook.github.io/flux/docs/overview), [Redux](http://redux.js.org/) e [The Elm Architecture](https://guide.elm-lang.org/architecture/). Ao contrário dos outros padrões, o Vuex também é uma implementação de biblioteca adaptada especificamente para o Vue.js tirar proveito de seu sistema de reatividade granular para atualizações eficientes.

Se você quiser aprender Vuex de um modo interativo, você pode conferir esse curso de [Vuex no Scrimba.](https://scrimba.com/g/gvuex)

![vuex](/vuex.png)

### Quando usar o Vuex?

Embora o Vuex nos ajude a lidar com o gerenciamento de estado compartilhado, ele também vem com o custo de mais conceitos e códigos repetitivos. É uma escolha de prós e contras entre produtividade de curto e longo prazo

Se você nunca construiu um SPA em grande escala e for direto para o Vuex, ele pode parecer detalhado e desanimador. Isso é perfeitamente normal - se a sua aplicação é simples, você provavelmente ficará bem sem o Vuex. Um simples [store pattern](https://br.vuejs.org/v2/guide/state-management.html#Gerenciamento-de-Estado-do-Zero) pode ser tudo que você precisa. Mas, se você está criando um SPA de médio a grande porte, é provável que tenha encontrado situações que fazem você pensar em como lidar melhor com o estado fora de seus componentes do Vue, e o Vuex será o próximo passo natural para você. Há uma boa citação de Dan Abramov, o autor do Redux:

> As bibliotecas _Flux_ são como óculos: você saberá quando precisar delas.
