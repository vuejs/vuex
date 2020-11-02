# Vuex 4

This is the Vue 3 compatible version of Vuex. The focus is compatibility, and it provides the exact same API as Vuex 3, so users can reuse their existing Vuex code with Vue 3.

## Status: RC

All Vuex 3 features work. There are a few breaking changes described in a later section, so please check them out. You can find basic usage with both option and Composition API in the `example` directory.

Feedback is welcome should you discover any issues. You may use [vue-next-webpack-preview](https://github.com/vuejs/vue-next-webpack-preview) to test out Vue 3 with Vuex 4.

## Documentation

To check out docs, visit [next.vuex.vuejs.org](https://next.vuex.vuejs.org/).

## Breaking changes

### Installation process has changed

To align with the new Vue 3 initialization process, the installation process of Vuex has changed.

To create a new store instance, users are now encouraged to use the newly introduced `createStore` function.

```js
import { createStore } from 'vuex'

export const store = createStore({
  state () {
    return {
      count: 1
    }
  }
})
```

> Whilst this is not technically a breaking change, you may still use the `new Store(...)` syntax, we recommend this approach to align with Vue 3 and Vue Router Next.

To install Vuex to a Vue instance, pass the store instance instead of Vuex.

```js
import { createApp } from 'vue'
import { store } from './store'
import App from './App.vue'

const app = createApp(App)

app.use(store)

app.mount('#app')
```

### Bundles are now aligned with Vue 3

The following bundles are generated to align with Vue 3 bundles:

- `vuex.global(.prod).js`
  - For direct use with `<script src="...">` in the browser. Exposes the Vuex global.
  - Global build is built as IIFE, and not UMD, and is only meant for direct use with `<script src="...">`.
  - Contains hard-coded prod/dev branches and the prod build is pre-minified. Use the `.prod.js` files for production.
- `vuex.esm-browser(.prod).js`
  - For use with native ES module imports (including module supporting browsers via `<script type="module">`.
- `vuex.esm-bundler.js`
  - For use with bundlers such as `webpack`, `rollup` and `parcel`.
  - Leaves prod/dev branches with `process.env.NODE_ENV` guards (must be replaced by bundler).
  - Does not ship minified builds (to be done together with the rest of the code after bundling).
- `vuex.cjs.js`
  - For use in Node.js server-side rendering with `require()`.

### Typings for `ComponentCustomProperties`

Vuex 4 removes its global typings for `this.$store` within Vue Component to solve [issue #994](https://github.com/vuejs/vuex/issues/994). When used with TypeScript, you must declare your own module augmentation.

Place the following code in your project to allow `this.$store` to be typed correctly:

```ts
// vuex-shim.d.ts

import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface State {
    count: number
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
```

### `createLogger` function is exported from the core module

In Vuex 3, `createLogger` function was exported from `vuex/dist/logger` but it's now included in the core package. You should import the function directly from `vuex` package.

```js
import { createLogger } from 'vuex'
```

## License

[MIT](https://github.com/vuejs/vuex/blob/dev/LICENSE)

Copyright (c) 2015-present Evan You
