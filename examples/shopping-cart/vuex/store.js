import Vue from 'vue'
import Vuex from '../../../src'
import cart from './modules/cart'
import products from './modules/products'
import createLogger from '../../../src/middlewares/logger'

Vue.use(Vuex)
Vue.config.debug = true

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    cart,
    products
  },
  strict: debug,
  middlewares: debug ? [createLogger()] : []
})
