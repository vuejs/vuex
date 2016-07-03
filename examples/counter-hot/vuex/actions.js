export const increment = ({ dispatch }) => dispatch('increment')
export const decrement = ({ dispatch }) => dispatch('decrement')

export const incrementIfOdd = ({ dispatch, state }) => {
  if ((state.count + 1) % 2 === 0) {
    dispatch('increment')
  }
}

export const incrementAsync = ({ dispatch }) => {
  setTimeout(() => {
    dispatch('decrement')
  }, 1000)
}
