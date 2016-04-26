# Estado y obtenedores

### Árbol de único estado

Vuex utiliza un **árbol de único estado** - es decir, este único objeto contiene todo el estado a nivel de aplicación y sirve como la "única fuente de la verdad". Esto también significa que por lo general vas a tener sólo un almacén para cada aplicación. Un árbol de único estado hace que sea fácil de localizar una parte específica del estado, y nos permite tomar fácilmente instantáneas del estado actual de la aplicación para fines de depuración.

The single state tree does not conflict with modularity - in later chapters we will discuss how to split your state and mutations into sub modules.

### Obteniendo el estado Vuex en componentes Vue

Entonces, ¿cómo mostrar el estado del almacén en nuestros componentes Vue? Ya que los almacenes Vuex son reactivos, la forma más sencilla de "recuperar" un estado del mismo es simplemente devolviendo un estado desde una [propiedad computarizada](http://vuejs.org/guide/computed.html):

``` js
// en la definición del componente Vue
computed: {
  count: function () {
    return store.state.count
  }
}
```

Siempre que `store.state.count` cambie, hará que la propiedad computarizada sea reevaluada, y active las actualizaciones de DOM asociadas.

Sin embargo, este modelo implica que el componente dependa de un almacén global. Eso hace que sea más difícil testear el componente, y también que sea difícil ejecutar varias instancias de la aplicación utilizando el mismo conjunto de componentes. En aplicaciones de gran tamaño, es posible que queramos "inyectar" el almacén en componentes hijos desde el componente raíz. He aquí cómo hacerlo:

1. Instala Vuex y conecta tu componente raíz al almacén:

  ``` js
  import Vue from 'vue'
  import Vuex from 'vuex'
  import store from './store'
  import MyComponent from './MyComponent'

  // importante, enseña al componente Vue
  // cómo manejar opciones relacionadas con Vuex
  Vue.use(Vuex)

  var app = new Vue({
    el: '#app',
    // proporciona el almacén utilizando la opción "store".
    // esto inyectará la instancia del almacén a todos los componentes hijos.
    store,
    components: {
      MyComponent
    }
  })
  ```

  Al proveer la opción `store` a la instancia raíz, el almacén será inyectado a todos sus componentes hijos y estará disponible en ellos como `this.$store`. Sin embargo, es poco probable que vayamos a necesitar referenciarlo.

2. Dentro de los componentes hijos, recupera el estado con funciones **obtenedor** en la opción `vuex.getters`:

  ``` js
  // MyComponent.js
  export default {
    template: '...',
    data () { ... },
    // aquí es donde recuperamos el estado del almacén
    vuex: {
      getters: {
        // una función obtenedor del almacén, que
        // asigna `store.state.count` en el componente como `this.count`
        count: function (state) {
          return state.count
        }
      }
    }
  }
  ```

  Nota el bloque de opción especial `vuex`. Aquí es donde especificamos el estado que el componente va a utilizar del almacén. Para cada nombre de propiedad, especificamos una función obtenedor que recibe todo el árbol del almacén como único argumento, y entonces selecciona y devuelve parte del estado, o un valor computarizado derivado del estado. El resultado devuelto será establecido en el componente utilizando el nombre de la propiedad, al igual que una propiedad computarizada.

  En muchos casos, la función "obtenedor" puede ser muy sucinta usando las funciones de dirección del ES2015:

  ``` js
  vuex: {
    getters: {
      count: state => state.count
    }
  }
  ```

### Obtenedores deben ser puros

Todos los obtenedores de Vuex deben ser [funciones puras](https://en.wikipedia.org/wiki/Pure_function) - las mismas toman todo el árbol del estado, y devuelven algún valor basado exclusivamente en ese estado. Esto los hace más testeables, componibles y eficientes. También significa que **no puedes apoyarte en `this` dentro de obtenedores**.

Si necesitas acceso a `this`, por ejemplo para calcular el estado derivado basado en el estado local o los props del componente, es necesario definir propiedades computarizadas, llanas por separado:

``` js
vuex: {
  getters: {
    currentId: state => state.currentId
  }
},
computed: {
  isCurrent () {
    return this.id === this.currentId
  }
}
```

### Obtenedores pueden devolver estado derivado

Obtenedores de estado Vuex son, en el fondo, propiedades computarizadas, esto significa que puedes apoyarte en ellos para que de manera reactiva (y eficiente) calculen un estado derivado. Por ejemplo, digamos que en el estado tenemos una colección `messages` que contienen todos los mensajes, y un `currentThreadID` representando el hilo que está siendo visto por el usuario. Lo que queremos mostrar al usuario es una lista filtrada de mensajes que pertenecen al hilo actual:

``` js
vuex: {
  getters: {
    filteredMessages: state => {
      return state.messages.filter(message => {
        return message.threadID === state.currentThreadID
      })
    }
  }
}
```

Dado que las propiedades computarizadas de Vue.js se almacenan en caché de forma automática y sólo reevaluadas cuando una dependencia reactiva cambie, no necesitas preocuparte de que esta función sea llamada en cada mutación.

### Compartiendo obtenedores a través de múltiples componentes

Como puedes ver, el obtenedor `filteredMessages` puede ser útil dentro de múltiples componentes. En ese caso, es una buena idea compartir la misma función entre ellos:

``` js
// getters.js
export function filteredMessages (state) {
  return state.messages.filter(message => {
    return message.threadID === state.currentThreadID
  })
}
```

``` js
// en un componente...
import { filteredMessages } from './getters'

export default {
  vuex: {
    getters: {
      filteredMessages
    }
  }
}
```

Debido a que los obtenedores son puros, los obtenedores compartidos a través de múltiples componentes se almacenan en caché de manera eficiente: cuando cambian las dependencias, sólo son reevaluados una vez para todos los componentes que los utilizan.

> Referencias Flux: obtenedores Vuex pueden ser aproximadamente comparados con [`mapStateToProps`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) en Redux. Sin embargo, debido a que se apoyan en propiedades computarizadas de Vue, son más eficientes que `mapStateToProps`, y más similares a [reselect](https://github.com/reactjs/reselect).

### A los componentes no se les permite mutar directamente el estado

Es importante recordar que los **componentes nunca deberían mutar el estado del almacén Vuex directamente**. Porque queremos que toda mutación de estado sea explícita y rastreable, todas las mutaciones de estado del almacén Vuex deben llevarse a cabo dentro de los manipuladores de mutación del almacén.

Para ayudar a imponer esta regla, cuando en [Modo estricto](strict.md), si el estado de almacén es mutado fuera de sus manipuladores de mutación, Vuex mostrará un error.

Con esta regla en lugar, nuestros componentes Vue ahora tienen mucha menos responsabilidad: están conectados al estado del almacén Vuex a través de obtenedores de sólo lectura, y la única manera que tienen de afectar el estado es activando de alguna manera **mutaciones** (que veremos más adelante). Aún pueden poseer y operar en su estado local si es necesario, pero ya no ponemos ninguna lógica de data-fetching o mutación de estado global dentro de los componentes individuales. Ellos ahora están centralizados y manejados dentro de archivos relacionados con Vuex, lo que hace grandes aplicaciones más fáciles de entender y mantener.
