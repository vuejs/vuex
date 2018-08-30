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
    // when edit some one todoItem, clear the todoItem, then press keyboard enter 
    // because execute @keyup.enter="doneEdit" and @keyup.esc="cancelEdit" (in page TodoItem.vue)
    // so here will execute twice, so will delete two todoItem
    // so i suggest change here to 
    state.todos = state.todos.filter(item => item.id !== todo.id)
    // state.todos.splice(state.todos.indexOf(todo), 1)
  },

  editTodo (state, { todo, text = todo.text, done = todo.done }) {
    todo.text = text
    todo.done = done
  }
}
