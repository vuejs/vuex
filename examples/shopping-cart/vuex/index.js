import Vue from 'vue'
import Vuex from '../../../src'
import * as actions from './actions'
import { cartInitialState, cartMutations } from './modules/cart'
import { productsInitialState, productsMutations } from './modules/products'

Vue.use(Vuex)
Vue.config.debug = true

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex({
  state: {
    cart: cartInitialState,
    products: productsInitialState
  },
  actions,
  mutations: [cartMutations, productsMutations],
  strict: debug,
  middlewares: debug ? [Vuex.createLogger()] : []
})
