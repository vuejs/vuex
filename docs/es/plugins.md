# Complementos

Los _store_ de Vuex aceptan la opción que expone _hooks_ para cada mutación. Un complemento de Vuex es simplemente una función que recibe el _store_ como su único parámetro:

``` js
const myPlugin = store => {
  // llamado cuando se inicializa el _store_
  store.subscribe((mutation, state) => {
    // llamado luego de cada mutación
    // la mutación tiene el formato { type, payload }.
  })
}
```

Y puede ser usado de la siguiente forma:

``` js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

### Emitiendo mutaciones dentro de complementos

Los complementos no tienen permitido modificar el estado directamente - de la misma manera que tus componentes, solo pueden disparar cambios emitiendo mutaciones.

Emitiendo mutaciones, un complemento puede ser usado para sincronizar una fuente de datos con el _store_. Por ejemplo, para sincronizar una fuente de datos en un websocket con el _store (este es un ejemplo inventado, en realidad la funcion `createPlugin` puede recibir opciones adicionales para tareas más complejas):

``` js
export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
```

``` js
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})
```

### Tomando instantáneas del estado

En ocasiones un complemento puede querer recibir una "instantánea" del estado y también comparar el estado luego de la mutación con el estado previo a esta. Para lograrlo, necesitas realizar una "copia profunda" del objeto estado:

``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // compara prevState y nextState...

    // guarda el estado para la próxima mutación
    prevState = nextState
  })
}
```

**Los complementos que toman instantáneas del estado deben ser usados solo durante el desarrollo.** Cuando utilices Webpack o Browserify, podemos dejar que ellas se encarguen:

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

El complemento será usado por defecto. En producción, necesitarás [DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) para Webpack o [envify](https://github.com/hughsk/envify) para Browserify para convertir el valor de `process.env.NODE_ENV !== 'production'` a `false` para la versión final.

### Complemento de registro incorporado

> Si estás utilizando [vue-devtools](https://github.com/vuejs/vue-devtools) probablemente no necesites esto.

Vuex incluye un complemento de registro para usos comunes de depuración:

``` js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

La función `createLogger` tiene pocas opciones:

``` js
const logger = createLogger({
  collapsed: false, // auto expandir mutaciones registradoas
  transformer (state) {
    // transforma el estado antes de registrarlo
    // por ejemplo, devuelve solamente un sub-árbol específico
    return state.subTree
  },
  mutationTransformer (mutation) {
    // las mutaciones son registradas con el formato { type, payload }
    // podemos formatearlas de la manera que queramos
    return mutation.type
  }
})
```

El archivo del complemento de registro tambien puede ser incluído directamente a través de una etiqueta `<script>`, y expondrá la función`createVuexLogger` globalmente.

Nota que el complemento de registro toma instantáneas de estado, así que úsalo solo durante el desarrollo.
