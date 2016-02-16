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
import * as actions from './actions'

export default {
  vuex: {
    state: {
      count: state => state.count
    },
    actions: actions
  }
}
</script>
