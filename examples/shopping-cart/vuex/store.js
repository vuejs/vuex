import Vue from 'vue'
import Vuex from '../../../src'
import cart from './modules/cart'
import products from './modules/products'

Vue.use(Vuex)
Vue.config.debug = true

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    cart,
    products
  },
  strict: debug,
  middlewares: debug ? [Vuex.createLogger()] : []
})
