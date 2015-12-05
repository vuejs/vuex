import { set } from 'vue'
import * as types from './mutation-types'

export default {

  [types.RECEIVE_ALL] (state, messages) {
    let latestMessage
    messages.forEach(message => {
      // create new thread if the thread doesn't exist
      let thread = state.threads.find(t => t.id === message.threadID)
      if (!thread) {
        thread = {
          id: message.threadID,
          name: message.threadName,
          messages: []
        }
        state.threads.push(thread)
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
    const thread = state.threads.find(t => t.id === message.threadID)
    addMessageToThread(thread, message, state.currentThreadID)
  },

  [types.SWITCH_THREAD] (state, id) {
    setCurrentThread(state, id)
  }
}

function addMessageToThread (thread, message, currentThreadID) {
  // add a `isRead` field
  message.isRead = message.threadID === currentThreadID
  thread.messages.push(message)
}

function setCurrentThread (state, id) {
  state.currentThreadID = id
  const thread = state.threads.find(t => t.id === id)
  thread.messages.forEach(message => {
    message.isRead = true
  })
}
