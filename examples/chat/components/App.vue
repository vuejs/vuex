<style src="../css/chat.css"></style>

<template>
  <div class="chatapp">
    <thread-section></thread-section>
    <message-section></message-section>
  </div>
</template>

<script>
import store from '../store'
import ThreadSection from './ThreadSection.vue'
import MessageSection from './MessageSection.vue'

export default {
  store,
  components: {
    ThreadSection,
    MessageSection
  }
}
</script>
