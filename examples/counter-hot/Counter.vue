<template>
  <div>
    Value: {{ count }}
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementIfOdd">Increment if odd</button>
    <button @click="incrementAsync">Increment async</button>
    <div>
      <div>Recent History: {{recentHistory}}</div>
    </div>
  </div>
</template>

<script>
import store from './store'
export default {
  computed: {
    count () {
      return store.state.count
    },
    recentHistory: store.getters.recentHistory
  },
  methods: store.actions

}
</script>
