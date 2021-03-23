<template>
  <li class="message-list-item">
    <h5 class="message-author-name">{{ message.authorName }}</h5>
    <div class="message-time">
      {{ time(message.timestamp) }}
    </div>
    <div class="message-text">{{ message.text }}</div>
  </li>
</template>

<script>
export default {
  name: "Message",
  props: {
    message: Object,
  },
  setup() {
    return {
      time: (value) => new Date(value).toLocaleTimeString(),
    };
  },
};
</script>
