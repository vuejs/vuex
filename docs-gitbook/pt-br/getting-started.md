# Começando

No centro de cada aplicação Vuex existe o **_store_**. Um "_store_" é basicamente um recipiente que contém a sua aplicação **state**. Há duas coisas que tornam um _store_ Vuex diferente de um objeto global simples:

1. Os _stores_ Vuex são reativos. Quando os componentes do Vue obtêm o estado dele, eles atualizarão de forma reativa e eficiente se o estado do _store_ mudar.

2. Você não pode mutar diretamente o estado do _store_. A única maneira de mudar o estado de um _store_ é explicitamente **fazer _commit_ de mutações**. Isso garante que cada mudança de estado deixe um registro rastreável e permite ferramentas que nos ajudem a entender melhor nossas aplicações.

### Armazenamento de Estado Simples

> **NOTA:** Vamos usar a sintaxe ES2015 para exemplos de código para o resto dos documentos. Se você ainda não aprendeu como usá-la, [veja aqui](https://babeljs.io/docs/learn-es2015/)!

Após [instalar](installation.md) Vuex, vamos criar um _store_. É bem simples - apenas forneça um objeto de estado inicial e algumas mutações:

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

Agora, você pode acessar o objeto de estado como `store.state` e acionar uma mudança de estado com o método `store.commit`:

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

Novamente, a razão pela qual estamos fazendo _commit_ de uma mutação em vez de mudar `store.state.count` diretamente, é porque queremos rastreá-la explicitamente. Esta convenção simples torna sua intenção mais explícita, de modo que você possa ter melhores argumentos sobre as mudanças de estado em seu aplicativo ao ler o código. Além disso, isso nos dá a oportunidade de implementar ferramentas que podem registrar cada mutação, tirar _snapshots_ de estado ou mesmo realizar depuração viajando pelo histórico de estado (_time travel_).

Usar o estado do _store_ em um componente simplesmente envolve o retorno do estado dentro de um dado computado, porque o estado do _store_ é reativo. Fazer alterações simplesmente significa fazer _commit_ de mutações nos métodos dos componentes.

Aqui está um exemplo do [aplicativo de contador do Vuex mais básico](https://jsfiddle.net/ywpudorb/).

Em seguida, discutiremos cada conceito chave em mais detalhes, começando com [Estado](state.md).
