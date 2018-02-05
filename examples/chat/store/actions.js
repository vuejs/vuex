import * as api from '../api'

export const getAllMessages = ({ commit }) => {
  api.getAllMessages(messages => {
    commit('RECEIVE_ALL', {
      messages
    })
  })
}

export const sendMessage = ({ commit }, payload) => {
  api.createMessage(payload, message => {
    commit('RECEIVE_MESSAGE', {
      message
    })
  })
}

export const switchThread = ({ commit }, payload) => {
  commit('SWITCH_THREAD', payload)
}
