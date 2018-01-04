import Vue from 'vue'
import { cartHelpers } from './store/modules/cart'
import store from './store'

new Vue({
  store,

  computed: {
    ...cartHelpers.mapState({
      test: (state, getters) => {
        state.added
        getters.cartProducts
      }
    }),
    ...cartHelpers.mapState({
      items: 'added'
    }),
    ...cartHelpers.mapGetters(['checkoutStatus'])
  },

  methods: {
    ...cartHelpers.mapMutations(['addToCart']),
    ...cartHelpers.mapActions(['checkout'])
  },

  created () {
    this.test
    this.items
    this.checkoutStatus
    this.addToCart({ id: 123 })
    this.checkout([{
      id: 123,
      price: 3000,
      title: 'test',
      inventory: 3
    }])
  }
})
