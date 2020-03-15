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
import { ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import Message from './Message.vue'

export default {
  name: 'MessageSection',
  components: { Message },
  setup () {
    const list = ref(null)

    const store = useStore()

    const text = ref('')

    const thread = computed(() => store.getters.currentThread)
    const messages = computed(() => store.getters.sortedMessages)

    watch(() => thread.value.lastMessage, () => {
      nextTick(() => {
        const ul = list.value
        ul.scrollTop = ul.scrollHeight
      })
    })

    function sendMessage () {
      const trimedText = text.value.trim()
      if (trimedText) {
        store.dispatch('sendMessage', {
          text: trimedText,
          thread: thread.value
        })
        this.text = ''
      }
    }

    return {
      list,
      text,
      thread,
      messages,
      sendMessage
    }
  }
}
</script>
