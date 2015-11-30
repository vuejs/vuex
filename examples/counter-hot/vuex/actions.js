import { INCREMENT, DECREMENT } from './mutation-types'

export default {

  increment: INCREMENT,
  decrement: DECREMENT,

  incrementIfOdd: () => (dispatch, state) => {
    if ((state.count + 1) % 2 === 0) {
      dispatch(INCREMENT)
    }
  },

  incrementAsync: () => dispatch => {
    setTimeout(() => {
      dispatch(INCREMENT)
    }, 1000)
  }
}
