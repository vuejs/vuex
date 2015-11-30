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
  computed: {
    count () {
      return vuex.state.count
    }
  },
  methods: vuex.actions
}
</script>
