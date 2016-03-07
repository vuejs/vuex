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
    <textarea class="message-composer" @keyup.enter="trySendMessage"></textarea>
  </div>
</template>

<script>
import Message from './Message.vue'
import { sendMessage } from '../vuex/actions'
import { currentThread, currentMessages } from '../vuex/getters'

export default {
  components: { Message },
  vuex: {
    getters: {
      thread: currentThread,
      messages: currentMessages
    },
    actions: {
      sendMessage
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
    trySendMessage (e) {
      const text = e.target.value
      if (text.trim()) {
        this.sendMessage(text, this.thread)
        e.target.value = ''
      }
    }
  }
}
</script>
