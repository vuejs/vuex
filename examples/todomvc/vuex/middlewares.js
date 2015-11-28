import { STORAGE_KEY } from './index'

export default [
  function (action, state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
  }
]
