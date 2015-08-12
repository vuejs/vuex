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

  ADD_TODO: (text) => {
    state.todos.unshift({
      text: text,
      done: false
    })
  },

  DELETE_TODO: (todo) => {
    state.todos.$remove(todo)
  },

  TOGGLE_TODO: (todo) => {
    todo.done = !todo.done
  },

  EDIT_TODO: (todo, text) => {
    todo.text = text
  },

  TOGGLE_ALL_TODOS: (done) => {
    state.todos.forEach((todo) => {
      todo.done = done
    })
  },

  CLEAR_COMPLETED_TODOS: () => {
    state.todos = state.todos.filter(todo => !todo.done)
  },

  SET_VISIBILITY: (visibility) => {
    state.visibility = visibility
  }
}

export default { name, state, actions }
