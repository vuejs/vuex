<script>
import flux from '../flux'

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
    doneEdit: function (e) {
      if (this.editing) {
        flux.dispatch('EDIT_TODO', this.todo, e.target.value)
        this.editing = false
      }
    },
    cancelEdit: function (e, todo) {
      e.target.value = todo.text
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
        v-on="change: TOGGLE_TODO(todo)">
      <label v-text="todo.text"
        v-on="dblclick: editing = true">
      </label>
      <button
        class="destroy"
        v-on="click: DELETE_TODO(todo)">
      </button>
    </div>
    <input class="edit"
      v-show="editing"
      v-focus="editing"
      value="{{todo.text}}"
      v-on="keyup: doneEdit | key 'enter',
            keyup: cancelEdit($event, todo) | key 'esc',
            blur: doneEdit">
  </li>
</template>
