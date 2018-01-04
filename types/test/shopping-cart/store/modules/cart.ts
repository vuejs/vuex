import { createNamespacedHelpers, DefineGetters, DefineMutations, DefineActions } from '../../../../index'
import * as shop from '../../api/shop'
import { Product } from './products'
import { RootState } from '../'

export interface AddedItem {
  id: number
  quantity: number
}

export type CheckoutStatus = 'successful' | 'failed' | null

export interface CartState {
  added: AddedItem[]
  checkoutStatus: CheckoutStatus
}

export interface CartGetters {
  checkoutStatus: CheckoutStatus
  cartProducts: {
    title: string
    price: number
    quantity: number
  }[]
}

export interface CartMutations {
  addToCart: {
    id: number
  },
  checkoutRequest: null,
  checkoutSuccess: null,
  checkoutFailure: {
    savedCartItems: AddedItem[]
  }
}

export interface CartActions {
  checkout: Product[]
  addToCart: Product
}

const state: CartState = {
  added: [],
  checkoutStatus: null
}

const getters: DefineGetters<CartGetters, CartState, {}, RootState> = {
  checkoutStatus: state => state.checkoutStatus,

  cartProducts (state, getters, rootState, g) {
    return state.added.map(({ id, quantity }) => {
      const product = rootState.products.all.find(p => p.id === id)
      return {
        title: product.title,
        price: product.price,
        quantity
      }
    })
  }
}

const actions: DefineActions<CartActions, CartState, CartGetters, CartMutations> = {
  checkout ({ commit, state }, products) {
    const savedCartItems = [...state.added]
    commit('checkoutRequest')
    shop.buyProducts(
      products,
      () => commit('checkoutSuccess'),
      () => commit('checkoutFailure', { savedCartItems })
    )
  },

  addToCart ({ commit }, product) {
    if (product.inventory > 0) {
      commit('addToCart', {
        id: product.id
      })
    }
  }
}

const mutations: DefineMutations<CartMutations, CartState> = {
  addToCart (state, { id }) {
    state.checkoutStatus = null
    const record = state.added.find(p => p.id === id)
    if (!record) {
      state.added.push({
        id,
        quantity: 1
      })
    } else {
      record.quantity++
    }
  },

  checkoutRequest (state) {
    state.added = []
    state.checkoutStatus = null
  },

  checkoutSuccess (state) {
    state.checkoutStatus = 'successful'
  },

  checkoutFailure (state, { savedCartItems }) {
    state.added = savedCartItems
    state.checkoutStatus = 'failed'
  }
}

export const cartHelpers = createNamespacedHelpers<CartState, CartGetters, CartMutations, CartActions>('cart')

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
