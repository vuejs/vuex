export default {
  createTodo ({ commit }, text) {
    commit('addTodo', text)
  },

  deleteTodo ({ commit }, todo) {
    commit('removeTodo', todo)
  },

  toggleTodo ({ commit }, todo) {
    commit('toggleTodo', todo)
  },

  updateTodo ({ commit }, { todo, value }) {
    commit('editTodo', { todo, value })
  },

  toggleAll ({ state, commit }, done) {
    commit('toggleAll', done)
  },

  clearCompleted ({ commit }) {
    commit('clearCompleted')
  }
}
