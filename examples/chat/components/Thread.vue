<template>
  <li
    class="thread-list-item"
    :class="{ active: thread.id === currentThreadID }"
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
import { switchThread } from '../vuex/actions'

export default {
  props: ['thread'],
  vuex: {
    getters: {
      currentThreadID: state => state.currentThreadID
    },
    actions: {
      switchThread
    }
  }
}
</script>
