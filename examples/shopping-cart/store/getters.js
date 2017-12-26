export const cartProducts = state => {
  return state.cart.added.map(({ id, quantity }) => {
    const product = state.products.all.find(product => product.id === id)
    return {
      title: product.title,
      price: product.price,
      quantity
    }
  })
}
