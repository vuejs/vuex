# Hot Reloading

Vuex supports hot-reloading mutations, modules, actions and getters during development, using webpack's [Hot Module Replacement API](https://webpack.js.org/guides/hot-module-replacement/). You can also use it in Browserify with the [browserify-hmr](https://github.com/AgentME/browserify-hmr/) plugin.

For mutations and modules, you need to use the `store.hotUpdate()` API method:

``` js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import moduleA from './modules/a'

Vue.use(Vuex)

const state = { ... }

const store = new Vuex.Store({
  state,
  mutations,
  modules: {
    a: moduleA
  }
})

if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept(['./mutations', './modules/a'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // swap in the new modules and mutations
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
```

Checkout the [counter-hot example](https://github.com/vuejs/vuex/tree/dev/examples/counter-hot) to play with hot-reload.

## Dynamic module hot reloading

If you use modules exclusively, you can use `require.context` to load and hot reload all modules dynamically.

```js
// store.js
import Vue from 'vue';
import Vuex from 'vuex';

// Load all modules.
function loadModules() {
  const context = require.context("./modules", false, /([a-z_]+)\.js$/i);

  const modules = context
    .keys()
    .map((key) => ({ key, name: key.match(/([a-z_]+)\.js$/i)[1] }))
    .reduce(
      (modules, { key, name }) => ({
        ...modules,
        [name]: context(key).default,
      }),
      {}
    );

  return { context, modules };
}

const { context, modules } = loadModules();

Vue.use(Vuex);

const store = new Vuex.Store({
  modules
});

export default store;

if (module.hot) {
  // Hot reload whenever any module changes.
  module.hot.accept(context.id, () => {
    const { modules } = loadModules();

    store.hotUpdate({
      modules,
    });
  });
}
```
