export const checkoutStatus = state => state.checkoutStatus

export const items = (state, getters, rootState) => {
  return state.items.map(({ id, quantity }) => {
    const product = rootState.product.list.find(p => p.id === id)
    return {
      title: product.title,
      price: product.price,
      quantity
    }
  })
}
