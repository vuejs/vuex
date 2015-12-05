<template>
  <div class="thread-section">
    <div class="thread-count">
      <span v-show="unreadCount">
        Unread threads: {{ unreadCount }}
      </span>
    </div>
    <ul class="thread-list">
      <thread
        v-for="thread in threads"
        track-by="id"
        :thread="thread">
      </thread>
    </ul>
  </div>
</template>

<script>
import vuex from '../vuex'
import Thread from './Thread.vue'

export default {
  components: { Thread },
  computed: {
    threads () {
      return vuex.state.threads
    },
    unreadCount () {
      return vuex.state.threads.reduce((count, thread) => {
        const hasUnread = thread.messages.some(m => !m.isRead)
        return hasUnread
          ? count + 1
          : count
      }, 0)
    }
  }
}
</script>
