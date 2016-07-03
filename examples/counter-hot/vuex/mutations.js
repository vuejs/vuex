export const increment = state => {
  state.count++
  state.history.push('increment')
}

export const decrement = state => {
  state.count--
  state.history.push('decrement')
}
