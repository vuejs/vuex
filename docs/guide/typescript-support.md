# TypeScript Support

Vuex provides its typings, so you may use TypeScript to write a store definition. You don't need any special TypeScript configuration for Vuex. Please follow [Vue's basic TypeScript setup](https://v3.vuejs.org/guide/typescript-support.html) to configure your project.

However, when you're writing your Vue components in TypeScript, there're a few setups that requires for you to correctly provide typings.

## Typing $store Property in Vue Component

Vuex doesn't provide typings for `this.$store` property out of the box. When used with TypeScript, you must declare your own module augmentation.

To do so, declare custom typings for Vue's `ComponentCustomProperties` by adding `.d.ts` file at your project folder.

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

## Typing useStore Composition Function

When you're writing your Vue component in Composition API, you probably want to `useStore` composition function to return the typed store instance. To `useStore` to correctly return the typed store, you must:

1. Define typed `InjectionKey`.
2. Provide the typed `InjectionKey` when installing a store instance to the Vue app instance.
3. Pass the typed `InjectionKey` to the `useStore` method.

Let's take this step by step. At first, define typed `InjectionKey` with your own store typing definition.

```ts
// store.ts
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

// define your typings for store state
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

Next, pass the defined `InjectionKey` when installing a store instance to the Vue app instance.

```ts
// main.ts
import { createApp } from 'vue'
import { store, key } from './store'

const app = createApp({ ... })

// pass the injection key
app.use(store, key)

app.mount('#app')
```

Finally, you can pass the `InjectionKey` to the `useStore` method to retrieve typed store instance.

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

Under the hood, Vuex installs the store instance to the Vue app instance using Vue's "Provide/Inject" feature. If you are wondering what `InjectionKey` is, you may [learn more at here](https://v3.vuejs.org/api/composition-api.html#provide-inject).

### Simplifying useStore usage

You might feel having to import `InjectionKey` and passing it to `useStore` all over the time could be redundant. In that case, you could define your own `useStore` composition function that simply returns the result from `useStore` and use that instead in a Vue component.

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
