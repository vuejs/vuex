import * as types from './types'

export const state = {
  items: [],
  checkoutStatus: null
}

export const mutations = {
  [types.ADD_ITEM] (state, { id }) {
    const record = state.items.find(p => p.id === id)
    if (!record) {
      state.items.push({
        id,
        quantity: 1
      })
    } else {
      record.quantity++
    }
  },

  [types.CHECKOUT_REQUEST] (state) {
    // clear cart
    state.items = []
    state.checkoutStatus = null
  },

  [types.CHECKOUT_SUCCESS] (state) {
    state.checkoutStatus = 'successful'
  },

  [types.CHECKOUT_FAILURE] (state, { savedCartItems }) {
    // rollback to the cart saved before sending the request
    state.items = savedCartItems
    state.checkoutStatus = 'failed'
  }
}
