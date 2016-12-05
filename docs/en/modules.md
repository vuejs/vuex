# Modules

Due to using a single state tree, all state of our application is contained inside one big object. However, as our application grows in scale, the store can get really bloated.

To help with that, Vuex allows us to divide our store into **modules**. Each module can contain its own state, mutations, actions, getters, and even nested modules - it's fractal all the way down:

``` js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA's state
store.state.b // -> moduleB's state
```

### Module Local State

Inside a module's mutations and getters, The first argument received will be **the module's local state**.

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment: (state) {
      // state is the local module state
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

Similarly, inside module actions, `context.state` will expose the local state, and root state will be exposed as `context.rootState`:

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOdd ({ state, commit }) {
      if (state.count % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

Also, inside module getters, the root state will be exposed as their 3rd argument:

``` js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### Namespacing

Note that actions, mutations and getters inside modules are still registered under the **global namespace** - this allows multiple modules to react to the same mutation/action type. You can namespace the module assets yourself to avoid name clashing by prefixing or suffixing their names. And you probably should if you are writing a reusable Vuex module that will be used in unknown environments. For example, we want to create a `todos` module:

###### types.js
``` js
// define names of getters, actions and mutations as constants
// and they are prefixed by the module name `todos`
export const DONE_COUNT = 'todos/DONE_COUNT'
export const FETCH_ALL = 'todos/FETCH_ALL'
export const TOGGLE_DONE = 'todos/TOGGLE_DONE'
```

###### modules/todos.js
``` js
import * as types from '../types'

// define getters, actions and mutations using prefixed names
const todosModule = {
  state: { todos: [] },

  getters: {
    [types.DONE_COUNT] (state) {
      // ...
    }
  },

  actions: {
    [types.FETCH_ALL] (context, payload) {
      // ...
    }
  },

  mutations: {
    [types.TOGGLE_DONE] (state, payload) {
      // ...
    }
  }
}
```

###### components/SomeComponent.vue  
``` js
<script>
import { mapGetters, mapActions } from 'vuex'
import * as types from '../types'

export default {
  computed: {
    ...mapGetters({
      doneCount: types.DONE_COUNT
    })
  },
  methods: {
    ...mapActions({
      fetchAllTodos: types.FETCH_ALL
    })
  }
}
</script>
```

### Dynamic Module Registration

You can register a module **after** the store has been created with the `store.registerModule` method:

``` js
store.registerModule('myModule', {
  // ...
})
```

The module's state will be exposed as `store.state.myModule`.

Dynamic module registration makes it possible for other Vue plugins to also leverage Vuex for state management by attaching a module to the application's store. For example, the [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) library integrates vue-router with vuex by managing the application's route state in a dynamically attached module.

You can also remove a dynamically registered module with `store.unregisterModule(moduleName)`. Note you cannot remove static modules (declared at store creation) with this method.
