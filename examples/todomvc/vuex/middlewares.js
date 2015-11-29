import { STORAGE_KEY } from './index'

export default [{
  after: function (action, state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
  }
}]
