import Vue from 'vue'
import Vuex from 'vuex'
import cart from './modules/cart'
import products from './modules/products'
import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    cart,
    products
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  mixins: {
    mutations: {
      changeState: function(state, changed) {
        // changed = {
        //   ['properties'] : value
        // }
        Object.entries(changed)
          .forEach(([name, value]) => {
            state[name] = value
          })
      }
    }
  }
})
