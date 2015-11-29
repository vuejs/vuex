<template>
  <div class="cart">
    <h2>Your Cart</h2>
    <p v-show="!cart.added.length"><i>Please add some products to cart.</i></p>
    <ul>
      <li v-for="p in products">
        {{ p.title }} - {{ p.price | currency }} x {{ p.quantity }}
      </li>
    </ul>
    <p>Total: {{ total | currency }}</p>
    <p><button :disabled="!cart.added.length" @click="checkout">Checkout</button></p>
    <p v-show="cart.lastCheckout">Checkout {{ cart.lastCheckout }}.</p>
  </div>
</template>

<script>
import vuex from '../vuex'
const { checkout } = vuex.actions

export default {
  data () {
    return {
      cart: vuex.get('cart')
    }
  },
  computed: {
    products () {
      return this.cart.added.map(({ id, quantity }) => {
        const product = vuex.state.products.find(p => p.id === id)
        return {
          title: product.title,
          price: product.price,
          quantity
        }
      })
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
