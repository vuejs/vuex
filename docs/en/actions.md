# Actions

> Vuex actions are in fact "action creators" in vanilla flux definitions, but I find that term more confusing than useful.

Actions are just functions that dispatch mutations. By convention, Vuex actions always expect a store instance as its first argument, followed by optional additional arguments:

``` js
// the simplest action
function increment (store) {
  store.dispatch('INCREMENT')
}

// a action with additional arguments
// with ES2015 argument destructuring
function incrementBy ({ dispatch }, amount) {
  dispatch('INCREMENT', amount)
}
```

This may look dumb at first sight: why don't we just dispatch mutations directly? Well, remember that **mutations must be synchronous**? Actions don't. We can perform **asynchronous** operations inside an action:

``` js
function incrementAsync ({ dispatch }) {
  setTimeout(() => {
    dispatch('INCREMENT')
  }, 1000)
}
```

A more practical example would be an action to checkout a shopping cart, which involves **calling an async API** and **dispatching multiple mutations**:

``` js
function checkout ({ dispatch, state }, products) {
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
```

Note that instead of expecting returns values or passing callbacks to actions, the result of calling the async API is handled by dispatching mutations as well. The rule of thumb is that **the only side effects produced by calling actions should be dispatched mutations**.

### Calling Actions In Components

You may have noticed that action functions are not directly callable without reference to a store instance. Technically, we can invoke an action by calling `action(this.$store)` inside a method, but it's better if we can directly expose "bound" versions of actions as the component's methods so that we can easily refer to them inside templates. We can do that using the `vuex.actions` option:

``` js
// inside a component
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... }, // state getters
    actions: {
      incrementBy // ES6 object literal shorthand, bind using the same name
    }
  }
})
```

What the above code does is to bind the raw `incrementBy` action to the component's store instance, and expose it on the component as an instance method, `vm.incrementBy`. Any arguments passed to `vm.incrementBy` will be passed to the raw action function after the first argument which is the store, so calling:

``` js
vm.incrementBy(1)
```

is equivalent to:

``` js
incrementBy(vm.$store, 1)
```

But the benefit is that we can bind to it more easily inside the component's template:

``` html
<button v-on:click="incrementBy(1)">increment by one</button>
```

You can obviously use a different method name when binding actions:

``` js
// inside a component
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions: {
      plus: incrementBy // bind using a different name
    }
  }
})
```

Now the action will be bound as `vm.plus` instead of `vm.incrementBy`.

### Inline Actions

If an action is specific to a component, you can take the shortcut and just define it inline:

``` js
const vm = new Vue({
  vuex: {
    getters: { ... },
    actions: {
      plus: ({ dispatch }) => dispatch('INCREMENT')
    }
  }
})
```

### Binding All Actions

If you simply want to bind all the shared actions:

``` js
import * as actions from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions // bind all actions
  }
})
```

### Arrange Actions in Modules

Normally in large applications, actions should be arranged in groups/modules for different purposes. For example, userActions module deals with user registration, login, logout, and so on, while shoppingCartActions module deals with other tasks for shopping.

Modularization is more convenient for different components to import only required actions.

You may import action module into action module for reusability.

```javascript
// errorActions.js
export const setError = ({dispatch}, error) => {
  dispatch('SET_ERROR', error)
}
export const showError = ({dispatch}) => {
  dispatch('SET_ERROR_VISIBLE', true)
}
export const hideError = ({dispatch}) => {
  dispatch('SET_ERROR_VISIBLE', false)
}
```

```javascript
// userActions.js
import {setError, showError} from './errorActions'

export const login = ({dispatch}, username, password) => {
  if (username && password) {
    doLogin(username, password).done(res => {
      dispatch('SET_USERNAME', res.username)
      dispatch('SET_LOGGED_IN', true)
      dispatch('SET_USER_INFO', res)
    }).fail(error => {
      dispatch('SET_INVALID_LOGIN')
      setError({dispatch}, error)
      showError({dispatch})
    })
  }
}

```

While calling actions from another module, or while calling another action in the same module, remember that actions take a store instance as its first argument, so the action called inside another action should be passed through the first argument for the caller.

If you write the action with ES6 destructuring style, make sure that the first argument of the caller action covers all the properties and methods of both actions. For example, only *dispatch* is used in the caller action and *state*, *watch* are used in the called action, all the *dispatch*, *state* and *watch* should be presented in the caller first formal argument like this:

```javascript
import {callee} from './anotherActionModule'

export const caller = ({dispatch, state, watch}) => {
  dispatch('MUTATION_1')
  callee({state, watch})
}
```

Otherwise, you should use the old-fashioned function syntax:

```javascript
import {callee} from './anotherActionModule'

export const caller = (store) => {
  store.dispatch('MUTATION_1')
  callee(store)
}
```
