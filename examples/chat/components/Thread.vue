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
import vuex from '../vuex'

export default {
  props: ['thread'],
  computed: {
    isCurrentThread () {
      return this.thread.id === vuex.state.currentThreadID
    }
  },
  methods: {
    onClick () {
      vuex.actions.switchThread(this.thread.id)
    }
  }
}
</script>
