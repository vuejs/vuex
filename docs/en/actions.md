# Actions

Actions are functions that dispatch mutations. Actions can be asynchronous and a single action can dispatch multiple mutations.

An action expresses the intention for something to happen, and abstracts the details away from the component calling it. When a component wants to do something, it just calls an action - there's no need to worry about a callback or a return value, because actions result in state changes, and state changes will trigger the component's DOM to update - the component is completely decoupled from how that action is actually performed.

> Vuex actions are in fact "action creators" in vanilla flux definitions, but I find that term more confusing than useful.

### Simple Actions

It is common that an action simply triggers a single mutation. Vuex provides a shorthand for defining such actions:

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
    // shorthand
    // just provide the mutation name.
    increment: 'INCREMENT'
  }
})
```

Now when we call the action:

``` js
vuex.actions.increment(1)
```

It simply calls the following for us:

``` js
vuex.dispatch('INCREMENT', 1)
```

Note any arguments passed to the action is also passed along to the mutation handler.

### Thunk Actions

How about actions that involve logic depending on current state, or that need async operations? We can define these actions as **thunks** - essentially functions that return another function:

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
    incrementIfOdd: function (x) {
      return function (dispatch, state) {
        if ((state.count + 1) % 2 === 0) {
          dispatch('INCREMENT', x)
        }
      }
    }
  }
})
```

Here, the outer function receives the arguments passed when calling the action. Then, it returns a function that gets 2 arguments: first is the `dispatch` function, and the second being the `state`. We are using ES5 syntax here to make things easier to understand. With ES2015 arrow functions we can "prettify" the above to the following:

``` js
// ...
actions: {
  incrementIfOdd: x => (dispatch, state) => {
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
  increment: (...args) => dispatch => dispatch('INCREMENT', ...args)
}
```

Why don't we just define the actions as simple functions that directly access `vuex.state` and `vuex.dispatch`? The reason is that couples the action functions to the specific vuex instance. By using the thunk syntax, our actions only depend on function arguments and nothing else - this important characteristic makes them easy to test and hot-reloadable!

### Async Actions

We can use the same thunk syntax for defining async actions:

``` js
// ...
actions: {
  incrementAsync: x => dispatch => {
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
  checkout: products => (dispatch, state) => {
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

Again, all the component needs to do to perform the entire checkout is just calling `vuex.actions,checkout(products)`.
