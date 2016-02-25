import * as api from '../api'
import * as types from './mutation-types'

export const getAllMessages = ({ dispatch }) => {
  api.getAllMessages(messages => {
    dispatch(types.RECEIVE_ALL, messages)
  })
}

export const sendMessage = ({ dispatch }, text, thread) => {
  api.createMessage({ text, thread }, message => {
    dispatch(types.RECEIVE_MESSAGE, message)
  })
}

export const switchThread = ({ dispatch }, id) => {
  dispatch(types.SWITCH_THREAD, id)
}
