<script>
export default {
  data () {
    return {
      todo: {},
      editing: false
    }
  },
  directives: {
    focus (value) {
      if (value) {
        this.vm.$nextTick(() => {
          this.el.focus()
        })
      }
    }
  },
  methods: {
    toggle: function (todo) {
      this.$actions.toggleTodo(todo)
    },
    remove: function (todo) {
      this.$actions.deleteTodo(todo)
    },
    doneEdit (e) {
      var value = e.target.value.trim()
      if (!value) {
        this.$actions.deleteTodo(this.todo)
      } else if (this.editing) {
        this.$actions.editTodo(this.todo, value)
        this.editing = false
      }
    },
    cancelEdit (e) {
      e.target.value = this.todo.text
      this.editing = false
    }
  }
}
</script>

<template>
  <li class="todo" v-class="completed: todo.done, editing: editing">
    <div class="view">
      <input class="toggle"
        type="checkbox"
        checked="{{todo.done}}"
        v-on="change: toggle(todo)">
      <label v-text="todo.text"
        v-on="dblclick: editing = true">
      </label>
      <button
        class="destroy"
        v-on="click: remove(todo)">
      </button>
    </div>
    <input class="edit"
      v-show="editing"
      v-focus="editing"
      value="{{todo.text}}"
      v-on="keyup: doneEdit | key 'enter',
            keyup: cancelEdit | key 'esc',
            blur: doneEdit">
  </li>
</template>
