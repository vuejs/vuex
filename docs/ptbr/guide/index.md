# Começando

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cMPa2Uk" target="_blank" rel="noopener noreferrer">Tente esta lição no Scrimba</a></div>

No centro de cada aplicação Vuex existe o **_store_**. Um "_store_" é basicamente um contêiner que mantém o **estado** da sua aplicação. Há duas coisas que tornam um _store_ Vuex diferente de um objeto global simples:

1. Os _stores_ Vuex são reativos. Quando os componentes do Vue obtêm o estado dele, eles atualizarão de forma reativa e eficiente se o estado do _store_ mudar.

2. Você não pode alterar diretamente os estados do _store_. A única maneira de mudar o estado de um _store_ é explicitamente **confirmando (ou fazendo _commit_ de) mutações**. Isso garante que cada mudança de estado deixe um registro rastreável, e permite ferramentas que nos ajudem a entender melhor nossas aplicações.

## Um Store Bem Simples

:::tip NOTE
Vamos usar a sintaxe ES2015 para exemplos de código para o resto da documentação. Se você ainda não aprendeu como usá-la, [veja aqui](https://babeljs.io/docs/learn-es2015/)!
:::

Após [instalar](../installation.md)  o Vuex, vamos criar um _store_. É bem simples - basta fornecer um objeto de estado inicial, e algumas mutações:

```js
import { createApp } from 'vue'
import { createStore } from 'vuex'

// Cria uma nova instância do store.
const store = createStore({
  state () {
    return {
      count: 1
    }
  }
})

const app = createApp({ /* seu componente raiz */ })

// Instale a instância do store como um plugin
app.use(store)
```

Agora, você pode acessar o objeto de estado como `store.state` e acionar uma mudança de estado com o método `store.commit`:

```js
store.commit('increment')

console.log(store.state.count) // -> 1
```

Em um componente Vue, você pode acessar o _store_ como `this.$store`. Agora podemos confirmar (ou fazer _commit_ de) uma mutação usando um método de componente:

```js
methods: {
  increment() {
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
```

Novamente, a razão pela qual estamos confirmando (ou fazendo _commit_ de) uma mutação em vez de mudar `store.state.count` diretamente, é porque queremos rastreá-la explicitamente. Esta convenção simples torna sua intenção mais explícita, para que você possa raciocinar melhor sobre as mudanças de estado em sua aplicação ao ler o código. Além disso, isso nos dá a oportunidade de implementar ferramentas que podem registrar cada mutação, capturar momentos do estado ou mesmo realizar depuração viajando pelo histórico de estado (_time travel_).

Usar o estado do _store_ em um componente simplesmente envolve o retorno do estado dentro de um dado computado, porque o estado do _store_ é reativo. Acionar alterações simplesmente significa confirmar (ou fazer _commit_ de) mutações nos métodos dos componentes.

A seguir, discutiremos cada conceito básico em detalhes muito mais sutis, começando com [Estado](state.md).
