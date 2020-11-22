# O que é Vuex?

::: tip NOTE
Esta documentação é para o Vuex 4, que funciona com Vue 3. Se você está procurando a documentação para o Vuex 3, que funciona com Vue 2, [por favor, confira aqui](https://vuex.vuejs.org/ptbr/).
:::

O Vuex é um **padrão de gerenciamento de estado + biblioteca** para aplicações Vue.js. Ele serve como um _store_ centralizado para todos os componentes em uma aplicação, com regras garantindo que o estado só possa ser mutado de forma previsível.

## O que é um "Padrão de Gerenciamento do Estado"?

Vamos começar com uma aplicação simples em Vue, um contador:

```js
const Counter = {
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
}

createApp(Counter).mount('#app')
```

É uma aplicação independente com as seguintes partes:

- O **estado** (_state_), que é a fonte da verdade que direciona nossa aplicação;
- A **_view_**, que é apenas um mapeamento declarativo do **estado**;
- As **ações** (_actions_), que são as possíveis maneiras pelas quais o estado pode mudar em reação às interações dos usuários da **_view_**.

Esta é uma representação simples do conceito de "fluxo de dados unidirecional" (_one-way_):

<p style="text-align: center; margin: 2em">
  <img style="width:100%; max-width:450px;" src="/flow.png">
</p>

No entanto, a simplicidade é rapidamente descartada quando temos **vários componentes que compartilham um estado comum**:

- Múltiplas _views_ que podem depender do mesmo pedaço de estado.
- Ações de diferentes _views_ que podem precisar alterar o mesmo pedaço de estado.

Para o problema um, passar tudo via propriedades (_props_) pode ser entediante para componentes profundamente aninhados e simplesmente não funciona para componentes irmãos. Para o problema dois, muitas vezes nos encontramos recorrendo a soluções como buscar referências diretas de instância pai / filho ou tentar mudar e sincronizar várias cópias do estado por meio de eventos. Ambos os padrões são frágeis e levam rapidamente a códigos impossíveis de manter.

Então, por que não extraímos o estado compartilhado dos componentes, e o gerenciamos em um _singleton_ global? Com isso, nossa árvore de componentes se torna uma grande "_view_", e qualquer componente pode acessar o estado ou acionar ações, não importando onde elas estejam na árvore!

Além disso, ao definir e separar os conceitos envolvidos no gerenciamento do estado e aplicar regras que mantêm a independência entre as _views_ e os estados, damos ao nosso código mais estrutura e capacidade de manutenção.

Esta é a ideia básica por trás do Vuex, inspirado no [Flux](https://facebook.github.io/flux/docs/overview), [Redux](http://redux.js.org/) e [The Elm Architecture](https://guide.elm-lang.org/architecture/). Ao contrário dos outros padrões, o Vuex também é uma implementação da biblioteca adaptada especificamente para o Vue.js aproveitar as vantagens de seu sistema de reatividade granular para atualizações eficientes.

Se você quiser aprender Vuex de uma forma interativa, você pode conferir esse [curso de Vuex no Scrimba](https://scrimba.com/g/gvuex), que oferece uma mistura de _screencast_ e _playground_ de código em que você pode pausar e brincar com o código a qualquer momento.

![vuex](/vuex.png)

## Quando usar o Vuex?

Embora o Vuex nos ajude a lidar com o gerenciamento de estado compartilhado, ele também vem com o custo de mais conceitos e códigos repetitivos. É uma escolha de prós e contras entre produtividade de curto e longo prazo

Se você nunca construiu um SPA em grande escala e for direto para o Vuex, ele pode parecer verboso e desanimador. Isso é perfeitamente normal - se a sua aplicação é simples, você provavelmente ficará bem sem o Vuex. Um simples [store pattern](https://v3.vuejs.org/guide/state-management.html#simple-state-management-from-scratch) pode ser tudo que você precisa. Mas, se você está criando um SPA de médio a grande porte, é provável que tenha encontrado situações que fazem você pensar em como lidar melhor com o estado fora de seus componentes Vue, e o Vuex será naturalmente o próximo passo para você. Há uma boa citação de Dan Abramov, o autor do Redux:

> As bibliotecas Flux são como óculos: você saberá quando precisar delas.
