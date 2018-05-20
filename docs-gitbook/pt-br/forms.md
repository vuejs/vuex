# Manipulação de formulários

Ao usar o Vuex no modo estrito, pode ser um pouco complicado usar `v-model` em um pedaço de estado que pertence ao Vuex:
``` html
<input v-model="obj.message">
```

Assumindo que `obj` é um dado computado que retorna um objeto do _store_, o `v-model` aqui tentará mutar diretamente `obj.message` quando o usuário digitar a entrada. No modo estrito, isso resultará em um erro porque a mutação não é realizada dentro de um manipulador de mutação Vuex explícito.
O "modo Vuex" para lidar com isso é vinculando o valor do(s) `<input>`'s e chamar uma ação no evento `input` ou `change`:
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

E aqui está o manipulador de mutação:

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### Dados computados bidirecionais (Two-way)

É certo que o acima é um pouco mais detalhado do que o `v-model` + estado local, e também perdemos alguns dos recursos úteis do `v-model`. Uma abordagem alternativa está usando um dado computado bidirecional com um setter:
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
