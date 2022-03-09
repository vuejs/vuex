# Migration vers 4.0 à partir de 3.x

Presque toutes les API de Vuex 4 sont restées inchangées par rapport à Vuex 3. Cependant, il y a encore quelques changements de rupture que vous devez corriger.

- [Les changements de rupture](#breaking-changes)
  - [Processus d'installation](#installation-process)
  - [Prise en charge de TypeScript](#typescript-support)
  - [Les offres groupées sont désormais alignées sur Vue 3](#bundles-are-now-aligned-with-vue-3)
  - [La fonction "createLogger" est exportée par le module de base.](#createlogger-function-is-exported-from-the-core-module)
- [Nouvelles fonctionnalités](#new-features)
  - [Nouvelle fonction de composition "useStore](#new-usestore-composition-function)

### Breaking Changes

### Processus d'installation

Pour s'aligner sur le nouveau processus d'initialisation de Vue 3, le processus d'installation de Vuex a changé. Pour créer un nouveau store, les utilisateurs sont maintenant encouragés à utiliser la fonction createStore nouvellement introduite.

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

Pour installer Vuex sur une instance Vue, passez le `store` au lieu de Vuex.

```js
import { createApp } from 'vue'
import { store } from './store'
import App from './App.vue'

const app = createApp(App)

app.use(store)

app.mount('#app')
```

:::tip NOTE
Bien que ce ne soit pas techniquement un changement de rupture, vous pouvez toujours utiliser la syntaxe `new Store(...)`, nous recommandons cette approche pour s'aligner avec Vue 3 et Vue Router Next.
:::

### Support TypeScript

Vuex 4 supprime ses typages globaux pour `this.$store` dans un composant Vue pour résoudre le [problème #994] (https://github.com/vuejs/vuex/issues/994). Lorsqu'il est utilisé avec TypeScript, vous devez déclarer votre propre augmentation de module.

Placez le code suivant dans votre projet pour permettre à `this.$store` d'être correctement typé :

```ts
// vuex-shim.d.ts

import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // Déclarez vos propres états de magasin.
  interface State {
    count: number
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
```

Vous pouvez en savoir plus dans la section [Support TypeScript](./typescript-support).

### Les bundles sont maintenant alignés avec Vue 3

Les bundles suivants sont générés pour s'aligner sur les bundles Vue 3 :

- `vuex.global(.prod).js`
  - Pour une utilisation directe avec `<script src="...">` dans le navigateur. Expose le global Vuex.
  - Le build global est construit en IIFE, et non en UMD, et n'est destiné qu'à une utilisation directe avec `<script src="...">`.
  - Contains hard-coded prod/dev branches and the prod build is pre-minified. Use the `.prod.js` files for production.
- `vuex.esm-browser(.prod).js`
  - À utiliser avec les importations de modules ES natifs (y compris les modules supportant les navigateurs via `<script type="module">`.
- `vuex.esm-bundler.js`
  - A utiliser avec des bundlers tels que `webpack`, `rollup` et `parcel`.
  - Laisse les branches prod/dev avec les gardes `process.env.NODE_ENV` (doit être remplacé par bundler).
  - N'expédie pas de versions réduites (à faire avec le reste du code après la mise en paquet).
- `vuex.cjs.js`
  - À utiliser pour le rendu côté serveur de Node.js avec `require()`.

### La fonction `createLogger` est exportée par le module de base.

Dans Vuex 3, `createLogger`  - À utiliser pour le rendu côté serveur de Node.js avec `require()`.
` function was exported from `vuex/dist/logger` but it's now included in the core package. The function should be imported directly from the `vuex` package.

```js
import { createLogger } from 'vuex'
```

## Nouvelles fonctionnalités

### Nouvelle fonction de composition `useStore`.

Vuex 4 introduit une nouvelle API pour interagir avec le magasin dans l'API de composition. Vous pouvez utiliser la fonction de composition `useStore` pour récupérer le magasin dans le crochet `setup` du composant.

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
  }
}
```

Vous pouvez en savoir plus dans la section [Composition API](./composition-api).
