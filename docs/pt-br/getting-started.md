# Começando

No centro de cada aplicação Vuex existe a **_store_**. Uma "_store_ " é basicamente um recipiente que contém a sua aplicação **state**. Há duas coisas que tornam uma _store_  Vuex diferente de um objeto global simples:

1. As _stores_  Vuex são reativas. Quando os componentes do Vue obtêm o estado dele, eles atualizarão de forma reativa e eficiente se o estado da _store_  mudar.

2. Você não pode mutar diretamente o estado da _store_. A única maneira de mudar o estado de uma _store_  é explicitamente **fazer commit de mutações**. Isso garante que cada mudança de estado deixe um registro rastreável e permite ferramentas que nos ajudem a entender melhor nossas aplicações.

### Uma store bem simples

> **NOTA:** Vamos usar a sintaxe ES2015 para exemplos de código para o resto dos documentos. Se você não o pegou, [você deveria](https://babeljs.io/docs/learn-es2015/)!

Após [instalar](installation.md) Vuex, vamos criar uma _store_. É bem simples - apenas forneça um objeto de estado inicial e algumas mutações:

``` js
// Certifique-se de chamar Vue.use(Vuex) primeiro se estiver usando o sistema de módulos
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
Usar o estado da _store_  em um componente simplesmente envolve o retorno do estado dentro de uma propriedade computada, porque o estado da _store_  é reativo. Acionar as mudanças simplesmente significa comprometer mutações nos métodos componentes.

Aqui está um exemplo do [aplicativo de contador do Vuex mais básico](https://jsfiddle.net/n9jmu5v7/1269/).

Em seguida, discutiremos cada conceito chave em mais detalhes, começando com [Estado](state.md).
