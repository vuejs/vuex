# Form Handling

When using Vuex in strict mode, it could be a bit tricky to use `v-model` on a piece of state that belongs to Vuex:

``` html
<input v-model="obj.message">
```

Assuming `obj` is a computed property that returns an Object from the store, the `v-model` here will attempt to directly mutate `obj.message` when the user types in the input. In strict mode, this will result in an error because the mutation is not performed inside an explicit Vuex mutation handler.

The "Vuex way" to deal with it is binding the `<input>`'s value and call an action on the `input` or `change` event:

``` html
<input :value="message" @input="updateMessage">
```
``` js
// ...
vuex: {
  getters: {
    message: state => state.obj.message
  },
  actions: {
    updateMessage: ({ dispatch }, e) => {
      dispatch('UPDATE_MESSAGE', e.target.value)
    }
  }
}
```

And here's the mutation handler:

``` js
// ...
mutations: {
  UPDATE_MESSAGE (state, message) {
    state.obj.message = message
  }
}
```

Admittedly, this is quite a bit more verbose than a simple `v-model`, but such is the cost of making state changes explicit and track-able. At the same time, do note that Vuex doesn't demand putting all your state inside a Vuex store - if you do not wish to track the mutations for form interactions at all, you can simply keep the form state outside of Vuex as component local state, which allows you to freely leverage `v-model`.
