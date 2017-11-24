# Manipulação de Formulários

Quando estamos usando strict mode no Vuex, pode ser um pouco complicado usar `v-model` em um pedaço do estado que pertence ao Vuex:


``` html
<input v-model="obj.message">
```

Assumindo que `obj` é uma propriedade computada que retorna um Object da store, o `v-model` vai tentar mutar diretamente `obj.message` quando o usuário digitar no input. No strict mode, isso vai resultar em um erro por que a mutação não é performada dentro de um handler de mutação explícito.

O "jeito Vuex"  de lidar com isso é amarrar o valor do `<input>` e chamar uma ação no evento `input` ou `change`:


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

O handler da mutação:

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### Propriedade Computada de Duas Vias

Admitimos que a forma acima é um pouco mais verbosa que `v-model` + estado local, e perdemos alguns dos melhores recursos do `v-model`. Uma alternativa é usar uma propriedade computada de duas vias com um setter:


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

