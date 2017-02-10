# Modo estricto

Para habilitar el modo estricto, simplemente pasa la propiedad `strict: true` cuando creas el _store_ de Vuex:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

En el modo estructo, cada vez que el estado de Vuex sea modificado fuera de funciones controladoras de mutaciones, se lanzará un error. Esto asegura que todas las mutaciones de estado sean explícitamente registradas por las herramientas de depuración.

### Desarrollo vs. Producción

**¡No habilites el modo estricto cuando en producción!** El modo estricto realiza verificaciones profundas al árbol de estado para detectar mutaciones inapropiadas - asegúrate de desactivarlo en producción para evitar un peor rendimiento.

Similar a los plugins, podemos dejar que las herramientas de empaquetamiento se encarguen de esto:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
