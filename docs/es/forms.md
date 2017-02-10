# Manejo de formularios

Cuando utilices Vuex en modo estricto, puede ser un poco complicado utilizar `v-model` en una porción del estado dentro del _store_:

``` html
<input v-model="obj.message">
```

Asumiendo que `obj` es una propiedad computada que devuelve un objeto del _store_, aquí `v-model` intentará modificar directamente `obj.message` cuando el usuario escriba en el campo de texto. En modo estricto, esto generará un error porque la modificación no es realizada dentro de una mutación de Vuex.

La "manera Vuex" de lidiar con esto es enlazar el valor de `<input>` y disparar una acción cuando haya un evento `input` o `change`:

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

Y aquí está la función controladora de la mutación:

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### Propiedades computadas de dos vías

Es cierto que lo anterior es bastante más complejo que utilizar `v-model` + una propiedad en el estado local, y perdemos algunas de las características útiles de `v-model` también. Un enfoque alternativo es utilizar una propiedad computada de dos vías con un _setter_:

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

