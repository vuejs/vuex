# Getters

Each getter is a function used to transform and compose the store data into a consumable format, either for the UI or another purpose. It returns a value computed from the store state:

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    values: [0, 9, 18]
  },
  getters: {
    total (state) {
      return state.values.reduce((a, b) => a + b)
    }
  }
})
```

Now `store.getters.total` function can be used in a Vue component similarly to state properties:

``` js
export default {
  computed: {
    total: store.getters.total
  }
}
```

### Getters in a Separated File

It's possible that multiple components will need the same computed property based on Vuex state. Since computed getters are just functions, you can split them out into a separate file so that they can be shared in any component via the store:

``` js
import Vue from 'vue'
import Vuex from '../../../src'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { /*...*/ },
  actions,
  mutations,
  getters
})
```

``` js
// getters.js
export function filteredTodos (state) {
  return state.messages.filter(message => {
    return message.threadID === state.currentThreadID
  })
}
```

``` js
// in a component...
import { getters } from './store'
const { filteredTodos } = getters

export default {
  computed: {
    filteredTodos
  }
}
```

For an actual example, check out the [Shopping Cart Example](https://github.com/vuejs/vuex/tree/master/examples/shopping-cart).
For an actual example with hot reload API, check out the [Counter Hot Example](https://github.com/vuejs/vuex/tree/master/examples/counter-hot).


This is very similar to [Getters in NuclearJS](https://optimizely.github.io/nuclear-js/docs/04-getters.html).
