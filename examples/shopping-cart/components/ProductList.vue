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
import vuex from '../vuex'
const { getAllProducts, addToCart } = vuex.actions

export default {
  data () {
    return {
      products: vuex.get('products')
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
