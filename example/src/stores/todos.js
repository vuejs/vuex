var flux = require('../flux')
var store = flux.createStore('todos', {
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

store.on('ADD_TODO', function (text) {
  this.state.todos.push({
    text: text,
    done: false
  })
})

store.on('DELETE_TODO', function (todo) {
  this.state.todos.$remove(todo)
})

store.on('TOGGLE_TODO', function (todo) {
  todo.done = !todo.done
})

store.on('EDIT_TODO', function (todo, text) {
  todo.text = text
})

store.on('TOGGLE_ALL_TODOS', function (done) {
  this.state.todos.forEach(function (todo) {
    todo.done = done
  })
})

store.on('CLEAR_DONE_TODOS', function () {
  this.state.todos = state.todos.filter(function (todo) {
    return !todo.done
  })
})

store.on('SET_FILTER', function (filter) {
  this.state.filter = filter
})

module.exports = store
