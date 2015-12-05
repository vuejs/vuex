<template>
  <li
    class="thread-list-item"
    :class="{ active: isCurrentThread }"
    @click="onClick">
    <h5 class="thread-name">{{ thread.name }}</h5>
    <div class="thread-time">
      {{ lastMessage.timestamp | time }}
    </div>
    <div class="thread-last-message">
      {{ lastMessage.text }}
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
    },
    lastMessage () {
      let last
      this.thread.messages.forEach(message => {
        if (!last || message.timestamp > last.timestamp) {
          last = message
        }
      })
      return last
    }
  },
  methods: {
    onClick () {
      vuex.actions.switchThread(this.thread.id)
    }
  }
}
</script>
