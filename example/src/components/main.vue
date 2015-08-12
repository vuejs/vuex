<script>
import todoStore from '../stores/todos'
import TodoComponent from './todo.vue'

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter(todo => !todo.done),
  completed: (todos) => todos.filter(todo => todo.done)
}

export default {
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
        this.$dispatch('ADD_TODO', text)
      }
      e.target.value = ''
    },
    toggleAll: function () {
      this.$dispatch('TOGGLE_ALL_TODOS', !this.allChecked)
    },
    setVisibility: function (visibility) {
      this.$dispatch('SET_VISIBILITY', visibility)
    },
    clearCompleted: function () {
      this.$dispatch('CLEAR_COMPLETED_TODOS')
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
        v-on="change: toggleAll">
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
            v-on="click: setVisibility($key)">
            {{$key | capitalize}}
          </a>
        </li>
      </ul>
      <button class="clear-completed"
        v-show="state.todos.length > remaining"
        v-on="click: clearCompleted">
        Clear completed
      </button>
    </footer>
  </section>
</template>
