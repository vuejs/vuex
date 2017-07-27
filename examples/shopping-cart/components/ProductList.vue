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
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: mapGetters({
    products: 'product/list'
  }),
  methods: {
    ...mapActions({
      addItemToCart: 'cart/addItem',
      decreaseProductInventory: 'product/decreaseInventory'
    }),
    addToCart(product) {
      this.addItemToCart(product);
      this.decreaseProductInventory(product);
    }
  },
  created () {
    this.$store.dispatch('product/getAll')
  }
}
</script>
