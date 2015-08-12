const name = 'todos'

const state = {
  visibility: 'all',
  todos: [{
    text: 'Vuex',
    done: false
  },
  {
    text: 'Flux',
    done: true
  }]
}

const actions = {

  addTodo: (text) => {
    state.todos.unshift({
      text: text,
      done: false
    })
  },

  deleteTodo: (todo) => {
    state.todos.$remove(todo)
  },

  toggleTodo: (todo) => {
    todo.done = !todo.done
  },

  editTodo: (todo, text) => {
    todo.text = text
  },

  toggleAllTodos: (done) => {
    state.todos.forEach((todo) => {
      todo.done = done
    })
  },

  clearCompletedTodos: () => {
    state.todos = state.todos.filter(todo => !todo.done)
  },

  setVisibility: (visibility) => {
    state.visibility = visibility
  }
}

export default { name, state, actions }
