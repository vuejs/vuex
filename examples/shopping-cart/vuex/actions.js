import shop from '../api/shop'
import * as types from './mutation-types'

export const addToCart = ({ dispatch }, product) => {
  if (product.inventory > 0) {
    dispatch(types.ADD_TO_CART, {
      id: product.id
    })
  }
}

export const checkout = ({ dispatch, state }, products) => {
  const savedCartItems = [...state.cart.added]
  dispatch(types.CHECKOUT_REQUEST)
  shop.buyProducts(
    products,
    () => dispatch(types.CHECKOUT_SUCCESS),
    () => dispatch(types.CHECKOUT_FAILURE, { savedCartItems })
  )
}

export const getAllProducts = ({ dispatch }) => {
  shop.getProducts(products => {
    dispatch(types.RECEIVE_PRODUCTS, { products })
  })
}
