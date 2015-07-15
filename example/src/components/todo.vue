<script>
export default {
  data() {
    return {
      editing: false
    }
  },
  directives: {
    focus(value) {
      if (value) {
        this.vm.$nextTick(() => {
          this.el.focus()
        })
      }
    }
  }
}
</script>

<template>
  <li v-class="done:todo.done">
    <input type="checkbox" checked="{{todo.done}}"
      v-on="change:TOGGLE_TODO(todo)">
    <span
      v-show="!editing"
      v-on="dblclick: editing=!editing">
      {{todo.text}}</span>
    <input v-show="editing"
      v-focus="editing"
      value="{{todo.text}}"
      v-on="
        change: EDIT_TODO(todo, $event.target.value),
        change: editing=false,
        blur: editing=false">
  </li>
</template>
