# Actions

Actions are functions that dispatch mutations. Actions can be asynchronous and a single action can dispatch multiple mutations.

An action expresses the intention for something to happen, and abstracts the details away from the component calling it. When a component wants to do something, it just calls an action - there's no need to worry about a callback or a return value, because actions result in state changes, and state changes will trigger the component's DOM to update - the component is completely decoupled from how that action is actually performed.

Therefore, we usually perform API calls to data endpoints inside actions, and hide the asynchronous details from both the Components calling the actions, and the mutations triggered by the actions.

> Vuex actions are in fact "action creators" in vanilla flux definitions, but I find that term more confusing than useful.

### Simple Actions

It is common that an action simply triggers a single mutation. Vuex provides a shorthand for defining such actions:

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state, x) {
      state.count += x
    }
  },
  actions: {
    // shorthand
    // just provide the mutation name.
    increment: 'INCREMENT'
  }
})
```

Now when we call the action:

``` js
store.actions.increment(1)
```

It simply calls the following for us:

``` js
store.dispatch('INCREMENT', 1)
```

Note any arguments passed to the action is also passed along to the mutation handler.

### Normal Actions

For actions that involve logic depending on current state, or that need async operations, we define them as functions. Action functions always get the store calling it as the first argument:

``` js
const vuex = new Vuex({
  state: {
    count: 1
  },
  mutations: {
    INCREMENT (state, x) {
      state += x
    }
  },
  actions: {
    incrementIfOdd: (store, x) => {
      if ((store.state.count + 1) % 2 === 0) {
        store.dispatch('INCREMENT', x)
      }
    }
  }
})
```

It is common to use ES6 argument destructuring to make the function body less verbose (here the `dispatch` function is pre-bound to the store instance so we don't have to call it as a method):

``` js
// ...
actions: {
  incrementIfOdd: ({ dispatch, state }, x) => {
    if ((state.count + 1) % 2 === 0) {
      dispatch('INCREMENT', x)
    }
  }
}
```

The string shorthand is essentially syntax sugar for the following:

``` js
actions: {
  increment: 'INCREMENT'
}
// ... equivalent to:
actions: {
  increment: ({ dispatch }, ...payload) => {
    dispatch('INCREMENT', ...payload)
  }
}
```

### Async Actions

We can use the same syntax for defining async actions:

``` js
// ...
actions: {
  incrementAsync: ({ dispatch }, x) => {
    setTimeout(() => {
      dispatch('INCREMENT', x)
    }, 1000)
  }
}
```

A more practical example is when checking out a shopping cart - we may need to trigger multiple mutations: one that signifies the checkout has started, one for success, and one for failure:

``` js
// ...
actions: {
  checkout: ({ dispatch, state }, products) => {
    // save the current in cart items
    const savedCartItems = [...state.cart.added]
    // send out checkout request, and optimistically
    // clear the cart
    dispatch(types.CHECKOUT_REQUEST)
    // the shop API accepts a success callback and a failure callback
    shop.buyProducts(
      products,
      // handle success
      () => dispatch(types.CHECKOUT_SUCCESS),
      // handle failure
      () => dispatch(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

Again, all the component needs to do to perform the entire checkout is just calling `vuex.actions.checkout(products)`.
