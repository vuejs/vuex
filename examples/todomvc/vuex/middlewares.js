import { STORAGE_KEY } from './index'
import { loggerMiddleware } from '../../../src'

const localStorageMiddleware = {
  onMutation (mutation, { todos }) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

export default [localStorageMiddleware, loggerMiddleware]
