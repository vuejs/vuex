<template>
  <li class="message-list-item">
    <h5 class="message-author-name">{{ message.authorName }}</h5>
    <div class="message-time">
      {{ date }}
    </div>
    <div class="message-text">{{ message.text }}</div>
  </li>
</template>

<script>
export default {
  props: ['message'],
  computed: {
    date () {
      return new Date(this.message.timestamp).toLocaleTimeString()
    }
  }
}
</script>
