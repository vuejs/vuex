export const addProductToCart = ({ commit }, product) => {
  if (product.inventory > 0) {
    commit('addProductToCart', {
      id: product.id
    })
    commit('decrementProductInventory', {
      id: product.id
    })
  }
}
