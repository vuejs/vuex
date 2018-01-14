<template>
  <ul>
    <li 
      v-for="product in products"
      :key="product.id">
      {{ product.title }} - {{ product.price | currency }}
      <br>
      <button
        :disabled="!product.inventory"
        @click="addToCart(product)">
        Add to cart
      </button>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: mapGetters({
    products: 'allProducts'
  }),
  methods: mapActions([
    'addToCart'
  ]),
  created () {
    this.$store.dispatch('getAllProducts')
  }
}
</script>
