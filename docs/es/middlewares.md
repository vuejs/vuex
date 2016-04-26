# Middlewares

Almacenes Vuex aceptan la opción `middlewares` que expone ganchos para cada mutación (Ten en cuenta que esto no tiene ninguna relación con Redux middlewares). Vuex middleware es simplemente un objeto que implementa algunas funciones de gancho:

``` js
const myMiddleware = {
  onInit (state, store) {
    // registar estado inicial
  },
  onMutation (mutation, state, store) {
    // llamado después de cada mutación.
    // La mutación viene en formato { type, payload }
  }
}
```

Y puede ser utilizado de esta manera:

``` js
const store = new Vuex.Store({
  // ...
  middlewares: [myMiddleware]
})
```

Por defecto, un middleware recibe el objeto `state` real. Un middleware también puede recibir el `store` en sí con el fin de despachar mutaciones. Ya que los middlewares se utilizan principalmente para fines de depuración o la persistencia de datos, a los mismos **no se les permite mutar el estado**.

A veces, un middleware puede querer recibir "instantáneas" del estado, y también comparar el estado post-mutación con el estado pre-mutación. Tal middlewares deben declarar la opción `snapshot: true`:

``` js
const myMiddlewareWithSnapshot = {
  snapshot: true,
  onMutation (mutation, nextState, prevState, store) {
    // nextState y prevState son instantáneas de profunda clonación
    // del estado antes y después de la mutación.
  }
}
```

**Middlewares que toman instantáneas del estado deben utilizarse sólo durante el desarrollo.** Usando Webpack o Browserify, podemos dejar que nuestras herramientas de compilación lo manejen por nosotros:

``` js
const store = new Vuex.Store({
  // ...
  middlewares: process.env.NODE_ENV !== 'production'
    ? [myMiddlewareWithSnapshot]
    : []
})
```

El middleware será utilizado por defecto. Para la producción, utilice la configuración de compilación descrita [aquí](http://vuejs.org/guide/application.html#Deploying-for-Production) para convertir el valor de `process.env.NODE_ENV! == 'Production'` a `false` para la versión final.

### Middleware registrador incorporado

Vuex viene con un middleware registrador para la depuración común:

``` js
import createLogger from 'vuex/logger'

const store = new Vuex.Store({
  middlewares: [createLogger()]
})
```

La función `createLogger` toma algunas opciones:

``` js
const logger = createLogger({
  collapsed: false, // auto expande mutaciones registradas
  transformer (state) {
    // transforma el estado antes de registrarlo.
    // por ejemplo devuelve sólo un sub-árbol específico
    return state.subTree
  },
  mutationTransformer (mutation) {
    // las mutaciones se registran en el formato de { type, payload }
    // podemos formatearlo en el modo que queramos.
    return mutation.type
  }
})
```

Ten en cuenta que el middleware registrador toma instantáneas del estado, así que utilizalo sólo durante el desarrollo.
