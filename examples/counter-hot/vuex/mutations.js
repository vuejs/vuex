import { INCREMENT, DECREMENT } from './mutation-types'

export default {
  [INCREMENT] (state) {
    state.count++
  },
  [DECREMENT] (state) {
    state.count--
  }
}
