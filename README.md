# Vuex 4

This is the Vue 3 compatible version of Vuex. The focus is compatibility, and it provides the exact same API as Vuex 3, so users can reuse their existing Vuex code for Vue 3.

## Status: Beta

All Vuex 3 feature works. There are a few breaking changes described in a later section, so please check them out. You can find basic usage with both option and composition API at `example` folder.

Please provide us feedback if you find anything. You may use [vue-next-webpack-preview](https://github.com/vuejs/vue-next-webpack-preview) to test out Vue 3 with Vuex 4.

## Breaking changes

### Installation process has changed

To align with the new Vue 3 initialization process, the installation process of Vuex has changed as well.

You should use a new `createStore` function to create a new store instance.

```js
import { createStore } from 'vuex'

const store = createStore({
  state () {
    return {
      count: 1
    }
  }
})
```

> This is technically not a breaking change because you could still use `new Store(...)` syntax. However, to align with Vue 3 and also with Vue Router Next, we recommend users to use `createStore` function instead.

Then to install Vuex to Vue app instance, pass the store instance instead of Vuex.

```js
import { createApp } from 'vue'
import store from './store'
import App from './APP.vue'

const app = createApp(App)

app.use(store)

app.mount('#app')
```

### Bundles are now aligned with Vue 3

The bundles are generated as below to align with Vue 3 bundles.

- `vuex.global(.prod).js`
  - For direct use via `<script src="...">` in the browser. Exposes the Vuex global.
  - Note that global builds are not UMD builds. They are built as IIFEs and is only meant for direct use via `<script src="...">`.
  - Contains hard-coded prod/dev branches, and the prod build is pre-minified. Use the `.prod.js` files for production.
- `vuex.esm-browser(.prod).js`
  - For usage via native ES modules imports (in browser via `<script type="module">`.
- `vuex.esm-bundler.js`
  - For use with bundlers like `webpack`, `rollup` and `parcel`.
  - Leaves prod/dev branches with `process.env.NODE_ENV` guards (must be replaced by bundler).
  - Does not ship minified builds (to be done together with the rest of the code after bundling).
- `vuex.cjs.js`
  - For use in Node.js server-side rendering via `require()`.

### Typings for `ComponentCustomProperties`

Vuex 4 removes its global typings for `this.$store` within Vue Component due to solving [issue #994](https://github.com/vuejs/vuex/issues/994). When using TypeScript, you must provide your own augment declaration.

Please place the following code in your project to have `this.$store` working.

```ts
// vuex-shim.d.ts

declare module "@vue/runtime-core" {
  // Declare your own store states.
  interface State {
    count: number
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
```

## TODOs as of 4.0.0-beta.1

- Update docs
