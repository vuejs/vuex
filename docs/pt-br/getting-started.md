# Começando

No centro de cada aplicação Vuex existe a ** loja **. Uma "loja" é basicamente um recipiente que contém a sua aplicação ** state **. Há duas coisas que tornam uma loja Vuex diferente de um objeto global simples:

1. As lojas Vuex são reativas. Quando os componentes do Vue obtêm o estado dele, eles atualizarão de forma reativa e eficiente se o estado da loja mudar.

2. Você não pode mutar diretamente o estado da loja. A única maneira de mudar o estado de uma loja é explicitamente ** comitar mutações **. Isso garante que cada mudança de estado deixe um registro rastreável e permite ferramentas que nos ajudem a entender melhor nossas aplicações.

### A loja mais simples

> **NOTA:** Vamos usar a sintaxe ES2015 para exemplos de código para o resto dos documentos. Se você não o pegou, [você deveria]
(https://babeljs.io/docs/learn-es2015/)!

Após [instalar](installation.md) Vuex, vamos criar uma loja. É bastante direto - apenas forneça um objeto de estado inicial e algumas mutações:

``` js
// Certifique-se de chamar Vue.use (Vuex) primeiro se estiver usando um sistema de módulo
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

Agora, você pode acessar o objeto de estado como `store.state` e acionar uma mudança de estado com o método` store.commit`:

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

Novamente, a razão pela qual estamos comitando uma mutação em vez de mudar `store.state.count 'diretamente, é porque queremos rastreá-la explicitamente. Esta convenção simples torna sua intenção mais explícita, de modo que você possa argumentar sobre as mudanças de estado em seu aplicativo melhor ao ler o código. Além disso, isso nos dá a oportunidade de implementar ferramentas que podem registrar cada mutação, tirar instantâneos de estado ou mesmo realizar depuração de viagem no tempo.
Usar o estado da loja em um componente simplesmente envolve o retorno do estado dentro de uma propriedade computada, porque o estado da loja é reativo. Acionar as mudanças simplesmente significa comprometer mutações nos métodos componentes.

Aqui está um exemplo do [aplicativo de contador do Vuex mais básico](https://jsfiddle.net/n9jmu5v7/1269/).

Em seguida, discutiremos cada conceito chave em mais detalhes, começando com [Estado](state.md).

