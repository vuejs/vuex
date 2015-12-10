<template>
  <li
    class="thread-list-item"
    :class="{ active: isCurrentThread }"
    @click="onClick">
    <h5 class="thread-name">{{ thread.name }}</h5>
    <div class="thread-time">
      {{ thread.lastMessage.timestamp | time }}
    </div>
    <div class="thread-last-message">
      {{ thread.lastMessage.text }}
    </div>
  </li>
</template>

<script>
import store from '../store'

export default {
  props: ['thread'],
  computed: {
    isCurrentThread () {
      return this.thread.id === store.state.currentThreadID
    }
  },
  methods: {
    onClick () {
      store.actions.switchThread(this.thread.id)
    }
  }
}
</script>
