import flux from '../flux'

export const todoStore = flux.createStore('todos', {
  filter: 'all',
  todos: [{
    text: 'Vuex',
    done: false
  },
  {
    text: 'Flux',
    done: true
  }]
})

todoStore.on('ADD_TODO', function (text) {
  this.state.todos.push({
    text: text,
    done: false
  })
})

todoStore.on('DELETE_TODO', function (todo) {
  this.state.todos.$remove(todo)
})

todoStore.on('TOGGLE_TODO', function (todo) {
  todo.done = !todo.done
})

todoStore.on('EDIT_TODO', function (todo, text) {
  todo.text = text
})

todoStore.on('TOGGLE_ALL_TODOS', function (done) {
  this.state.todos.forEach((todo) => {
    todo.done = done
  })
})

todoStore.on('CLEAR_DONE_TODOS', function () {
  this.state.todos = this.state.todos.filter(todo => !todo.done)
})

todoStore.on('SET_FILTER', function (filter) {
  this.state.filter = filter
})
