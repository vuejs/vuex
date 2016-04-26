# Empezando

En el centro de toda aplicación Vuex está el **almacén**. Un almacén o "store" es básicamente un contenedor que guarda el **estado** de tu aplicación. Hay dos hechos que hacen al almacén Vuex diferente a un objeto global plano:

1. Los almacenes Vuex son reactivos. Cuando los Vue componentes recuperan un estado, el mismo reactiva y eficientemente será actualizado si el estado del almacén cambia.

2. No puedes directamente mutar el estado del almacén. La única manera de cambiar el estado del almacén es despachando explícitamente **mutaciones**. Esto hace cada cambio de estado fácilmente rastreable, y habilita utilidades que nos ayudan a comprender mejor nuestras aplicaciones.

### El almacén más simple

> **NOTA:** Usaremos la sintaxis del ES2015 para los ejemplos de código para el resto de la documentación. Si aún no lo estás usando, [deberías](https://babeljs.io/docs/learn-es2015/)! La documentación además asume que ya estás familiarizado con los conceptos discutidos en [Construyendo Apps de gran envergadura con Vue.js](http://vuejs.org/guide/application.html).

La creación de un almacén Vuex es bastante sencillo - simplemente proporciona un objeto con el estado inicial, y algunas mutaciones:

``` js
import Vuex from 'vuex'

const state = {
  count: 0
}

const mutations = {
  INCREMENT (state) {
    state.count++
  }
}

export default new Vuex.Store({
  state,
  mutations
})
```

Ahora, puedes acceder el objeto del estado como `store.state`, y ejecutar una mutación despachando su nombre:

``` js
store.dispatch('INCREMENT')

console.log(store.state.count) // -> 1
```

Si prefieres despachar con el estilo de objetos, también puedes hacer lo siguiente:

``` js
// mismo efecto al anterior
store.dispatch({
  type: 'INCREMENT'
})
```

De nuevo, la razón por la que estamos despachando una mutación en vez cambiar `store.state.count` directamente, es porque queremos explícitamente rastrearlo. Esta simple convención hace tu intención más explícita, para que así puedas razonar mejor sobre cambios de estado en tu app cuando vayas leyendo el código. Adicionalmente, eso nos da la oportunidad de implementar utilidades que puedan registrar cada mutación, tomar instantáneas de estado, o incluso realizar depuraciones con viaje en el tiempo.

Ahora, esto es tan sólo el ejemplo más simple posible de lo que es el almacén. Pero Vuex es más que solamente el almacén. Seguidamente, discutiremos algunos conceptos básicos en profundidad: [Estado](state.md), [Mutaciones](mutations.md) y [Acciones](actions.md).
