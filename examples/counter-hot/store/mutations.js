export const increment = state => {
  state.count++
}

export const decrement = state => {
  state.count--
}

export const pushToHistory = (state, item) => {
  state.history.push(item)
}
