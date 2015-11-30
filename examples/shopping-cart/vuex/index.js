import Vue from 'vue'
import Vuex from '../../../src'
import logger from '../../../src/middlewares/logger'
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
  middlewares: [logger]
})
