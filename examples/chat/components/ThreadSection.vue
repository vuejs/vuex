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
import store from '../store'
import Thread from './Thread.vue'

export default {
  components: { Thread },
  vuex: {
    state: {
      threads: state => state.threads
    }
  },
  computed: {
    unreadCount () {
      const threads = this.threads
      return Object.keys(threads).reduce((count, id) => {
        return threads[id].lastMessage.isRead
          ? count
          : count + 1
      }, 0)
    }
  }
}
</script>
