export const STORAGE_KEY = 'todos-vuejs'

// for testing
if (navigator.userAgent.indexOf('PhantomJS') > -1) {
  window.localStorage.clear()
}

export const mutations = {
  addTodo (state, todo) {
    state.todos.push(todo)
  },

  removeTodo (state, todo) {
    state.todos = state.todos.filter(item => item.id !== todo.id)
  },

  editTodo (state, { todo, text = todo.text, done = todo.done }) {
    todo.text = text
    todo.done = done
  }
}
