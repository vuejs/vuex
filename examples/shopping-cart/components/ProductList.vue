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
import store from '../store'
const { getAllProducts, addToCart } = store.actions

export default {
  computed: {
    products () {
      return store.state.products
    }
  },
  created () {
    getAllProducts()
  },
  methods: {
    addToCart (product) {
      if (product.inventory > 0) {
        addToCart(product.id)
      }
    }
  }
}
</script>
