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
import store from '../store'
const { checkout } = store.actions

export default {
  computed: {
    products () {
      return store.state.cart.added.map(({ id, quantity }) => {
        const product = store.state.products.find(p => p.id === id)
        return {
          title: product.title,
          price: product.price,
          quantity
        }
      })
    },
    checkoutStatus () {
      return store.state.cart.lastCheckout
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
