# Getters

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/c2Be7TB" target="_blank" rel="noopener noreferrer">Try this lesson on Scrimba</a></div>

Sometimes we may need to compute derived state based on store state, for example filtering through a list of items and counting them:

```js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

If more than one component needs to make use of this, we have to either duplicate the function, or extract it into a shared helper and import it in multiple places - both are less than ideal.

Vuex allows us to define "getters" in the store. You can think of them as computed properties for stores.

::: warning WARNING
As of Vue 3.0, the getter's result is **not cached** as the computed property does. This is a known issue that requires Vue 3.1 to be released. You can learn more at [PR #1878](https://github.com/vuejs/vuex/pull/1883).
:::

Getters will receive the state as their 1st argument:

```js
const store = createStore({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos(state) {
      return state.todos.filter((todo) => todo.done)
    }
  }
})
```

## Property-Style Access

The getters will be exposed on the `store.getters` object, and you access values as properties:

```js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getters will also receive other getters as the 2nd argument:

```js
getters: {
  // ...
  doneTodosCount (state, getters) {
    return getters.doneTodos.length
  }
}
```

```js
store.getters.doneTodosCount // -> 1
```

We can now easily make use of it inside any component:

```js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

Note that getters accessed as properties are cached as part of Vue's reactivity system.

## Method-Style Access

You can also pass arguments to getters by returning a function. This is particularly useful when you want to query an array in the store:

```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find((todo) => todo.id === id)
  }
}
```

```js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

Note that getters accessed via methods will run each time you call them, and the result is not cached.

## The `mapGetters` Helper

The `mapGetters` helper simply maps store getters to local computed properties:

```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter'
      // ...
    ])
  }
}
```

If you want to map a getter to a different name, use an object:

```js
...mapGetters({
  // map `this.doneCount` to `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```

## The `useGetters` Helper

This works the same way as the `mapGetters` helper but is compatible with the composition API `setup()` function.

```js
import { useGetters } from "vuex";

export default {
  setup() {

    const { doneTodosCount, anotherGetter } = useGetters(["doneTodosCount", "anotherGetter"])

    return {
      doneTodosCount,
      anotherGetter
    };
  },
```

or object destructuring

```js
import { useGetters } from 'vuex'

export default {
  setup() {
    return {
      ...useGetters(['doneTodosCount', 'anotherGetter'])
    }
  }
}
```

You can learn more in the [Composition API](./composition-api#New-helper-methods-for-Composition-API) section.
