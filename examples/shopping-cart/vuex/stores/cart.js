import {
  ADD_TO_CART,
  CHECKOUT_REQUEST,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILURE
} from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
export const cartInitialState = {
  added: [],
  lastCheckout: null
}

// mutations
export const cartMutations = {
  [ADD_TO_CART] ({ cart }, productId) {
    cart.lastCheckout = null
    const record = cart.added.find(p => p.id === productId)
    if (!record) {
      cart.added.push({
        id: productId,
        quantity: 1
      })
    } else {
      record.quantity++
    }
  },

  [CHECKOUT_REQUEST] ({ cart }) {
    // clear cart
    cart.added = []
    cart.lastCheckout = null
  },

  [CHECKOUT_SUCCESS] ({ cart }) {
    cart.lastCheckout = 'successful'
  },

  [CHECKOUT_FAILURE] ({ cart }, savedCartItems) {
    // rollback to the cart saved before sending the request
    cart.added = savedCartItems
    cart.lastCheckout = 'failed'
  }
}
