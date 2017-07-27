import Vue from 'vue'
import Vuex from 'vuex'
import cart from './modules/cart'
import product from './modules/product'
import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    cart,
    product
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
