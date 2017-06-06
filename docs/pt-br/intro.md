# O que é Vuex?

Vuex é um **padrão + biblioteca de gerenciamento de estados**  para aplicações em Vue.js. Serve como um armázem centralizado para todos os componentes de uma aplicação, com regras que asseguram que o estado pode ser alterado apenas de uma forma previsível. Também se integra com a [devtools extension](https://github.com/vuejs/vue-devtools) oficial do Vue para fornecer recursos avançados, como debug do tipo time-travel com zero configuraçõesnecessárias e exportação/importação de estados.

### O que é um "Padrão de Gerenciamento de Estado"?

Vamos começar com essa simples aplicação em Vue para um contador:

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


- O **estado**, que é a fonte da verdade que guia nossa aplicação;
- A **view**, que é apenas um mapeamento declarativo do  **estado**;
- As **ações**, que são as formas possíveis que o estado poderia mudar em reação às entradas do usuário pela  **view**.

Essa é uma representação extremamente simples do conceito de  "fluxo de dados de uma via":

<p style="text-align: center; margin: 2em">
  <img style="width:100%;max-width:450px;" src="./images/flow.png">
</p>

Entretanto, a simplicidade cai rapidamente por agua abaixo quando nós temos **múltiplos componentes que compartilham do mesmo estado**.

- Múltiplas views podem depender da mesma parte do estado.
- Ações de views diferentes podem precisar alterar a mesma parte do estado.

Para o primeiro problema, passar props pode ser um processo entediante se você for lidar com componentes profundamente aninhados, e não funciona quando se trata de componentes irmãos. Para o problema dois, geralmente nos encontramos recorrendo a soluções como alcançar referências diretas de pai/filhos ou tentar alterar e sincronizar mĺtiplas copias do estado via eventos. Ambos os métodos são fŕageis e rapidamente tornam o código impossível de se manter. 

Então por que não extraímos o estado compartilhado dos componentes e o gerenciamos em um singleton global? Com isso, nossa árvore de componentes se torna uma "view" gigante, e qualquer componente pode acessar o estado ou disparar ações, independente de onde eles estiverem na árvore!

Além disso, ao definir e separar os conceitos envolvidos no gerenciamento de estados e forçando certas regras, também damos mias estrutura e facilidade de manutenção ao nosso código.

Essa é a idéia básica por trás do Vuex, inspirado pelo [Flux](https://facebook.github.io/flux/docs/overview.html), [Redux](http://redux.js.org/) e [A Arquitetura Elm](https://guide.elm-lang.org/architecture/). Diferente de outros padrões, Vuex também é uma biblioteca já implementada, adaptada especificamente para o Vue.js tirar vantagem do seu sistema de reatividade granular para atualizações eficientes. 

![vuex](./images/vuex.png)

### Quando devo usar?

Embora Vuex nos ajude a lidar com gerenciamento de estado compartilhado, também vem com o custo de mais conceitos e boilerplates. É uma situação onde se troca a produtividade a curto prazo pela de longo prazo.

Se você nunca construiu uma SPA de larga escala e já se enfiou de cabeça no Vuex, você pode achar verboso e assustador. É perfeitamente normal - se sua aplicação é simples, você provavelmente não precisa de Vuex. Um [ônibus de eventos globais](http://vuejs.org/v2/guide/components.html#Non-Parent-Child-Communication) pode ser tudo que você precisa. Mas se você está construindo um SPA de média a larga escala, possivelmente você vai esbarrar com situações que te farão pensar na melhor forma de lidar com o estado por fora dos seus componentes, e Vuex será naturalmente o próximo passo para você. Dan Abramov, o autor do Redux, possui uma ótima citação:


> Bibliotecas Flux são como óculos: você vai saber quando precisar.
