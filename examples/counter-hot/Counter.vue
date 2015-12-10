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
import store from './store'

export default {
  computed: {
    count () {
      return store.state.count
    }
  },
  methods: store.actions
}
</script>
