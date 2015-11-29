import Vue from 'vue'
import Vuex, { loggerMiddleware } from '../../../src'
import * as actions from './actions'
import { cartInitialState, cartMutations } from './stores/cart'
import { productsInitialState, productsMutations } from './stores/products'

Vue.use(Vuex)
Vue.config.debug = true

export default new Vuex({
  state: {
    cart: cartInitialState,
    products: productsInitialState
  },
  actions,
  mutations: [cartMutations, productsMutations],
  middlewares: [loggerMiddleware]
})
