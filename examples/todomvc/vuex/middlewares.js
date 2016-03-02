import { STORAGE_KEY } from './store'
import Vuex from '../../../src'

const localStorageMiddleware = {
  onMutation (mutation, { todos }) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

export default process.env.NODE_ENV !== 'production'
  ? [Vuex.createLogger(), localStorageMiddleware]
  : [localStorageMiddleware]
