<style src="../css/chat.css"></style>

<template>
  <div class="chatapp">
    <thread-section></thread-section>
    <message-section></message-section>
  </div>
</template>

<script>
import vuex from '../vuex'
import ThreadSection from './ThreadSection.vue'
import MessageSection from './MessageSection.vue'

export default {
  components: {
    ThreadSection,
    MessageSection
  },
  created () {
    vuex.actions.getAllMessages()
  }
}
</script>
