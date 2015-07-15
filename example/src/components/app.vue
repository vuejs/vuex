<script>
import flux from '../flux'
import todoStore from '../stores/todos'
import TodoComponent from './todo.vue'

const filters = {
  all: (todos) => todos,
  done: (todos) => todos.filter(todo => todo.done),
  notDone: (todos) => todos.filter(todo => !todo.done)
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
  <div>
    <input type="checkbox"
      checked="{{allChecked}}"
      v-on="change: TOGGLE_ALL_TODOS(!allChecked)">
    <input v-on="keyup: addTodo | key 'enter'">
    <ul class="todo-list">
      <todo v-repeat="todo: filteredTodos"></todo>
    </ul>
    <p>
      <a v-class="active: filter==='all'"
        v-on="click: SET_FILTER('all')">all</a>
      <a v-class="active: filter==='done'"
        v-on="click: SET_FILTER('done')">done</a>
      <a v-class="active: filter==='notDone'"
        v-on="click: SET_FILTER('notDone')">not done</a>
    </p>
    <button v-on="click: CLEAR_DONE_TODOS">Clear Done</button>
  </div>
</template>
