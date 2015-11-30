import { STORAGE_KEY } from './index'
import logger from '../../../src/middlewares/logger'

const localStorageMiddleware = {
  onMutation (mutation, { todos }) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

export default [
  localStorageMiddleware,
  logger({ collapsed: true })
]
