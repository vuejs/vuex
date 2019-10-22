# TypeScript

Vuex supports TypeScript for state, actions, mutations, getters **using the module system**

## Getting Started

To work with typed Vuex, we will need to define a RootState structure first. This will be needed in our modules later.

Define your `RootState` type.

```ts
export type RootState = {
  hello: string
}
```

And then, use it in your `main.ts` file, which is the entry point file of your Vuex store

```ts
import Vue from 'vue'
import Vuex from 'vuex'
import { RootState } from '~/store/types/RootState'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  state: {
    hello: 'world' // Typed
  }
})
```

Before creating the module, create a type structure for your module state

```ts
export type MyModuleState = {
  world: string
  list: string[]
}
```

Create the module file with the next structure using `MyModuleState` type and `RootState`

```ts
import { Module, ActionTree, MutationTree, GetterTree } from 'vuex'
import { RootState } from './RootState'

const state: MyModuleState = {
  world: 'hello',
  list: [] as string[]
}

const actions: ActionTree<MyModuleState, RootState> = {}

const mutations: MutationTree<MyModuleState> = {}

const getters: GetterTree<MyModuleState, RootState> = {}

export const MyModule: Module<MyModuleState, RootState> = {
  namespaced: true, // or false
  state,
  actions,
  mutations,
  getters
}
```

At last, import your module into your Vuex store instance:

```ts
import Vue from 'vue'
import Vuex from 'vuex'
import { RootState } from '~/store/types/RootState'
import { MyModule as mymodule } from './mymodule'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  state: {
    hello: 'world' // Typed
  },
  modules: {
    mymodule
  }
})
```

## State

Vuex states can be defined using [type aliases](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases).

### Example

```ts
type Pokemon = {
  order: number
  name: string
  exp: number
}

type MySuperType = {
  name: string
  pokemons: Pokemon[]
}

export const mystate: MySuperType = {
  name: '',
  pokemons: [] as Pokemon[]
}

```

## Actions

Actions can be used with the `ActionTree<S, R>` interface which `S` is the current store type and `R` corresponds to the `RootState` and works in a very similar way to an action but with the power of types.

### Example

```ts
const actions: ActionTree<MyModuleState, RootState> = {
  async fetch (context): Promise<void> {
    const myList = context.state.list // Typed
    // Do Stuff here
    const { data } = await axios.get('URL')
    context.commit('mutation', data)
    await context.dispatch('myotheraction')
  }
}
```

## Mutations

Mutations can be use with the `MutationTree<S>` interface where `S` is the current store type. It works exactly the same as a normal mutation but with the power of types.

### Example

```ts
const mutations: MutationTree<MyModuleState> = {
  setList (state, newList: string[]): void {
    state.list = newList // state.list is typed using MyModuleState
  }
}
```

## Getters

getters can be used with the `GetterTree<S, R>` interface which `S` is the current store type and `R` corresponds to the `RootState` and works exactly the same as a normal getter.

### Example

```ts
const getters: GetterTree<MyModuleState, RootState> = {
  listString (state): string { // state uses MyModuleState
    return state.list.join('') // state.list typed
  }
}
```
