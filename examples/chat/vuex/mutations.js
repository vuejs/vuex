import { set } from 'vue'
import * as types from './mutation-types'

export default {

  [types.RECEIVE_MESSAGE] (state, message) {
    // reset error message
    state.errorMessage = null
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
    // set current id if no thread is set
    if (!state.currentThreadID) {
      state.currentThreadID = thread.id
    }
    // add message
    thread.messages.push(message)
  },

  [types.SWITCH_THREAD] (state, id) {
    state.currentThreadID = id
  }
}
