import Vue from 'vue'
import Vuex from 'vuex'
import cart from './modules/cart'
import products from './modules/products'
import createLogger from '../../../src/plugins/logger'
import { isProdEnv } from '../../../src/util'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    cart,
    products
  },
  strict: !isProdEnv(),
  plugins: debug ? [createLogger()] : []
})
