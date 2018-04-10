export const increment = ({ commit }) => {
  commit('increment')
  commit('pushToHistory', 'increment')
}
export const decrement = ({ commit }) => {
  commit('decrement')
  commit('pushToHistory', 'decrement')
}

export const incrementIfOdd = ({ commit, state }) => {
  if ((state.count + 1) % 2 === 0) {
    commit('increment')
    commit('pushToHistory', 'increment')
  }
}

export const incrementAsync = ({ commit }) => {
  setTimeout(() => {
    commit('increment')
    commit('pushToHistory', 'decrement')
  }, 1000)
}
