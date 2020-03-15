import { createStore } from 'vuex'
import cart from './modules/cart'
import products from './modules/products'
import createLogger from '../../../../src/plugins/logger'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    cart,
    products
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
