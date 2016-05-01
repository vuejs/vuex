# Referencia API

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Opciones de construcción de Vuex.Store

- **state**

  - tipo: `Object`

    El objeto de estado raíz para el almacén Vuex.

    [Detalles](state.md)

- **mutations**

  - tipo: `Object`

    Un objeto en el que cada clave de entrada es el nombre de la mutación y el valor es una función de controlador de mutación. La función de controlador recibe siempre `state` como primer argumento, y seguido recibe todos los argumentos que se pasan a la llamada de despacho.

    [Detalles](mutations.md)

- **modules**

  - tipo: `Object`

    Un objeto que contiene submódulos a combinar en el almacén, en la forma de:

    ``` js
    {
      key: {
        state,
        mutations
      },
      ...
    }
    ```

    Cada módulo puede contener `state` y `mutations` similares a las opciones raíz. El estado del módulo se une al estado raíz del almacén usando las claves del módulo. Las mutaciones de un módulo sólo reciben el estado propio del módulo como primer argumento en lugar del estado raíz.

- **middlewares**

  - tipo: `Array<Object>`

    Un conjunto de objetos de middleware que se encuentran en la forma de:

    ``` js
    {
      snapshot: Boolean, // por defecto: false
      onInit: Function,
      onMutation: Function
    }
    ```

    Todos los campos son opcionales. [Detalles](middlewares.md)

- **strict**

  - tipo: `Boolean`
  - por defecto: `false`

    Fuerza el almacén Vuex a modo estricto. En modo estricto cualquier mutación al estado de Vuex fuera de los manipuladores de mutación generará un error.

    [Detalles](strict.md)

### Propiedades de instancia del Vuex.Store

- **state**

  - tipo: `Object`

    El estado raíz. De sólo lectura.

### Métodos de instancia de Vuex.Store

- **dispatch(mutationName: String, ...args) | dispatch(mutation: Object)**

  Directamente despachar una mutación. Esto es útil en ciertas situaciones, pero en general deberías preferir el uso de acciones en el código de la aplicación.

  *Object-Style Dispatch*

  > requiere >=0.6.2

  También puedes despachar mutaciones utilizando objetos:

  ``` js
  store.dispatch({
    type: 'INCREMENT',
    payload: 10
  })
  ```

- **watch(pathOrGetter: String|Function, cb: Function, [options: Object])**

  Observa una ruta o el valor de una función obtenedor, y llamar a la retrollamada cuando el valor cambia. Acepta un objeto opcional de opciones que tiene las mismas opciones como el método `vm.$watch` de Vue.

  Para dejar de observar, llamar a la función de manipulación devuelto.

- **hotUpdate(newOptions: Object)**

  Intercambio en caliente de nuevas acciones y mutaciones. [Detalles](hot-reload.md)
