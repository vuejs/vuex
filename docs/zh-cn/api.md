# API Reference

### Constructor

``` js
import Vuex from 'vuex'

const vuex = new Vuex({ ...options })
```

### Constructor Options

- **state**
  
  - type: `Object`

    The root state object for the Vuex instance.

    [Details](state.md)

- **mutations**

  - type: `Object | Array<Object>`

    An object where each entry's key is the mutation name and the value is a mutation handler function. The handler function always receives `state` as the first argument, and receives all arguments passed to the dispatch call following that.

    If passing in an Array of Objects, these objects will be automatically merged together into one final object.

    [Details](mutations.md)

- **actions**

  - type: `Object | Array<Object>`

    An object where each entry's key is the action name and the value is either

    1. A mutation name string; or
    2. A thunk action creator function.

    Vuex will process these entries and create the actual callable action functions and expose them on the `actions` property of the instance.

    If passing in an Array of Objects, these objects will be automatically merged together into one final object.

    [Details](actions.md)

- **middlewares**

  - type: `Array<Object>`

    An array of middleware objects that are in the shape of:

    ``` js
    {
      snapshot: Boolean, // default: false
      onInit: Function,
      onMutation: Function
    }
    ```

    All fields are optional. [Details](middlewares.md)

- **strict**

  - type: `Boolean`
  - default: `false`

    Force the Vuex instance into strict mode. In strict mode any mutations to Vuex state outside of mutation handlers will throw en Error.

    [Details](strict.md)

### Instance Properties

- **state**

  - type: `Object`

    The root state. Read only.

- **actions**

  - type: `Object`

    The callable action functions.

### Instance Methods

- **dispatch(mutationName: String, ...args)**

  Directly dispatch a mutation. This is useful in certain situations are in general you should prefer using actions in application code.

- **hotUpdate(newOptions: Object)**

  Hot swap new actions and mutations. [Details](hot-reload.md)
