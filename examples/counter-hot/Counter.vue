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
import * as actions from './store/actions'
import { recentHistory } from './store/getters'

export default {
  vuex: {
    state: {
      count: state => state.count,
      recentHistory
    },
    actions: actions
  }
}
</script>
