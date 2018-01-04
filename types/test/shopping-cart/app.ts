import Vue from 'vue'
import { cartHelpers } from './store/modules/cart'
import store from './store'

new Vue({
  store,

  computed: {
    ...cartHelpers.mapState({
      added: state => state.cart.added
    }),
    ...cartHelpers.mapGetters(['checkoutStatus'])
  },

  methods: {
    ...cartHelpers.mapMutations(['addToCart']),
    ...cartHelpers.mapActions(['checkout'])
  },

  created () {

  }
})
