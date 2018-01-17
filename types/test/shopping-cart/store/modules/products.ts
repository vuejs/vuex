import { createNamespacedHelpers, DefineModule } from '../../../../index'
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
  getAllProducts: undefined
}

export interface ProductsMutations {
  receiveProducts: {
    products: Product[]
  },
  addToCart: {
    id: number
  }
}

export const productsHelpers = createNamespacedHelpers<ProductsState, ProductsGetters, ProductsMutations, ProductsGetters>('products')

export const products: DefineModule<ProductsState, ProductsGetters, ProductsMutations, ProductsActions> = {
  namespaced: true,

  state: {
    all: []
  },

  getters: {
    allProducts: state => state.all
  },

  actions: {
    getAllProducts ({ commit }) {
      shop.getProducts(products => {
        commit('receiveProducts', { products })
      })
    }
  },

  mutations: {
    receiveProducts (state, { products }) {
      state.all = products
    },

    addToCart (state, { id }) {
      state.all.find(p => p.id === id)!.inventory--
    }
  }
}
