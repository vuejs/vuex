import { set } from 'vue'
import * as types from './mutation-types'

export default {

  [types.RECEIVE_ALL] (state, messages) {
    let latestMessage
    messages.forEach(message => {
      // create new thread if the thread doesn't exist
      const threadID = message.threadID
      let thread = state.threads[threadID]
      if (!thread) {
        thread = createThread(state, threadID, message.threadName)
      }
      // mark the latest message
      if (!latestMessage || message.timestamp > latestMessage.timestamp) {
        latestMessage = message
      }
      // add message
      addMessage(state, message)
    })
    // set initial thread to the one with the latest message
    setCurrentThread(state, latestMessage.threadID)
  },

  [types.RECEIVE_MESSAGE] (state, message) {
    addMessage(state, message)
  },

  [types.SWITCH_THREAD] (state, id) {
    setCurrentThread(state, id)
  }
}

function createThread (state, id, name) {
  const thread = {
    id,
    name,
    messages: {},
    lastMessage: null
  }
  set(state.threads, id, thread)
  return thread
}

function addMessage (state, message) {
  // add a `isRead` field before adding the message
  message.isRead = message.threadID === state.currentThreadID
  const thread = state.threads[message.threadID]
  set(thread.messages, message.id, message)
  thread.lastMessage = message
}

function setCurrentThread (state, id) {
  state.currentThreadID = id
  // mark thread messages as read
  const thread = state.threads[id]
  Object.keys(thread.messages).forEach(mid => {
    thread.messages[mid].isRead = true
  })
}
