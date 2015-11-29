import { RECEIVE_PRODUCTS, ADD_TO_CART } from '../action-types'

// initial state
export const productsInitialState = []

// mutations
export const productsMutations = {
  [RECEIVE_PRODUCTS] (state, products) {
    state.products = products
  },

  [ADD_TO_CART] ({ products }, productId) {
    const product = products.find(p => p.id === productId)
    if (product.inventory > 0) {
      product.inventory--
    }
  }
}
