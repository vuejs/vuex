<template>
  <div class="message-section">
    <h3 class="message-thread-heading">{{ thread.name }}</h3>
    <ul class="message-list" ref="list">
      <message
        v-for="message in messages"
        :key="message.id"
        :message="message">
      </message>
    </ul>
    <textarea
      class="message-composer"
      v-model="text"
      @keyup.enter="sendMessage"></textarea>
  </div>
</template>

<script>
import Message from './Message.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'MessageSection',
  components: { Message },
  data () {
    return {
      text: ''
    }
  },
  computed: mapGetters({
    thread: 'currentThread',
    messages: 'sortedMessages'
  }),
  watch: {
    'thread.lastMessage': function () {
      this.$nextTick(() => {
        const ul = this.$refs.list
        ul.scrollTop = ul.scrollHeight
      })
    }
  },
  methods: mapActions({
    sendMessage (dispatch) {
      const { text, thread } = this
      if (text.trim()) {
        dispatch('sendMessage', {
          text,
          thread
        })
        this.text = ''
      }
    }
  })
}
</script>
