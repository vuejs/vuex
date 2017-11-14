<template>
  <div id="app">
    Current value of name: {{ getName }}
    <br/>
    Current value of value: {{ getValue }}
    <br/>
    <input v-model="currentName" />
    <button @click="name(currentName)">Set Name</button>
    <br/>
    <input v-model="currentValue" />
    <button @click="value(currentValue)">Set Value</button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data: () => {
    return {
      currentName: "",
      currentValue: 0
    }
  },
  computed: mapGetters({
    getName: 'name',
    getValue: 'value'
  }),
  methods: mapMutations([
    'name',
    'value'
  ])
}
</script>
