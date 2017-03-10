# Empecemos

En el centro de toda aplicación Vuex está el **almacén** (store). Un "almacén" es basicamente un contenedor que conserva el **estado** de tu aplicación. Hay dos cosas que diferencian a un almacén Vuex de un mero objeto global:

1. Un almacén Vuex es **reactivo**. Cuando un componente Vue accede al estado contenido en el almacen se actulizará de forma eficiente y reactiva ante cambios del mismo.

2. El estado del almacen **no puede ser modificado directamente**. La única manera de modificar el estado del almacén es **lanzando mutaciones** de forma explicita ('commits'). Esto asegura que todo cambio en el estado deja un registro rastreable, permitiendo también la creación de herramientas con las que evaluar y entender nuestras aplicaciones.

### El Almacén más Sencillo

> **NOTA:** Vamos a utlizar la sintaxis de ES2015 en los ejemplos a lo largo de toda la documentación. Si todavía no estas al día con ella, [deberías](https://babeljs.io/docs/learn-es2015/)!

Después de [instalar](installation.md) Vuex, vamos a crear un almacén. Es bastante sencillo - solo hay que proveerlo de un estado inicial y de algunas mutaciones:

``` js
// Asegurate de invocar Vue.use(Vuex) primero si estas utilizando un sistema modular

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

Ahora podrás acceder al objeto estado (state) por medio de `store.state` y lanzar mutaciones por medio del método `store.commit`:

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

La razón por la que lanzamos mutaciones en lugar de cambiar directamente el valor de `store.state.count` es porque queremos rastrear todos los cambios de forma explicita. Esta sencilla convención hace que tu intención sea más explicita, facilitando tu comprensión de los cambios de estado mientras lees el código. Además nos ofrece la oportunidad de implementar herramientas con las que registrar todas las mutaciones, hacer snapshots del estado e incluso aplicar 'retroceso temporales' sobre el mismo.

Dado que el estado almancenado es reactivo utlizarlo en un componente simplemente requiere retornar el estado dentro de una propiedad computada. Aplicar modificaciones de estado es tan sencillo como lanzar mutaciones desde los métodos del component.

Aquí podéis ver un ejemplo de [un sencillo contador creado con Vuex](https://jsfiddle.net/n9jmu5v7/341/).

A continuación veremos los conceptos básicos en mayor detalle, empezando por [el Estado](state.md).
