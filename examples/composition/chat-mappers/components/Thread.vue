<template>
  <li
    class="thread-list-item"
    :class="{ active }"
    @click="$emit('switch-thread', thread.id)"
  >
    <h5 class="thread-name">{{ thread.name }}</h5>
    <div class="thread-time">
      {{ time(thread.lastMessage.timestamp) }}
    </div>
    <div class="thread-last-message">
      {{ thread.lastMessage.text }}
    </div>
  </li>
</template>

<script>
export default {
  name: 'Thread',
  props: {
    thread: Object,
    active: Boolean
  },
  setup() {
    return {
      time: (value) => new Date(value).toLocaleTimeString()
    }
  }
}
</script>
