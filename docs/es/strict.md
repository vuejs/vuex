# Modo Strict

Habilitar el modo estricto (strict) es muy sencillo. Sencillamente pasa la propiedad `strict: true` en el momento de creación de almacén Vuex:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

En modo strict, siempre que el estado Vuex sea modificado de manera externa a una mutación, un error será lanzado. Esto asegura que todas las mutaciones de estado puedan ser explicitamente rastreadas por medio de herramientas de depuración.

### Desarrollo vs. Producción

**¡No habilites el modo estricto cuando despliegues a producción!** El modo strict ejecuta en observador profundo síncrono sobre el árbol de estado para detectar mutaciones inapropiadas. Este proceso puede ser bastante costoso si haces mutaciones grandes sobre el estado. Asegurate de apagar el modo strict en producción para evitar costes de rendimiento.

De forma similar a los plugins, podemos dejar que las herramientas de build se encarguen de esto:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
