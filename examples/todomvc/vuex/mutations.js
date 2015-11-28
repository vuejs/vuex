export default {
  ADD_TODO (state, text) {
    state.todos.unshift({
      text: text,
      done: false
    })
  },

  DELETE_TODO (state, todo) {
    state.todos.$remove(todo)
  },

  TOGGLE_TODO (state, todo) {
    todo.done = !todo.done
  },

  EDIT_TODO (state, todo, text) {
    todo.text = text
  },

  TOGGLE_ALL (state, done) {
    state.todos.forEach((todo) => {
      todo.done = done
    })
  },

  CLEAR_COMPLETED (state) {
    state.todos = state.todos.filter(todo => !todo.done)
  }
}
