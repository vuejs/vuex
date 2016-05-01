# Flujo de datos

Construyamos una app contador simple con Vuex para obtener una mejor comprensión del flujo de datos dentro de aplicaciones Vuex. Ten en cuenta que este es un ejemplo trivial con el único fin de explicar los conceptos - en la práctica no necesitas Vuex para tareas tan sencillas.

### El almacén

``` js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// estado inicial del app
const state = {
  count: 0
}

// define posibles mutaciones
const mutations = {
  INCREMENT (state) {
    state.count++
  },
  DECREMENT (state) {
    state.count--
  }
}

// crea el almacén
export default new Vuex.Store({
  state,
  mutations
})
```

### Acciones

``` js
// actions.js
export const increment = ({ dispatch }) => dispatch('INCREMENT')
export const decrement = ({ dispatch }) => dispatch('DECREMENT')
```

### Usalo con Vue

**Plantilla**

``` html
<div id="app">
  Tocado: {{ count }} veces
  <button v-on:click="increment">+</button>
  <button v-on:click="decrement">-</button>
</div>
```

**Script**

``` js
// Estamos importando e inyectando el almacén aquí porque
// esta es la raíz. En aplicaciones más grandes esto lo haces sólo una vez.
import store from './store'
import { increment, decrement } from './actions'

const app = new Vue({
  el: '#app',
  store,
  vuex: {
    getters: {
      count: state => state.count
    },
    actions: {
      increment,
      decrement
    }
  }
})
```

Aquí te darás cuenta que el componente en sí es muy sencillo: simplemente muestra un estado del almacén Vuex (ni siquiera tiene datos propios), y llama a algunas acciones de almacén basado en eventos de entrada de usuario.

También te darás cuenta que el flujo de datos es unidireccional, como debería ser en Flux:

1. Entrada de usuario en el componente desencadena llamadas de acción;
2. Acciones despachan mutaciones que cambian el estado;
3. Cambios en el flujo de estado desde el almacén de vuelta al componente mediante obtenedores.

<p align="center">
  <img width="700px" src="vuex.png">
</p>
