# Plugins

Vuex-Store akzeptiert die `plugins`-Option, welche Hooks für jede Mutation freilegt. Ein Vuex-Plugin ist lediglich eine Funktion, das den Store als einziges Argument erhält:

``` js
const myPlugin = store => {
  // Aufgerufen, wenn der Store initialisiert ist.
  store.subscribe((mutation, state) => {
    // Aufgerufen nach jeder Mutation.
    // Die Mutation liegt im Format "{ type, payload }" vor.
  })
}
```

Und es kann wie folgt genutzt werden:

``` js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

### Commit Mutations innerhalb von Plugins

Plugins haben nicht die Erlaubnis State direkt zu verändern. Ähnlich wie Komponenten können sie lediglich Änderungen durch Mutation-Committing einleiten.

Durch Mutation-Committing kann das Plugin Datenquellen mit dem Store synchronisieren. Um zum Beispiel eine Websocket-Datenquelle mit dem Store zu synchronisieren:

> Dies ist lediglich ein erfundenes Beispiel. In Realität kann die `createPlugin`-Funktion zusätzliche Optionen für komplexere Aufgaben aufnehmen.

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

### State-Schnappschüsse aufnehmen

Manchmal soll das Plugin Schnappschüsse (Snapshots) des States aufnehmen und ebenfalls den State vor und nach der Mutation vergleichen. Um dies zu erreichen, muss eine tiefgehende Kopie des State-Objekts erfolgen:

``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // Vergleiche 'PrevState' und 'nextState'.

    // Sichere 'state' für nächste Mutation.
    prevState = nextState
  })
}
```

**Plugins, die State-Schnappschüsse aufnehmen, sollten nur während der Entwicklungsphase genutzt werden.** In Verbindung mit Webpack oder Browserify können wir das automatisieren:

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

Das Plugin wird standardmäßig eingesetzt. Für die Produktionsphase werden [DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) für Webpack oder [envify](https://github.com/hughsk/envify) für Browserify benötigt, um den Wert von `process.env.NODE_ENV !== 'production'` zu `false` für das finale Build zu konvertieren.

### Eingebautes Logger-Plugin

> In Verbindung mit [vue-devtools](https://github.com/vuejs/vue-devtools) ist das womöglich nicht nötig.

Vuex hat ebenfalls ein Logger-PLugin (Log = Protokoll) für häufigen Debugging-Gebrauch:

``` js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

Die `createLogger`-Funktion hat einige Optionen:

``` js
const logger = createLogger({
  collapsed: false, // automatische Expandierung von protokollierten Mutations
  transformer (state) {
    // Transformiere den State vor Protokollierung,
    // zB. gib bestimmten Sub-Tree wieder.
    return state.subTree
  },
  mutationTransformer (mutation) {
    // Mutations werden als "{ type, payload }" protokolliert.
    // Es ist wie gewünscht formatierbar.
    return mutation.type
  }
})
```

Die Logger-Date kann auch direkt via `<script>`-Tag eingebunden werden und stellt die `createVuexLogger`-Function global zur Verfügung.

> Merke: Das Logger-Plugin nimmt State-Schnappschüsse auf. Nutze es demnach während der Entwicklung, nicht zur Veröffentlichung!
