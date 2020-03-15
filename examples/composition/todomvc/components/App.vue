<style src="todomvc-app-css/index.css"></style>

<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="What needs to be done?"
        @keyup.enter="addTodo">
    </header>
    <!-- main section -->
    <section class="main" v-show="todos.length">
      <input class="toggle-all" id="toggle-all"
        type="checkbox"
        :checked="allChecked"
        @change="toggleAll(!allChecked)">
      <label for="toggle-all"></label>
      <ul class="todo-list">
        <TodoItem
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
        />
      </ul>
    </section>
    <!-- footer -->
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ pluralize(remaining, 'item') }} left
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters">
          <a :href="'#/' + key"
            :class="{ selected: visibility === key }"
            @click="visibility = key">{{ capitalize(key) }}</a>
        </li>
      </ul>
      <button class="clear-completed"
        v-show="todos.length > remaining"
        @click="clearCompleted">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import TodoItem from './TodoItem.vue'

const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.done),
  completed: todos => todos.filter(todo => todo.done)
}

export default {
  components: { TodoItem },
  setup () {
    const visibility = ref('all')

    const store = useStore()

    const todos = computed(() => store.state.todos)
    const allChecked = computed(() => todos.value.every(todo => todo.done))
    const filteredTodos = computed(() => filters[visibility.value](todos.value))
    const remaining = computed(() => todos.value.filter(todo => !todo.done).length)

    const toggleAll = (done) => store.dispatch('toggleAll', done)
    const clearCompleted = () => store.dispatch('clearCompleted')

    function addTodo (e) {
      const text = e.target.value
      if (text.trim()) {
        store.dispatch('addTodo', text)
      }
      e.target.value = ''
    }

    const pluralize = (n, w) => n === 1 ? w : (w + 's')
    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

    return {
      visibility,
      filters,
      todos,
      allChecked,
      filteredTodos,
      remaining,
      addTodo,
      clearCompleted,
      toggleAll,
      pluralize,
      capitalize
    }
  }
}
</script>
