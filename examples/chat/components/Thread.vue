<template>
  <li
    class="thread-list-item"
    :class="{ active: isCurrentThread }"
    @click="switchThread(thread.id)">
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
import { switchThread } from '../store/actions'

export default {
  props: ['thread'],
  vuex: {
    state: {
      isCurrentThread ({ currentThreadID }) {
        return this.thread.id === currentThreadID
      }
    },
    actions: {
      switchThread
    }
  }
}
</script>
