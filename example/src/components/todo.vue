<script>
module.exports = {
  data: function () {
    return {
      editing: false
    }
  },
  directives: {
    focus: function (value) {
      if (value) {
        var el = this.el
        this.vm.$nextTick(function () {
          el.focus()
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
