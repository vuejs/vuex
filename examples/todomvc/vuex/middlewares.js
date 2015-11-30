import { STORAGE_KEY } from './index'

const localStorageMiddleware = {
  onMutation (mutation, { todos }) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

export default [
  localStorageMiddleware
]
