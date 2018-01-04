import { createNamespacedHelpers, DefineGetters, DefineMutations, DefineActions } from '../../../../index'
import * as shop from '../../api/shop'

export interface Product {
  id: number
  title: string
  price: number
  inventory: number
}

export interface ProductsState {
  all: Product[]
}

export interface ProductsGetters {
  allProducts: Product[]
}

export interface ProductsActions {
  getAllProducts: null
}

export interface ProductsMutations {
  receiveProducts: {
    products: Product[]
  },
  addToCart: {
    id: number
  }
}

const state: ProductsState = {
  all: []
}

const getters: DefineGetters<ProductsGetters, ProductsState> = {
  allProducts: state => state.all
}

const actions: DefineActions<ProductsActions, ProductsState, ProductsGetters, ProductsMutations> = {
  getAllProducts ({ commit }) {
    shop.getProducts(products => {
      commit('receiveProducts', { products })
    })
  }
}

const mutations: DefineMutations<ProductsMutations, ProductsState> = {
  receiveProducts (state, { products }) {
    state.all = products
  },

  addToCart (state, { id }) {
    state.all.find(p => p.id === id)!.inventory--
  }
}

export const productsHelpers = createNamespacedHelpers<ProductsState, ProductsGetters, ProductsMutations, ProductsGetters>('products')

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
