# Manipula��o de formul�rios

Ao usar o Vuex no modo estrito, pode ser um pouco complicado usar `v-model` em um peda�o de estado que pertence ao Vuex:
``` html
<input v-model="obj.message">
```

Assumindo que `obj` � uma propriedade computada que retorna um objeto da loja, o` v-model` aqui tentar� mutar diretamente `obj.message` quando o usu�rio digitar a entrada. No modo estrito, isso resultar� em um erro porque a muta��o n�o � realizada dentro de um manipulador de muta��o Vuex expl�cito.
O "modo Vuex" para lidar com isso � vinculando o valor `<input>` s e chamar uma a��o no evento `input` ou` change`:
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

E aqui est� o manipulador de muta��o:

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### Propriedade computada de duas vias

� certo que o foi visto acima � um pouco mais detalhado do que `v-model` + estado local, e tamb�m perdemos alguns dos recursos �teis do` v-model`. Uma abordagem alternativa � usar uma propriedade computacional bidirecional com um setter:
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

