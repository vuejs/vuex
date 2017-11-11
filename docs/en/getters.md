# Getters

Sometimes we may need to compute derived state based on store state, for example filtering through a list of items and counting them:

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

If more than one component needs to make use of this, we have to either duplicate the function, or extract it into a shared helper and import it in multiple places - both are less than ideal.

Vuex allows us to define "getters" in the store. You can think of them as computed properties for stores. Like computed properties, a getter's result is cached based on its dependencies, and will only re-evaluate when some of its dependencies have changed.

Getters are defined as functions, but they are accessed as properties.  Vuex `getters` follow a similar principle to regular JavaScript `get` functions defined using `Reflect.defineProperty`. 

``` js
//Example of regular JavaScript get function
Reflect.defineProperty(foo, 'bar', { 
  get(){ 
    return 'baz'; 
  } 
  //... 
});

``` 
When the property is accessed (e.g as `foo.bar`), the value is retrieved by invoking the defined getter function.  In the example above, the value `baz` is returned every time for `foo.bar`.

While `get` functions defined using JavaScript reflectivity are invoked every time the property is accessed, Vuex caches the value to improve performance.  It only recalculates the cached value when its dependencies change. This allows complex property retrievals to be more performant.  

Getters will receive the state as their 1st argument:

``` js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

On initialization, Vuex calls the function you defined for the `getter` to calculate the initial value.  During this first call, it determines the dependencies 'touched' during evaluation.  It then caches this initial value.  

If any of the getter's dependencies change, the function you provided is invoked again and the new value is cached.  

The getters will be exposed on the `store.getters` object:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getters will also receive other getters as the 2nd argument:

``` js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```

``` js
store.getters.doneTodosCount // -> 1
```

We can now easily make use of it inside any component:

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

You can also pass arguments to getters by returning a function. This is particularly useful when you want to query an array in the store:

```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```

``` js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

### The `mapGetters` Helper

To access getters inside Vue templates, mix them into your components as computed properties.  Then you can access your getters inside your components like you would any computed property.  The `mapGetters` helper simply maps store getters to local computed properties:

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

If you want to map a getter to a different name, use an object:

``` js
...mapGetters({
  // map `this.doneCount` to `store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```
