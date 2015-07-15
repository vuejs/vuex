<script>
var todoStore = require('../stores/todos')
var TodoComponent = require('./todo.vue')

var filters = {
  all: function (todos) {
    return todos
  },
  done: function (todos) {
    return todos.filter(function (todo) {
      return todo.done
    })
  },
  notDone: function (todos) {
    return todos.filter(function (todo) {
      return !todo.done
    })
  }
}

module.exports = {
  data: function () {
    return todoStore.state
  },
  components: {
    todo: TodoComponent
  },
  computed: {
    allChecked: function () {
      return this.todos.every(function (todo) {
        return todo.done
      })
    },
    filteredTodos: function () {
      return filters[this.filter](this.todos)
    }
  }
}
</script>

<template>
  <div>
    <input type="checkbox"
      checked="{{allChecked}}"
      v-on="change:TOGGLE_ALL_TODOS(!allChecked)">
    <ul class="todo-list">
      <todo v-repeat="todo:filteredTodos"></todo>
    </ul>
    <p>
      <a v-class="active:filter==='all'"
        v-on="click:SET_FILTER('all')">all</a>
      <a v-class="active:filter==='done'"
        v-on="click:SET_FILTER('done')">done</a>
      <a v-class="active:filter==='notDone'"
        v-on="click:SET_FILTER('notDone')">not done</a>
    </p>
  </div>
</template>
