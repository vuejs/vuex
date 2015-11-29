import { STORAGE_KEY } from './index'

export default [function (mutation, { todos }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}]
