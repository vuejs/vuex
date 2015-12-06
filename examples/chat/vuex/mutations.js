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
        thread = {
          id: threadID,
          name: message.threadName,
          messages: {},
          lastMessage: null
        }
        set(state.threads, threadID, thread)
      }
      // mark the latest message
      if (!latestMessage || message.timestamp > latestMessage.timestamp) {
        latestMessage = message
      }
      // add message to thread
      addMessageToThread(thread, message, state.currentThreadID)
    })
    // set initial thread to the one with the latest message
    setCurrentThread(state, latestMessage.threadID)
  },

  [types.RECEIVE_MESSAGE] (state, message) {
    // add message
    const thread = state.threads[message.threadID]
    addMessageToThread(thread, message, state.currentThreadID)
  },

  [types.SWITCH_THREAD] (state, id) {
    setCurrentThread(state, id)
  }
}

function addMessageToThread (thread, message, currentThreadID) {
  // add a `isRead` field before adding the message
  message.isRead = message.threadID === currentThreadID
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
