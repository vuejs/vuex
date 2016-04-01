# Middleware

Lo store di Vuex accetta un'opzione detta `middlewares` che espone delle funzionalità per ogni mutation (si noti che non ha nulla a che vedere con i Middleware di Redux). Un Middleware in Vuex è un oggetto con al suo interno delle funzioni tipo:

``` js
const myMiddleware = {
  onInit (state, store) {
    // registra lo stato iniziale
  },
  onMutation (mutation, state, store) {
    // chiamata ad ogni mutation
    // l'argomento mutation viene fornito con { type, payload }
  }
}
```

un Middleware si può usare così:

``` js
const store = new Vuex.Store({
  // ...
  middlewares: [myMiddleware]
})
```

Per definizione, il middleware riceve l'oggetto `state` ma può anche ricevere lo `store` in modo da chiamare delle mutation al suo interno. Dato che i Middleware sono usati principalmente per debugging **non possono mutare nessuno stato**.

A volte un middleware potrebbe voler ricevere un'istantanea dello stato corrente in modo da poterla confrontare con l'eventuale stato post-mutation. Per fare ciò basta impostare l'ozione `snapshot: true`:

``` js
const myMiddlewareWithSnapshot = {
  snapshot: true,
  onMutation (mutation, nextState, prevState, store) {
    // i due state, next e prev, sono snapshot dello state stesso
    // prima e dopo la mutazione
  }
}
```

**I middleware che sfruttano gli snapshot andrebbero usati solo durante lo sviluppo**. Webpack, o Browserify, possono assicurarvi una pulizia di queste opzioni durante la build:

``` js
const store = new Vuex.Store({
  // ...
  middlewares: process.env.NODE_ENV !== 'production'
    ? [myMiddlewareWithSnapshot]
    : []
})
```

In questo esempio viene usato il middleware se si è in ambiente di sviluppo. Per la build di produzione fate riferimento a [questo link](http://it.vuejs.org/guide/application.html#Distruibuzione-in-Produzione) che vi spiega come convertire `process.env.NODE_ENV !== 'production'` a `false` per la build finale.

### Middleware Inclusi

Vuex ha dei middleware per il debugging già inclusi:

``` js
import createLogger from 'vuex/logger'

const store = new Vuex.Store({
  middlewares: [createLogger()]
})
```

Il middleware `createLogger` ha alcune opzioni interessanti:

``` js
const logger = createLogger({
  collapsed: false, // auto espansione dei log delle mutation
  transformer (state) {
    // trasforma lo stato prima di loggare
    // utile per esempio se si vuole speficiare quale subTree loggare
    return state.subTree
  },
  mutationTransformer (mutation) {
    // le mutation sono loggate nel formato { type, payload }
    // ma possiamo specificare come formattarle a nostro piacimento
    return mutation.type
  }
})
```

Si noti che il createLogger utilizza gli snapshot per gli stati, non usatelo in produzione.
