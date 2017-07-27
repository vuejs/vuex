import * as types from './types'

export const state = {
  list: []
}

export const mutations = {
  [types.RECEIVE_PRODUCTS] (state, { products }) {
    state.list = products
  },

  [types.DECREASE_INVENTORY] (state, { id }) {
    state.list.find(p => p.id === id).inventory--
  }
}
