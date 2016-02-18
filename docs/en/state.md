# State

### Single State Tree

Vuex uses a **single state tree** - that is, this single object contains all your application level state and serves as the "single source of truth". This also means usually you will have only one store for each application. A single state tree makes it straightforward to locate a specific piece of state, and allows us to easily take snapshots of the current app state for debugging purposes.

The single state tree does not conflict with modularity - in later chapters we will discuss how to split your state and mutations into sub modules.

### Getting Vuex State into Vue Components

So how do we display state inside the store in our Vue components? Here's how:

1. Install Vuex and connect your root component to the store:

  ``` js
  import Vue from 'vue'
  import Vuex from 'vuex'
  import store from './store'
  import MyComponent from './MyComponent'

  // important, teaches Vue components how to
  // handle Vuex-related options
  Vue.use(Vuex)

  var app = new Vue({
    el: '#app',
    // provide the store using the "store" option.
    // this will inject the store instance to all child components.
    store,
    components: {
      MyComponent
    }
  })
  ```

2. Inside child components, retrieve state using the `vuex.state` option:

  ``` js
  // MyComponent.js
  export default {
    template: '...',
    data () { ... },
    // this is where we retrieve state from the store
    vuex: {
      state: {
        // will bind `store.state.count` on the component as `this.count`
        count: function (state) {
          return state.count
        }
      }
    }
  }
  ```

  Note the special `vuex` option block. This is where we specify what state the component will be using from the store. For each property name, we specify a function which receives the entire state tree as the only argument, and then selects and returns a part of the state, or even computes derived state. The returned result will be set on the component using the property name.

  In a lot of cases, the "getter" function can be very succinct using ES2015 arrow functions:

  ``` js
  vuex: {
    state: {
      count: state => state.count
    }
  }
  ```

> Flux reference: this can be roughly compared to [`mapStateToProps`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) in Redux. However, this leverages Vue's computed properties memoization under the hood, thus is more efficient than `mapStateToProps`, and more similar to [reselect](https://github.com/reactjs/reselect) and [NuclearJS getters](https://optimizely.github.io/nuclear-js/docs/04-getters.html).

### Components Are Not Allowed to Directly Mutate State

It's important to remember that **components should never directly mutate Vuex store state**. Because we want every state mutation to be explicit and trackable, all vuex store state mutations must be conducted inside the store's mutation handlers.

To help enforce this rule, when in [Strict Mode](strict.md), if a store's state is mutated outside of its mutation handlers, Vuex will throw an error.

With this rule in place, our Vue components now hold a lot less responsibility: they are bound to Vuex store state via read-only getters, and the only way for them to affect the state is by somehow triggering **mutations** (which we will discuss later). They can still possess and operate on their local state if necessary, but we no longer put any data-fetching or global-state-mutating logic inside individual components.
