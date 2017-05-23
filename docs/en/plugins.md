# Plugins

Les stores Vuex prennent une option `plugins` qui expose des hooks pour chaque mutation. Un plugin Vuex est simplement une fonction qui reçoit un store comme unique argument :

``` js
const myPlugin = store => {
  // appelé quand le store est initialisé
  store.subscribe((mutation, state) => {
    // appelé après chaque mutation.
    // Les mutation arrivent au format `{ type, payload }`.
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

### Acter des mutations dans des plugins

Les plugins ne sont pas autorisés à muter directement l'état. Tout comme vos composants, ils peuvent simplement déclencher des changements en actant des mutations.

En actant des mutations, un plugin peut être utilisé pour synchroniser la source de données avec le store. Par exemple, pour synchroniser la source de données d'une websocket vers le store (c'est juste un exemple artificiel, en réalité la fonction `createPlugin` peut prendre des options additionnelles pour des tâches plus complexes) :

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

### Prendre des instantanés de l'état

Parfois un plugin peut vouloir recevoir des « instantanés » de l'état, et également comparer l'état post-mutation avec l'état pré-mutation. Pour faire ceci, vous aurez besoin d'effectuer une copie complète de l'état :

``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // comparer `prevState` et `nextState`...

    // sauver l'état pour la prochaine mutation
    prevState = nextState
  })
}
```

**Les plugins qui peuvent prendre des instantanés ne devraient être utilisés que pendant le développement.** Lorsqu'on utilise webpack ou Browserify, on peut laisser nos outils de développement (« devtools ») s'occuper de ça pour nous :

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

Le plugin sera utilisé par défaut. Pour la production, vous aurez besoin de [DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) pour webpack ou de [envify](https://github.com/hughsk/envify) pour Browserify pour convertir la valeur de `process.env.NODE_ENV !== 'production'` à `false` pour le build final.

### Plugin de logs intégré

> Si vous utilisez [vue-devtools](https://github.com/vuejs/vue-devtools) vous n'avez probablement pas besoin de ça.

Vuex fournit un plugin de logs à des fins de débogage :

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
    // retourne `true` si une mutation devrait être logguée
    // `mutation` est un `{ type, payload }`
    return mutation.type !== "aBlacklistedMutation"
  },
  transformer (state) {
    // transforme l'état avant de le logguer.
    // retourne par exemple seulement un sous-arbre spécifique
    return state.subTree
  },
  mutationTransformer (mutation) {
    // les mutations sont logguées au format `{ type, payload }`
    // nous pouvons les formater comme nous le souhaitons.
    return mutation.type
  }
})
```

Le fichier de logs peut aussi être inclus directement via une balise `script`, et exposera la fonction `createVuexLogger` globalement.

Notez que le plugin de logs peut prendre des instantanés de l'état, ne l'utilisez donc que durant le développement.
