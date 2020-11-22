# Manipulação de Formulários

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cqKRgEC9" target="_blank" rel="noopener noreferrer">Tente esta lição no Scrimba</a></div>

Ao usar o Vuex no modo estrito, pode ser um pouco complicado usar `v-model` em um pedaço do estado que pertence ao Vuex:

``` html
<input v-model="obj.message">
```

Assumindo que `obj` é um dado computado que retorna um Objeto do _store_, o `v-model` aqui tentará alterar diretamente o `obj.message` quando o usuário digitar alguma coisa. No modo estrito, isso resultará em um erro porque a mutação não é executada dentro de uma função explícita manipuladora de mutação do Vuex.


O "modo Vuex" de lidar com isso é vinculando o valor do(s) `<input>`'s e chamar uma ação no evento _input_ ou _change_:

``` html
<input :value="message" @input="updateMessage">
```

``` js
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```

E aqui está a função manipuladora de mutação:

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

## Dados Computados Bidirecionais (Two-way)

É certo que o código acima é um pouco mais verboso do que o `v-model` + estado local, e também perdemos alguns dos recursos úteis do `v-model`. Uma abordagem alternativa é usar um dado computado bidirecional com um _setter_:

``` html
<input v-model="message">
```

``` js
// ...
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```
