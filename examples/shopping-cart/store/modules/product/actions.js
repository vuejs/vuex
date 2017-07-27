import shop from '../../../api/shop'
import * as types from './types'

export const getAll = ({ commit }) => {
  shop.getProducts(products => {
    commit(types.RECEIVE_PRODUCTS, { products })
  })
}

export const decreaseInventory = ({ commit }, product) => {
  commit(types.DECREASE_INVENTORY, product)
}
