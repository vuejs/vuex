# Começando

No centro de toda e qualquer aplicação Vuex há o __armazém__, ou **store**, como vamos chamar a partir daqui. Uma "store" é basicamente um container que armazena o **estado** da sua aplicação. Há duas coisas que fazem o store do Vuex diferente de um objeto global simples. 

1. As stores do Vuex são reativas. Quando componentes do Vue recebem o estado delas, elas vão reativamente e eficientemente ser atualizados se o estado da store mudar.

2. Você não pode mudar diretamente o estado da store. A única forma de mudar o estado da store é  **cometendo mutações**, ou **__mutations__**, como vamos nos referir no código. Isso asegura que todas as mudanças de estados deixam um registro rastéável, e permite o uso de ferramentas que nos ajudam a entender melhor nossas aplicações.

### A Store Mais Simples Possível

> **NOTA:** Vvamos usar a sintaxe ES2015 para os códigos de exemplo pelo resto desta documentação. Se você não aprendeu ainda, [deveria](https://babeljs.io/docs/learn-es2015/)!

Depois de [instalar](installation.md) Vuex, vamos criar a store. É simples e rápido - vamos escrever um estado inicial e algumas mutações.

``` js
// Assegure-se de usar Vue.use(Vuex) primeiro se estiver usando um sistema de módulos

const store = new Vuex.Store({
  state: { // state é nosso estado
    count: 0
  },
  mutations: { // nossas mutações
    increment (state) {
      state.count++
    }
  }
})
```
Agora você pode acessar o estado do objeto usando `store.state`, e disparar uma alteração de estado com o  método `store.commit`:

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

Repetindo, a razão pela qual estamos cometendo uma mutação ao invés de alterar o `store.state.count` diretamente é que assim podemos rastreá-las explicitamente. Essa convenção simples torna sua intenção mais explícita, assim você pode pensar melhor sobre as mudanças de estado na sua aplicação enquanto lê seu código. Além idsso, nos dá a oportunidade de implementar ferramentas que podem fazer log de cada mutação, gravar momentos do estado, ou até fazer debug do tipo time-travel.

Para usar o estado de uma store num componente, basta simplesmente retornar o estado nma propriedade computada, pois o estado da store é reativo. Disparar mudanças é simplesmente cometer mutações por meio dos métodos dos componentes.



Um exemplo da [aplicação mais básica de contador em Vuex](https://jsfiddle.net/n9jmu5v7/1269/).

A seguir, vamos discutir cada conceito fundamental em detalhes mais finos, começando pelo [Estado](state.md).
