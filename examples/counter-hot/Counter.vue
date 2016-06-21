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
import * as actions from './vuex/actions'
import { recentHistory } from './vuex/getters'

export default {
  vuex: {
    actions,
    getters: {
      count: state => state.count,
      recentHistory
    }
  }
}
</script>
