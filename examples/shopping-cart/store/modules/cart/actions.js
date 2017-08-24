import shop from '../../../api/shop'
import * as types from './types'
import * as productTypes from '../product/types'

export const addItem = ({ commit }, product) => {
  if (product.inventory > 0) {
    commit(types.ADD_ITEM, {
      id: product.id
    })
    commit(`product/${productTypes.DECREASE_INVENTORY}`, product, { root: true })
  }
}

export const checkout = ({ commit, state }, products) => {
  const savedCartItems = [...state.items]
  commit(types.CHECKOUT_REQUEST)
  shop.buyProducts(
    products,
    () => commit(types.CHECKOUT_SUCCESS),
    () => commit(types.CHECKOUT_FAILURE, { savedCartItems })
  )
}
