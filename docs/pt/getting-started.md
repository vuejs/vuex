# Getting Started

No centro de cada aplicação Vuex existe um "armazém", que você verá nos exemplos como **store**. Um "armazem" é basicamente um container que armazena o **estado** da sua aplicação. Existem duas coisas que fazem esse armazem do Vuex ser diferente de um objeto global simples:

1. Os "armazéns" do Vuex são reativas. Quando os componentes Vue recuperam o estado a partir dele, eles irão funcionar reativamente e realizarão uma atualização eficientemente se o estado for modificado no armazém.

2. Você não pode modificar o estado do armazém diretamente. A única forma de alterar o estado é disparando **mutações** explicitamente. Isso faz com que cada mudança no estado seja fácil de ser gravada, e possibilita o uso de ferramentas que nos ajude a compreender melhor nossas aplicações.

### O armazém mais simples

> **NOTA:** Nós utilizaremos a sintaxe do ES2015 para exemplos de código em toda a documentação. Se você ainda não aprendeu a utilizá-lo, [você deveria](https://babeljs.io/docs/learn-es2015/)! Essa documentação também assume que você está familiarizado com os conceitos discutidos em [Construindo Aplicações de Larga Escala com Vue.js](http://vuejs.org/guide/application.html).

Criar um armazem Vuex é bem simples. Você apenas precisa informar um objeto que é seu estado inicial, e alguma mutação:

``` js
import Vuex from 'vuex'

const state = {
  count: 0
}

const mutations = {
  INCREMENT (state) {
    state.count++
  }
}

export default new Vuex.Store({
  state,
  mutations
})
```

Agora, você pode acessar o objeto que contém o estado como `store.state`, e disparar uma mutação utilizando o método <i>dispatch</i> e o nome da aplicação:

``` js
store.dispatch('INCREMENT')

console.log(store.state.count) // -> 1
```

Se você preferir utilizar o formato de objeto para os parâmetros, você pode utilizar o exemplo a seguir:

``` js
// O mesmo efeito que o exemplo anterior
store.dispatch({
  type: 'INCREMENT'
})
```

Novamente, a razão para nós dispararmos uma mutação ao invés de modificar diretamente o valor de `store.state.count` é porque queremos explicitamente rastrear a modificação. Essa simples convenção faz com que suas intenções fiquem mais explícitas, e assim você pode compreender as modificações do estado mais facilmente quando ler seu código. Além disso, isso nos dá a oportunidade de implementar ferramentas que podem realizar um log para todas as mutações, tirar <i>snapshots</i> do estado e até mesmo utilizar <i>time travel debugging</i>.

Agora esse é apenas uma simples exemplo do que é um armazém Vuex. Mas o Vuex é bem mais do que isso. A seguir, iremos discutir alguns dos conceitos principais mais a fundo: [Estado](state.md), [Mutações](mutations.md) e [Ações](actions.md).
