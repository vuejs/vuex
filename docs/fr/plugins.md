# Plugins

Les stores Vuex prennent une option `plugins` qui expose des hooks pour chaque mutation. Un plugin Vuex est simplement une fonction qui reçoit un store comme unique argument :

``` js
const myPlugin = store => {
  // called when the store is initialized
  store.subscribe((mutation, state) => {
    // called after every mutation.
    // The mutation comes in the format of { type, payload }.
  })
}
```

Et peut être utilisé ainsi :

``` js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

### Commiter des mutations dans des plugins

Les plugins ne sont pas autorisés à muter directement le state &mdash; tout comme vos composants, ils peuvent simplement déclencher des changements en committant des mutations.

En commitant des mutations, un plugin peut être utilisé pour synchroniser la source de données avec le store. Par exemple, pour synchroniser la source de données d'un websocket vers le store (c'est juste un exemple artificiel, en réalité la fonction `createPlugin` peut prendre des options additionnelles pour des tâches plus complexes) :

``` js
export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
```

``` js
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})
```

### Prendre des instantanés du state

Parfois un plugin peut vouloir reçevoir des "instantanés" du state, et également comparer le state post-mutation avec le state pre-mutation. Pour faire ceci, vous aurez besoin d'effectuer une deep-copy sur l'objet du state :

``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // compare prevState and nextState...

    // save state for next mutation
    prevState = nextState
  })
}
```

**Les plugins qui peuvent prendre des instantanés ne devraient être utilisés que pendant le développement.** Lorsqu'on utilise Webpack ou Browserify, on peut laisser nos devtools s'occuper de ça pour nous :

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

Le plugin sera utilisé par défaut. Pour la production, vous aurez besoin de [DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) pour Webpack ou de [envify](https://github.com/hughsk/envify) pour Browserify pour convertir la valeur de `process.env.NODE_ENV !== 'production'` à `false` pour le build final.

### Plugin logger intégré

> Si vous utilisez [vue-devtools](https://github.com/vuejs/vue-devtools) vous n'avez probablement pas besoin de ça.

Vuex fournit un plugin de logger à des fins de debugging :

``` js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

La fonction `createLogger` prend quelques options :

``` js
const logger = createLogger({
  collapsed: false, // auto-expand logged mutations
  filter (mutation, stateBefore, stateAfter) {
    // returns true if a mutation should be logged
    // `mutation` is a { type, payload }
    return mutation.type !== "aBlacklistedMutation"
  },
  transformer (state) {
    // transform the state before logging it.
    // for example return only a specific sub-tree
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutations are logged in the format of { type, payload }
    // we can format it any way we want.
    return mutation.type
  },
  logger: console, // implementation of the `console` API, default `console`
})
```

Le fichier logger peut aussi être inclus directement via une balise `script`, et exposera la fonction `createVuexLogger` globalement.

Notez que le plugin logger peut prendre des instantanés du state, ne l'utilisez donc que durant le développement.
