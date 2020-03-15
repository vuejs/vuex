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
        :key="thread.id"
        :thread="thread"
        :active="thread.id === currentThread.id"
        @switch-thread="switchThread">
      </thread>
    </ul>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Thread from './Thread.vue'

export default {
  name: 'ThreadSection',
  components: { Thread },
  setup () {
    const store = useStore()

    return {
      threads: computed(() => store.getters.threads),
      currentThread: computed(() => store.getters.currentThread),
      unreadCount: computed(() => store.getters.unreadCount),
      switchThread: (id) => store.dispatch('switchThread', id)
    }
  }
}
</script>
