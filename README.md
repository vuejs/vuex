# Vuex 4

This is the Vue 3 compatible version of Vuex. The focus is compatibility, and it provides the exact same API as Vuex 3, so users can reuse their existing Vuex code for Vue 3.

## Status: Alpha

All Vuex 3 feature works. There are a few breaking changes described in a later section, so please check them out. You can find basic usage with both option and composition API at `example` folder.

Please note that it's still unstable, and there might be bugs. Please provide us feedback if you find anything. You may use [vue-next-webpack-preview](https://github.com/vuejs/vue-next-webpack-preview) to test out Vue 3 with Vuex 4.

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

## Known issues

- The code is kept as close to Vuex 3 code base as possible, and there're plenty of places where we should refactor. However, we are waiting for all of the test cases to pass before doing so (some tests require Vue 3 update).
- TypeScript support is not ready yet. Please use JS environment to test this for now.

## TODOs as of 4.0.0-alpha.1

- Add TypeScript support
- Make all unit test working
- Refactor the codebase
- Update the build system to align with Vue 3
- Update docs
