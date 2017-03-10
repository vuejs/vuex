# Estado

### Árbol de Estado Único

Vuex utiliza un **árbol de estado único**. Esto quiere decir que es un único objeto el que contiene todo el estado de tu aplicación y sirve como **única fuente de verdad**. También implica que normalmente solo tendrás un almacén por aplicación. Un único árbol de estado facilita la localización de una parte del estado y permite hacer snapshots (copias) del estado actual con el fin de depurar tu aplicación.

El árbol de estado único no entra en conflicto con la modularidad de la app. En capitulos posteriores veremos como estructurar el estado y mutaciones en submódulos.

### Utilizando el Estado de Vuex en Componentes Vue

¿Cómo mostramos el estado del almacén dentro de nuestros componentes Vue? Dado que los almacenes Vuex son reactivos, la manera más sencilla de "extraer" al estado es retornándolo (o una parte del mismo) dentro de una [propiedad computada](http://vuejs.org/guide/computed.html):

``` js
// Creamos el componente Counter (contador)
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

Siempre que `store.state.count` cambie, provocará que la propiedad computada sea re-evaluada, lanzando las actualizaciones del DOM asociadas al cambio.

Sin embargo, este patrón impone una dependencia del single global del almacén. Cuando trabajamos con un sistema modular hay que importar el almacén en cada componente que se nutre de el. También tendrémos que mockear el almacén en los tests del componente.

Vuex provides a mechanism to "inject" the store into all child components from the root component with the `store` option (enabled by `Vue.use(Vuex)`):

Vuex nos provee con un mecanismo para "inyectar" el almacén en todos los componentes hijos del componente Root por medio de la opción `store` (habilitada por `Vue.use(Vuex)`):

``` js
const app = new Vue({
  el: '#app',
  // Pasar el almacén con la opción "store"
  // Esto inyectará la instance del almacén en todos los componentes hijos
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

Al pasar la opción `store` a la instancia Root el almacén será inyectado en todos los componentes hijos y podrá ser accedido por medio de `this.$store`. Actualicemos nuestra implementación del `Counter`:

``` js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

### El Helper `mapState`

Cuando un componente hace uso de multiples propiedades o getters del estado almacenado, declarar propiedades computadas una a una puede resultar repetitivo y verboso. Podemos hacer uso del helper `mapState` para facilitarnos la vida. Este genera funciones getter computadas y nos ahorra tiempo al teclado:

``` js
// En desarrollos con scripts gloables el helper esta expuesto como Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // Con funciones arrow conseguimos un codigo muy limpio!
    count: state => state.count,

    // Declarar un alias con un valor String equivale a retornar la propiedad nombrada del almacén
    // El ejemplo equivale a: `countAlias: state => state.count`
    countAlias: 'count',

    // Si queremos acceder al estado loca con `this` debemos utilizar funciones normales
    // en lugar de funciones arrow
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

También podemos pasar un Array de strings a `mapState` cuando queremos que el nombre de la propiedad computada a mapear sea el mismo que utiliza el almacén:

``` js
computed: mapState([
  // Mapear this.count a store.state.count
  'count'
])
```

### Uso del Operador Spread

Es importante saber que `mapState` retorna un objeto. ¿Como lo usamos en combinación con propiedades computadas locales? Normalmente tendríamos que mergear/combinar múltiples objetos en uno que finalmente podríamos pasar a `computed`. Sin embargo, si utilizamos [el Operador Spread para objetos](https://github.com/sebmarkbage/ecmascript-rest-spread) (el cual se encuentra en stage-3 de propuesta ECMAScript), podemos simplificar la sintaxis en gran medida:

``` js
computed: {
  localComputed () { /* ... */ },
  // mezcla el objeto resultante de mapState con el resto de entradas
  ...mapState({
    // ...
  })
}
```

### Los Componentes Puede tener Estado Local

Usar Vuex no implica que debas poner **todo** el estado en Vuex. A pesar de que cuanto más estado almacenes en Vuex más explicitas y depurables serán tu mutaciones, a veces también puede hacer de tu código uno más verboso e indirecto. Si una parte del estado pertenece únicamente a un componente, sería perfectamente aceptable dejarlo como estado local al mismo. Deberás sopesar los beneficios y tomar la decisión que mejor se adapte a los requisitos de tu aplicación.
