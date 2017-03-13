# Plugins

Los almacenes Vuex aceptan la opción `plugins` que expone hooks para cada mutación. Un plugin Vuex es una simple función que recibe el almacén como su único argumento:

``` js
const myPlugin = store => {
  // Invocado cuando el almacén es inicializado
  store.subscribe((mutation, state) => {
    // Invocado después de cada mutación.
    // La mutación llega con formato { type, payload }.
  })
}
```

Y puede ser utilizado de la siguiente manera:

``` js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

### Commitear Mutaciones desde un Plugin

Los plugins no puede modificar directamente el estado, de manera similar a los componentes. Deben commitear mutaciones para ello.

Por medio de commitear mutaciones, un plugin puede utilizarse para sincronizar datos de una fuente con el almacén. Por ejemplo, para sincronizar datos recibidos via WebSocket (este caso es muy sencillo. En casos reales la función `createPlugin` puede recibir opciones adicionales para realizar tareas más complejas):

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

### Hacer Snapshots del Estado

En ocasiones un plugin puede querer recibir "snapshots" del estado y comparar los estados post y pre-mutación. Para conseguir esto, tendrás que crear una copia profunda del Objeto Estado:

``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // Comprar estados...

    // Guardar estado para la siguiente mutación
    prevState = nextState
  })
}
```

**Los plugins que hacen snapshots del estado deberían usarse únicamente durante desarrollo.** Si usamos Webpack o Browserify podemos dejar que las herramientas de build se encarguen de esto por nosotros:

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

El plugin se utilizará por defecto. En producción necesitarás un [DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) para Webpack ó [envify](https://github.com/hughsk/envify) para Browserify para convertir el valor de `process.env.NODE_ENV !== 'production'` en `false` para el build final.

### Plugin Logger Incluido

> Si estás usando las herramientas de desarrollo [vue-devtools](https://github.com/vuejs/vue-devtools) probablemente no necesites esto.

Vuex tiene incluido un plugin de logs para situaciones comunes de depuración:

``` js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

La función `createLogger` acepta algunas opciones:

``` js
const logger = createLogger({
  collapsed: false, // Auto-expande las mutaciones loggeadas
  transformer (state) {
    // Transforma el estado andes de loggearlo.
    // Por ejemplo, devuelve un sub-árbol específico
    return state.subTree
  },
  mutationTransformer (mutation) {
    // Las mutaciones serán loggeadas con el formato { type, payload }.
    // Podemos formatearlo como queramos.
    return mutation.type
  }
})
```

El archivo del logger puede ser incluido directamente via `<script>` y expondrá la función `createVuexLogger` de forma global.

Hacer notar que el plugin logger hace snapshots del estado. Úsalo solo en desarrollo.
