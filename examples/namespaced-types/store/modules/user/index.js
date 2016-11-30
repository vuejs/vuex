import * as userTypes from './types'

export default {
  state: {
    username: 'BillGates'
  },
  mutations: {
    [userTypes.CHANGE_USERNAME](state, { username }) {
      state.username = username
    }
  },
  actions: {
    [userTypes.CHANGE_USERNAME]({ commit }, username) {
      commit(userTypes.CHANGE_USERNAME, { username })
    }
  },
  getters: {
    [userTypes.USERNAME]: state => state.username,
  }
}