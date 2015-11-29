<template>
  <div>
    Clicked: {{ count }} times
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementIfOdd">Increment if odd</button>
    <button @click="incrementAsync">Increment async</button>
  </div>
</template>

<script>
import vuex from './vuex'

export default {
  data () {
    return {
      // this is how we connect the component's state to
      // a part of vuex's state tree. `vuex.get()` returns
      // a Cursor, which is essentially an event emitter that
      // lets you subscribe to value changes. When Vuex is used,
      // Vue instances knows how to handle Cursors inside data.
      count: vuex.get('count')
    }
  },
  methods: vuex.actions
}
</script>
