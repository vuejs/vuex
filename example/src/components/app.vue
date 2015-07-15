<script>
import flux from '../flux'
import todoStore from '../stores/todos'
import TodoComponent from './todo.vue'

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter(todo => !todo.done),
  completed: (todos) => todos.filter(todo => todo.done)
}

export default {
  data () {
    return todoStore.state
  },
  components: {
    todo: TodoComponent
  },
  computed: {
    allChecked () {
      return this.todos.every(todo => todo.done)
    },
    filteredTodos () {
      return filters[this.filter](this.todos)
    },
    remaining () {
      return this.todos.filter(todo => !todo.done).length
    }
  },
  methods: {
    addTodo (e) {
      var text = e.target.value
      if (text.trim()) {
        flux.dispatch('ADD_TODO', text)
      }
      e.target.value = ''
    }
  }
}
</script>

<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="What needs to be done?"
        v-on="keyup: addTodo | key 'enter'">
    </header>
    <section class="main" v-show="todos.length">
      <input class="toggle-all"
        type="checkbox"
        checked="{{allChecked}}"
        v-on="change: TOGGLE_ALL_TODOS(!allChecked)">
      <ul class="todo-list">
        <todo v-repeat="todo: filteredTodos"></todo>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{remaining}}</strong>
        {{remaining | pluralize 'item'}} left
      </span>
      <ul class="filters">
        <li>
          <a href="#/all"
            v-class="selected: filter==='all'"
            v-on="click: SET_FILTER('all')">All</a>
        </li>
        <li>
          <a href="#/active"
            v-class="selected: filter==='active'"
            v-on="click: SET_FILTER('active')">Active</a>
        </li>
        <li>
          <a href="#/completed"
            v-class="selected: filter==='completed'"
            v-on="click: SET_FILTER('completed')">Completed</a>
        </li>
      </ul>
      <button class="clear-completed"
        v-show="todos.length > remaining"
        v-on="click: CLEAR_DONE_TODOS">
        Clear completed
      </button>
    </footer>
  </section>
</template>
