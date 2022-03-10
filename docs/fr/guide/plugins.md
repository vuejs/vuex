# Les Plugins

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cvp8ZkCR" target="_blank" rel="noopener noreferrer">Essayez cette leçon sur le Scrimba</a></div>

Les stores Vuex acceptent l'option `plugins` qui expose des hooks pour chaque mutation. Un plugin Vuex est simplement une fonction qui reçoit le store comme seul argument : 

```js
const myPlugin = (store) => {
  // appelé lorsque le magasin est initialisé
  store.subscribe((mutation, state) => {
    // appelé après chaque mutation.
    // La mutation se présente sous la forme de `{type, payload }`.
  })
}
```

Et peut être utilisé comme ceci :

```js
const store = createStore({
  // ...
  plugins: [myPlugin]
})
```

## Commettre des mutations à l'intérieur des plugins

Les plugins ne sont pas autorisés à modifier directement l'état - comme vos composants, ils ne peuvent déclencher des changements qu'en engageant des mutations.

En engageant des mutations, un plugin peut être utilisé pour synchroniser une source de données avec le magasin. Par exemple, pour synchroniser une source de données websocket au store (ceci est juste un exemple artificiel, en réalité la fonction `createWebSocketPlugin` peut prendre des options supplémentaires pour des tâches plus complexes) :

```js
export default function createWebSocketPlugin (socket) {
  return (store) => {
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

```js
const plugin = createWebSocketPlugin(socket)

const store = createStore({
  state,
  mutations,
  plugins: [plugin]
})
```

## Prendre des instantanés de l'état

Parfois, un plugin peut vouloir recevoir des "instantanés" de l'état, et aussi comparer l'état post-mutation avec l'état pré-mutation. Pour ce faire, vous devrez effectuer une copie profonde de l'objet state :

```js
const myPluginWithSnapshot = (store) => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // comparer `prevState` et `nextState`...

    // sauvegarde l'état pour la prochaine mutation
    prevState = nextState
  })
}
```

**Les plugins qui prennent des instantanés de l'état ne doivent être utilisés que pendant le développement** Lorsque nous utilisons webpack ou Browserify, nous pouvons laisser nos outils de construction s'en charger pour nous :

```js
const store = createStore({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

Le plugin sera utilisé par défaut. Pour la production, vous aurez besoin de [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) pour webpack ou [envify](https://github.com/hughsk/envify) pour Browserify pour convertir la valeur de `process.env.NODE_ENV !== 'production'` à `false` pour la construction finale.

## Plugin Logger intégré

Vuex est livré avec un plugin de journalisation pour les utilisations courantes de débogage :

```js
import { createLogger } from 'vuex'

const store = createStore({
  plugins: [createLogger()]
})
```

La fonction `createLogger` prend quelques options :

```js
const logger = createLogger({
  collapsed: false, // auto-expansion des mutations enregistrées
  filter (mutation, stateBefore, stateAfter) {
    // renvoie `true` si une mutation doit être enregistrée.
    // `mutation` est un `{ type, payload }`.
    return mutation.type !== "aBlocklistedMutation"
  },
  actionFilter (action, state) {
    // comme `filter` mais pour les actions
    // `action` est un `{ type, payload }`.
    return action.type !== "aBlocklistedAction"
  },
  transformer (state) {
    // transformer l'état avant de l'enregistrer.
    // par exemple renvoyer seulement un sous-arbre spécifique
    return state.subTree
  },
  mutationTransformer (mutation) {
    // les mutations sont enregistrées au format `{ type, payload }`.
    // nous pouvons les formater comme nous le voulons.
    return mutation.type
  },
  actionTransformer (action) {
    // Identique à mutationTransformer mais pour les actions
    return action.type
  },
  logActions: true, // Log Actions
  logMutations: true, // Log mutations
  logger: console, // implémentation de l'API `console`, par défaut `console`.
})
```

Le fichier du logger peut aussi être inclus directement via une balise `<script>`, et exposera la fonction `createVuexLogger` globalement.

Notez que le plugin logger prend des instantanés d'état, donc ne l'utilisez que pendant le développement.
