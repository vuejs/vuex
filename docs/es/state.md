# Estado

### Árbol único de estado

Vuex usa un **árbol único de estado** - esto es, un solo objeto que contiene el estado de tu aplicación y sirve como "única fuente de verdad". Esto también significa que tendrás solo un _store_ por cada aplicación. Un árbol único de estado hace trivial encontrar una porción específica del estado, y nos permite fácilmente tomar instantáneas de estado actual de la aplicación para depuración.

El árbol único de estado no genera conflictos con la modularidad - en los próximos capítulos discutiremos como dividir tu estado y mutaciones en sub-módulos.

### Obteniendo el estado de Vuex dentro de los componentes Vue

Entonces, ¿cómo accedemos al estado dentro del _store_ en nuestros componentes? Dado que los _store_ de Vuex son reactivos, la forma más simple de obtener el estado de ellos es devolver una porción del mismo dentro de una [propiedad computada](http://vuejs.org/guide/computed.html):

``` js
// Creemos un componente contador
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

Cuando cambie `store.state.count`, causará que la propiedad computada se re evalúe y activará las actualizaciones correspondientes del DOM.

Sin embargo, este patrón hace que el componente se base en el _store singleton_ global. Cuando se utiliza un sistema de empaquetamiento de módulos, debemos importar el _store_ en cada componente que lo utilice su estado, y también debemos _mockear_ cuando testeemos el componente.

Vuex provee un mecanismo para inyectar el _store_ dentro de todos los componentes hijos del componente principal, con la opción `store`(habilitada cuando ejecutamos `Vue.use(Vuex)`):

``` js
const app = new Vue({
  el: '#app',
  // Pasa el _store_ usando la opción "store".
  // esto inyectará la instancia del _store_ en todos los componentes hijos.
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

Pasando la opción `store` a la instancia principal, el _store_ se inyectará en todos los componentes hijos y estará dísponible como `this.$store`. Actualicemos nuestra implementación de `Counter`:

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

### La función auxiliar `mapState`

Cuando un componente necesita usar múltiples _getters_ o propiedades del estado del store, declarar cada una de ellas como propiedades computadas puede tornarse repetitivo. Para lidiar con esto, podemos usar la función auxiliar `mapState`, la cual genera funciones _getters_ computadas por nosotros y nos ayuda a reducir código:

``` js
// en la versión independiente, las funciones auxiliares son expuestas como Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // ¡las funciones flecha pueden hacer que el código sea muy breve!
    count: state => state.count,

    // pasar el valor 'count' como cadena de texto es lo mismo que `state => state.count`
    countAlias: 'count',

    // para acceder al estado local a través de `this`, se debe utilizar una función normal
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

También podemos pasar un arreglo de cadenas de texto a `mapState` cuando el nombre de la propiedad computada mapeada es el mismo que el nombre en el árbol de estado.

``` js
computed: mapState([
  // mapea this.count a store.state.count
  'count'
])
```

### Operador de propagación de objetos

Nota que `mapState` devuelve un objeto. ¿Cómo lo utilizamos en combinación con otras propiedades computadas locales? Normalmente, tendríamos que utilizar alguna utilidad para combinar múltiples objetos en uno solo para que podamos pasar el objeto resultante a `computed`. Sin embargo, con el [operador de propagación de objetos](https://github.com/sebmarkbage/ecmascript-rest-spread) (el cual es una propuesta de nivel 3 de ECMAScript), podemos simplificar la sintaxis:

``` js
computed: {
  localComputed () { /* ... */ },
  // combina esto en el objeto exterior con el operador de propagación de objetos
  ...mapState({
    // ...
  })
}
```

### Los componentes todavía puede tener estado local

Usar Vuex no significa que debes poner **todo** tu estado en él. Aunque agregar más estado dentro de Vuex hace que las mutaciones sean más explícitas y depurables, en ocasiones puede hacer que el código sea más indirecto y complejo. Si una porción de estado pertenece solo a un componente, podría ser mejor dejarlo dentro de su estado local. Debes analizar pros y contras y tomar decisiones que se ajusten a las necesidades de desarrollo de tu aplicación.
