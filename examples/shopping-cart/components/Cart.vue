<template>
  <div class="cart">
    <h2>Your Cart</h2>
    <p v-show="!products.length"><i>Please add some products to cart.</i></p>
    <ul>
      <li v-for="p in products">
        {{ p.title }} - {{ p.price | currency }} x {{ p.quantity }}
      </li>
    </ul>
    <p>Total: {{ total | currency }}</p>
    <p><button :disabled="!products.length" @click="checkout(products)">Checkout</button></p>
    <p v-show="checkoutStatus">Checkout {{ checkoutStatus }}.</p>
  </div>
</template>

<script>
import vuex from '../vuex'
const { checkout } = vuex.actions

export default {
  computed: {
    products () {
      return vuex.state.cart.added.map(({ id, quantity }) => {
        const product = vuex.state.products.find(p => p.id === id)
        return {
          title: product.title,
          price: product.price,
          quantity
        }
      })
    },
    checkoutStatus () {
      return vuex.state.cart.lastCheckout
    },
    total () {
      return this.products.reduce((total, p) => {
        return total + p.price * p.quantity
      }, 0)
    }
  },
  methods: {
    checkout
  }
}
</script>
