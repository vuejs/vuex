# Mutations

Vuex mutations are essentially events: each mutation has a **name** and a **handler**. The handler function always gets the entire state tree as the first argument:

``` js
import Vuex from 'vuex'

const vuex = new Vuex({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state) {
      // mutate state
      state.count++
    }
  }
})
```

Using all caps for mutation names is just a convention to make it easier to differentiate them from actions.

You cannot directly call a mutation handler. The options here is more like event registration: "When an `INCREMENT` event is dispatched, call this handler." To invoke a mutation handler, you need to dispatch a mutation event:

``` js
vuex.dispatch('INCREMENT')
```

### Dispatch with Arguments

It is also possible to pass along arguments:

``` js
// ...
mutations: {
  INCREMENT (state, n) {
    state.count += n
  }
}
```
``` js
vuex.dispatch('INCREMENT', 10)
```

Here `10` will be passed to the mutation handler as the second argument following `state`. Same for any additional arguments. These arguments are called the **payload** for the given mutation.

### Using Constants for Mutation Names

It is also common to use constants for mutation names - they allow the code to take advantage of tooling like linters, and putting all constants in a single file allows your collaborators to get an at-a-glance view of what mutations are possible in the entire application:

``` js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

``` js
// vuex.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const vuex = new Vuex({
  state: { ... },
  actiosn: { ... },
  mutations: {
    // we can use the ES2015 computed property name feature
    // to use a constant as the function name
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

Whether to use constants is largely a preference - it can be helpful in large projects with many developers, but it's totally optional if you don't like them.

### On to Actions

Manually calling `vuex.dispatch` is possible, but in practice, we will rarely do this in our component code. Most of the time we will be calling [actions](actions.md), which can encapsulate more complex logic such as async data fetching.

Also, one important rule to remember: all mutation handlers must be **synchronous**. Any async operations belong in actions.
