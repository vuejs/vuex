import { Store, createStore } from './store'
import { storeKey, useStore } from './injectKey'
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  useState,
  useMutations,
  useGetters,
  useActions,
  createNamespacedHelpers
} from './helpers'
import { createLogger } from './plugins/logger'

export default {
  version: '__VERSION__',
  Store,
  storeKey,
  createStore,
  useStore,
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  useState,
  useMutations,
  useGetters,
  useActions,
  createNamespacedHelpers,
  createLogger
}

export {
  Store,
  storeKey,
  createStore,
  useStore,
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  useState,
  useMutations,
  useGetters,
  useActions,
  createNamespacedHelpers,
  createLogger
}
