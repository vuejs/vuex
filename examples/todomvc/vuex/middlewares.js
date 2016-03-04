import { STORAGE_KEY } from './store'
import createLogger from '../../../src/middlewares/logger'

const localStorageMiddleware = {
  onMutation (mutation, { todos }) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

export default process.env.NODE_ENV !== 'production'
  ? [createLogger(), localStorageMiddleware]
  : [localStorageMiddleware]
