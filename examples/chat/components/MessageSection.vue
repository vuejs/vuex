<template>
  <div class="message-section">
    <h3 class="message-thread-heading">{{ thread.name }}</h3>
    <ul class="message-list" v-el:list>
      <message
        v-for="message in messages | orderBy 'timestamp'"
        track-by="id"
        :message="message">
      </message>
    </ul>
    <textarea class="message-composer" @keyup.enter="sendMessage"></textarea>
  </div>
</template>

<script>
import store from '../store'
import Message from './Message.vue'

export default {
  components: { Message },
  computed: {
    thread () {
      const id = store.state.currentThreadID
      return id
        ? store.state.threads[id]
        : {}
    },
    messages () {
      return this.thread.messages &&
        this.thread.messages.map(id => store.state.messages[id])
    }
  },
  watch: {
    'thread.lastMessage': function () {
      this.$nextTick(() => {
        const ul = this.$els.list
        ul.scrollTop = ul.scrollHeight
      })
    }
  },
  methods: {
    sendMessage (e) {
      const text = e.target.value
      if (text.trim()) {
        store.actions.sendMessage(text, this.thread)
        e.target.value = ''
      }
    }
  }
}
</script>
