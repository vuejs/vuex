<template>
  <ul>
    <li v-for="p in products">
      {{ p.title }} - {{ p.price | currency }}
      <br>
      <button
        :disabled="!p.inventory"
        @click="addToCart(p)">
        Add to cart
      </button>
    </li>
  </ul>
</template>

<script>
import { getAllProducts, addToCart } from '../store/actions'

export default {
  vuex: {
    state: {
      products: ({ products }) => products.all
    },
    actions: {
      getAllProducts,
      addToCart
    }
  },
  created () {
    this.getAllProducts()
  }
}
</script>
