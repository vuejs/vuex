import * as api from '../api'
import * as types from './mutation-types'

export const getAllMessages = () => dispatch => {
  api.getAllMessages(messages => {
    dispatch(types.RECEIVE_ALL, messages)
  })
}

export const sendMessage = (text, thread) => dispatch => {
  api.createMessage({ text, thread }, message => {
    dispatch(types.RECEIVE_MESSAGE, message)
  })
}

export const switchThread = id => dispatch => {
  dispatch(types.SWITCH_THREAD, id)
}
