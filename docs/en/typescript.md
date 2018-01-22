# TypeScript Support

## Utility Types for Modules

Vuex provides some utility types to help you to declare modules in TypeScript. They avoid runtime errors when using state, getters, mutations and actions in a module thanks to type checking.

To use the utility types, you should declare module assets types at first. Following is a simple example of counter module types:

```ts
// State type
export interface CounterState {
  count: number
}

// Getters type
// key: getter name
// value: return type of getter
export interface CounterGetters {
  power: number
}

// Mutations type
// key: mutation name
// value: payload type of mutation
export interface CounterMutations {
  increment: { amount: number }
}

// Actions type
// key: action name
// value: payload type of action
export interface CounterActions {
  incrementAsync: { amount: number, delay: number }
}
```

The state type must describe an actual state shape. The `CounterState` in the example indicates that the module's state has `count` property which must fulfill `number` type.

The getters type describes what getter names exist in the module according to keys. The corresponding value type shows what type the getter returns. The `CounterGetters` in the example indicates that the module has a getter named `power` and it returns a value of type `number`.

Both the actions and mutations type describe what thier names exist in the module as same as getters type. The value type of them indicates the payload type. The `CounterMutations` illustrates that the module has `increment` mutation and its payload is an object having `amount` property of type `number`, while the `CounterActions` shows there is `incrementAsync` action with an object payload having `amount` and `delay` property of type `number` in the module.

After declare the module assets types, you import `DefineModule` utility type and annotate the module with it:

```ts
import { DefineModule } from 'vuex'

// Implementation of counter module
export const counter: DefineModule<CounterState, CounterGetters, CounterMutations, CounterActions> = {
  namespaced: true,

  // Follow CounterState
  state: {
    count: 0
  },

  // Follow CounterGetters
  getters: {
    power: state => state.count * state.count
  },

  // Follow CounterMutations
  mutations: {
    increment (state, payload) {
      state.count += payload.amount
    }
  },

  // Follow CounterActions
  actions: {
    incrementAsync ({ commit }, payload) {
      setTimeout(() => {
        commit('increment', { amount: payload.amount })
      }, payload.delay)
    }
  }
}
```

Note that all function arguments types are infered without manually annotating them including `dispatch` and `commit` in the action context. If you try to dispach an action (commit a mutation) that does not exist or the payload type is not valid on the declared types, it throws a compilation error:

### Using external modules in the same namespace

Sometimes you may want to use external modules' getters, actions and mutations in the same namespace. In that case, you can pass the external module assets types to `DefineModule` generic parameters to extend the module type:

```ts
// External module assets types
// You may import them from another file on a practical code
interface ExternalGetters {
  extraValue: number
}

interface ExternalMutations {
  loading: boolean
}

interface ExternalActions {
  sendTrackingData: { name: string, value: string }
}

export const counter: DefineModule<
  // The first 4 type parameters are for module assets
  CounterState,
  CounterGetters,
  CounterMutations,
  CounterActions,

  // 3 type parameters that follows the module assets types are external module assets types
  ExternalGetters,
  ExternalMutations,
  ExternalActions
> = {
  namespaced: true,

  state: { /* ... */ },
  mutations: { /* ... */ },

  getters: {
    power (state, getters) {
      // You can use a getter from the external module
      console.log(getters.extraValue)
      return state.count * state.count
    }
  },

  actions: {
    incrementAsync ({ commit, dispatch }, payload) {
      // Using the external action
      dispatch('sendTrackingData', {
        name: 'increment',
        value: payload.amount
      })

      // Using the external mutation
      commit('loading', true)      
      setTimeout(() => {
        commit('increment', { amount: payload.amount })
        commit('loading', false)
      }, payload.delay)
    }
  }
}
```

### Using the root state, getters, actions and mutations

If you want to use root state, getters, actions and mutations, you can pass root assets types following external assets types on `DefineModule`:

```ts
export const counter: DefineModule<
  CounterState,
  CounterGetters,
  CounterMutations,
  CounterActions,

  // You can use `{}` type if you will not use them
  {}, // External getters
  {}, // External mutations
  {}, // External actions

  // Root types can be specified after external assets types
  RootState,
  RootGetters,
  RootMutations,
  RootActions
> = {
  /* ... module implementation ... */
}
```

## Typed Component Binding Helpers

You probably want to use fully typed `state`, `getters`, `dispatch` and `commit` not only in modules but also from components. You can use `createNamespacedHelpers` to use typed module assets on components. The `createNamespacedHelpers` accepts 4 generic parameters to annotate returned `mapState`, `mapGetters`, `mapMutations` and `mapActions` by using module assets types:

```ts
export const counterHelpers = createNamespacedHelpers<CounterState, CounterGetters, CounterMutations, CounterActions>('counter')
```

All the returned helpers and mapped computed properties and methods will be type checked. You can use them without concerning typos and invalid payload by yourself:

```ts
export default Vue.extend({
  computed: counterHelpers.mapState({
    value: 'count'
  }),

  methods: counterHelpers.mapMutations({
    inc: 'increment'
  }),

  created () {
    // These are correctly typed!
    this.inc({ amount: 1 })
    console.log(this.value)
  }
})
```

### Annotating Root Binding Helpers

`createNamespacedHelpers` is made for generating new component binding helpers focusing a namespaced module. The API however is useful to create typed root binding helpers. So if you need them, you call `createNamespacedHelpers` without passing namespace:

```ts
const rootHelpers = createNamespacedHelpers<RootState, RootGetters, RootMutations, RootActions>()
```

## Explicit Payload

While regular (not strictly typed) `dispatch` and `commit` can omit a payload, typed ones does not allow to omit its payload. This is because to ensure type safety of a payload. If you want to declare actions / mutations that do not have a payload you should explicitly pass `undefined` value.

```ts
export interface CounterMutation {
  // This indicates the `increment` action does not have a payload
  increment: undefined
}

// ...
export const counter: DefineModule<CounterState, CounterGetters, CounterMutations, CounterActions> = {
  // ...

  actions: {
    someAction ({ commit }) {
      // Passing `undefined` value explicitly
      commit('increment', undefined)
    }
  }
}
```
