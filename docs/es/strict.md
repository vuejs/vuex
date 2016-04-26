# Modo estricto

Para activar el modo estricto, simplemente establece `strict: true` al crear un almacén Vuex:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

En modo estricto, cada vez que el estado Vuex es mutado fuera de los manipuladores de mutación, un error será emitido. Esto asegura que todas las mutaciones del estado pueden ser explícitamente rastreadas por las herramientas de depuración.

### Desarrollo frente a producción

**¡No actives el modo estricto cuando compiles para producción!** El modo estricto ejecuta una observación en profundidad del árbol de estado para detectar mutaciones inapropiadas - asegúrate de apagarlo en producción para evitar el costo de rendimiento.

Al igual que con middlewares, podemos dejar que las herramientas de compilación lo manejen:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
