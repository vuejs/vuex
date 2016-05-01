# Manejo de formularios

Al utilizar Vuex en modo estricto, podría ser un poco difícil usar `v-model` en una parte de estado que pertenece a Vuex:

``` html
<input v-model="obj.message">
```

Asumiendo `obj` es una propiedad computarizada que devuelve un Objeto del almacén, aquí el `v-model` intentará mutar directamente `obj.message` cuando el usuario escriba en la entrada de texto. En modo estricto, esto dará lugar a un error debido a que la mutación no se lleva a cabo dentro de un controlador de mutación Vuex explícito.

La "manera de Vuex" es registrar el valor de `<input>` y llamar a una acción en el evento `input` o `change`:

``` html
<input :value="message" @input="updateMessage">
```
``` js
// ...
vuex: {
  getters: {
    message: state => state.obj.message
  },
  actions: {
    updateMessage: ({ dispatch }, e) => {
      dispatch('UPDATE_MESSAGE', e.target.value)
    }
  }
}
```

Y aquí está el controlador de mutación:

``` js
// ...
mutations: {
  UPDATE_MESSAGE (state, message) {
    state.obj.message = message
  }
}
```

Es cierto que esto es un poco más verboso que un simple `v-model`, pero tal es el coste de hacer los cambios de estado explícitos y registrables. Al mismo tiempo, ten en cuenta que Vuex no exige poner todo el estado dentro de un almacén Vuex - si no deseas realizar un seguimiento de las mutaciones por las interacciones de formulario en absoluto, sólo tienes que mantener el estado del formulario fuera de Vuex como estado local del componente, lo que te permite aprovechar libremente `v-model`.
