# Form Handling

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cqKRgEC9" target="_blank" rel="noopener noreferrer">Try this lesson on Scrimba</a></div>

## Two-way Computed Property

The simpliest approach to handling form inputs within a component is to use a two-way computed property with a getter and setter:

``` html
<input v-model="message">
```

``` js
// ...
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```


## Strict Mode and the "Vuex Way"

When using Vuex in strict mode, it could be a bit tricky to use `v-model` on a piece of state that belongs to Vuex:

``` html
<input v-model="obj.message">
```

Assuming `obj` is a computed property that returns an Object from the store, the `v-model` here will attempt to directly mutate `obj.message` when the user types in the input. In strict mode, this will result in an error because the mutation is not performed inside an explicit Vuex mutation handler.

The "Vuex way" to deal with it is binding the `<input>`'s value and call a method on the `input` or `change` event:

``` html
<input :value="message" @input="updateMessage">
```

``` js
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```

And here's the mutation handler:

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```
