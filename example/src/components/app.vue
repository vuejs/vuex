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
  mixins: [flux.mixin],
  data () {
    return {
      state: todoStore.state,
      filters: filters
    }
  },
  components: {
    todo: TodoComponent
  },
  computed: {
    allChecked () {
      return this.state.todos.every(todo => todo.done)
    },
    filteredTodos () {
      return filters[this.state.visibility](this.state.todos)
    },
    remaining () {
      return this.state.todos.filter(todo => !todo.done).length
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
    <section class="main" v-show="state.todos.length">
      <input class="toggle-all"
        type="checkbox"
        checked="{{allChecked}}"
        v-action="change: TOGGLE_ALL_TODOS(!allChecked)">
      <ul class="todo-list">
        <todo v-repeat="todo: filteredTodos"></todo>
      </ul>
    </section>
    <footer class="footer" v-show="state.todos.length">
      <span class="todo-count">
        <strong>{{remaining}}</strong>
        {{remaining | pluralize 'item'}} left
      </span>
      <ul class="filters">
        <li v-repeat="filters">
          <a href="#/{{$key}}"
            v-class="selected: state.visibility === $key"
            v-action="click: SET_VISIBILITY($key)">
            {{$key | capitalize}}
          </a>
        </li>
      </ul>
      <button class="clear-completed"
        v-show="state.todos.length > remaining"
        v-action="click: CLEAR_DONE_TODOS">
        Clear completed
      </button>
    </footer>
  </section>
</template>
