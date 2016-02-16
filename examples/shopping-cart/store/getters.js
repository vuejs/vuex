export function cartProducts (state) {
  return state.cart.added.map(({ id, quantity }) => {
    const product = state.products.find(p => p.id === id)
    return {
      title: product.title,
      price: product.price,
      quantity
    }
  })
}
