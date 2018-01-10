import shop from '../../api/shop'
import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  added: [],
  checkoutStatus: null
}

// getters
const getters = {
  checkoutStatus: state => state.checkoutStatus,

  cartProducts: (state, getters, rootState) => {
    return state.added.map(({ id, quantity }) => {
      const product = rootState.products.all.find(product => product.id === id)
      return {
        title: product.title,
        price: product.price,
        quantity
      }
    })
  },

  cartTotalPrice: (state, getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  }
}

// actions
const actions = {
  checkout ({ commit, state }, products) {
    const savedCartItems = [...state.added]
    commit(types.SET_CHECKOUT_STATUS, null)
    // empty cart
    commit(types.SET_CART_ITEMS, { items: [] })
    shop.buyProducts(
      products,
      () => commit(types.SET_CHECKOUT_STATUS, 'successful'),
      () => {
        commit(types.SET_CHECKOUT_STATUS, 'failed')
        // rollback to the cart saved before sending the request
        commit(types.SET_CART_ITEMS, { items: savedCartItems })
      }
    )
  }
}

// mutations
const mutations = {
  [types.ADD_TO_CART] (state, { id }) {
    state.checkoutStatus = null
    const record = state.added.find(product => product.id === id)
    if (!record) {
      state.added.push({
        id,
        quantity: 1
      })
    } else {
      record.quantity++
    }
  },

  [types.SET_CART_ITEMS] (state, { items }) {
    state.added = items
  },

  [types.SET_CHECKOUT_STATUS] (state, status) {
    state.checkoutStatus = status
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
