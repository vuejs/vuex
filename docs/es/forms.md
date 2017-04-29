# Gestión de Formularios

Cuando se usa Vuex en modo strict puede resultar complicado el uso de `v-model` sobre una parte del estado que pertenezca a Vuex:

``` html
<input v-model="obj.message">
```

Asuminedo que `obj` es una propiedad computada que devuelve un Objeto desde el almacén, el `v-model` intentará mutar directamente `obj.message` cuando el usuario escriba en el input. En modo strict, esto lanzará un error ya que la mutación no está siendo ejecutada dentro de un handler explicito definido para Vuex.

La "manera Vuex" de tratar este caso es bindeando el valor del `<input>` y ejecutando una acción ante el evento `input` ó `change`:

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

Y este sería el handler de la mutación:

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### Propiedad Computada de Doble Vía 

El ejemplo anterior resulta más verboso que el uso de `v-model` + estado local. Además, en el proceso perdemos parte de las utilidades de `v-model`. Una alternativa es usar propiedades computadas de doble vía, definiendo en ellas getters y setters:

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
