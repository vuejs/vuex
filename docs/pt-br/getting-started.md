# Come�ando

No centro de cada aplica��o Vuex existe a ** loja **. Uma "loja" � basicamente um recipiente que cont�m a sua aplica��o ** state **. H� duas coisas que tornam uma loja Vuex diferente de um objeto global simples:

1. As lojas Vuex s�o reativas. Quando os componentes do Vue obt�m o estado dele, eles atualizar�o de forma reativa e eficiente se o estado da loja mudar.

2. Voc� n�o pode mutar diretamente o estado da loja. A �nica maneira de mudar o estado de uma loja � explicitamente ** comitar muta��es **. Isso garante que cada mudan�a de estado deixe um registro rastre�vel e permite ferramentas que nos ajudem a entender melhor nossas aplica��es.

### A loja mais simples

> **NOTA:** Vamos usar a sintaxe ES2015 para exemplos de c�digo para o resto dos documentos. Se voc� n�o o pegou, [voc� deveria]
(https://babeljs.io/docs/learn-es2015/)!

Ap�s [instalar](installation.md) Vuex, vamos criar uma loja. � bastante direto - apenas forne�a um objeto de estado inicial e algumas muta��es:

``` js
// Certifique-se de chamar Vue.use (Vuex) primeiro se estiver usando um sistema de m�dulo
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

Agora, voc� pode acessar o objeto de estado como `store.state` e acionar uma mudan�a de estado com o m�todo` store.commit`:

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

Novamente, a raz�o pela qual estamos comitando uma muta��o em vez de mudar `store.state.count 'diretamente, � porque queremos rastre�-la explicitamente. Esta conven��o simples torna sua inten��o mais expl�cita, de modo que voc� possa argumentar sobre as mudan�as de estado em seu aplicativo melhor ao ler o c�digo. Al�m disso, isso nos d� a oportunidade de implementar ferramentas que podem registrar cada muta��o, tirar instant�neos de estado ou mesmo realizar depura��o de viagem no tempo.
Usar o estado da loja em um componente simplesmente envolve o retorno do estado dentro de uma propriedade computada, porque o estado da loja � reativo. Acionar as mudan�as simplesmente significa comprometer muta��es nos m�todos componentes.

Aqui est� um exemplo do [aplicativo de contador do Vuex mais b�sico](https://jsfiddle.net/n9jmu5v7/1269/).

Em seguida, discutiremos cada conceito chave em mais detalhes, come�ando com [Estado](state.md).

