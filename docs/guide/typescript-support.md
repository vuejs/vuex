# TypeScript Support

Vuex provides its typings so you can use TypeScript to write a store definition. You don't need any special TypeScript configuration for Vuex. Please follow [Vue's basic TypeScript setup](https://v3.vuejs.org/guide/typescript-support.html) to configure your project.

However, if you're writing your Vue components in TypeScript, there're a few steps to follow that require for you to correctly provide typings for a store.

## Typing `$store` Property in Vue Component

Vuex doesn't provide typings for `this.$store` property out of the box. When used with TypeScript, you must declare your own module augmentation.

To do so, declare custom typings for Vue's `ComponentCustomProperties` by adding a declaration file in your project folder:

```ts
// vuex.d.ts
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    count: number
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
```

## Typing `useStore` Composition Function

When you're writing your Vue component in Composition API, you will most likely want `useStore` to return the typed store. For `useStore` to correctly return the typed store, you must:

1. Define the typed `InjectionKey`.
2. Provide the typed `InjectionKey` when installing a store to the Vue app.
3. Pass the typed `InjectionKey` to the `useStore` method.

Let's tackle this step by step. First, define the key using Vue's `InjectionKey` interface along with your own store typing definition:

```ts
// store.ts
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

// define your typings for the store state
export interface State {
  count: number
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    count: 0
  }
})
```

Next, pass the defined injection key when installing the store to the Vue app:

```ts
// main.ts
import { createApp } from 'vue'
import { store, key } from './store'

const app = createApp({ ... })

// pass the injection key
app.use(store, key)

app.mount('#app')
```

Finally, you can pass the key to the `useStore` method to retrieve the typed store.

```ts
// in a vue component
import { useStore } from 'vuex'
import { key } from './store'

export default {
  setup () {
    const store = useStore(key)

    store.state.count // typed as number
  }
}
```

Under the hood, Vuex installs the store to the Vue app using Vue's [Provide/Inject](https://v3.vuejs.org/api/composition-api.html#provide-inject) feature which is why the injection key is an important factor.

### Simplifying `useStore` usage

Having to import `InjectionKey` and passing it to `useStore` everywhere it's used can quickly become a repetitive task. To simplify matters, you can define your own composable function to retrieve a typed store:

```ts
// store.js
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  count: number
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    count: 0
  }
})

// define your own `useStore` composition function
export function useStore () {
  return baseUseStore(key)
}
```

Now, by importing your own composable function, you can retrieve the typed store **without** having to provide the injection key and it's typing:

```ts
// in a vue component
import { useStore } from './store'

export default {
  setup () {
    const store = useStore()

    store.state.count // typed as number
  }
}
```
