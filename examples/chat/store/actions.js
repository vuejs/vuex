import * as api from '../api'

export const getAllMessages = ({ commit }) => {
  api.getAllMessages(messages => {
    commit('receiveAll', messages)
  })
}

export const sendMessage = ({ commit }, payload) => {
  api.createMessage(payload, message => {
    commit('receiveMessage', message)
  })
}

export const switchThread = ({ commit }, payload) => {
  commit('switchThread', payload)
}
