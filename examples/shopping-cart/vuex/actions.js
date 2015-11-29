import shop from '../api/shop'
import * as types from './action-types'

export const addToCart = types.ADD_TO_CART

export function checkout (products) {
  return (dispatch, state) => {
    const savedCartItems = [...state.cart.added]
    dispatch(types.CHECKOUT_REQUEST)
    shop.buyProducts(
      products,
      () => dispatch(types.CHECKOUT_SUCCESS),
      () => dispatch(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}

export function getAllProducts () {
  return dispatch => {
    shop.getProducts(products => {
      dispatch(types.RECEIVE_PRODUCTS, products)
    })
  }
}
