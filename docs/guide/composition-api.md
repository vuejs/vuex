# Composition API

When creating Vue Component with Composition API, you may use `useStore` composition function to retrieve the store.

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
  }
}
```

By calling the `useStore` composition function, you'll retrieve the store, which is equivalent to referencing `this.$store` in Option API.

## Accessing State and Getters

When accessing states and getters, remember to wrap them within `computed` function to retain the reactivity. It's as same as how you would reference them inside `computed` property in Option API Vue Component.

```js
import { computed } from 'vuex'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // access a state in computed function
      count: computed(() => store.state.count),

      // access a getter in computed function
      double: computed(() => store.getters.double)
    }
  }
}
```

## Accessing Mutations and Actions

When accessing mutations and actions, you may simply call `commit` and `dispatch` method inside the `setup` hook.

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // access a mutation
      increment: () => store.commit('increment'),

      // access an action
      asyncIncrement: () => store.dispatch('asyncIncrement')
    }
  }
}
```

## Examples

Check out [Composition API Example](https://github.com/vuejs/vuex/tree/4.0/examples/composition) to see the example application built with Vuex and Vue Composition API.
