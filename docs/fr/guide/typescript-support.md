# Support TypeScript

Vuex fournit ses typages afin que vous puissiez utiliser TypeScript pour écrire une définition de magasin. Vous n'avez pas besoin d'une configuration TypeScript spéciale pour Vuex. Veuillez suivre [Vue's basic TypeScript setup](https://v3.vuejs.org/guide/typescript-support.html) pour configurer votre projet.

Cependant, si vous écrivez vos composants Vue en TypeScript, il y a quelques étapes à suivre qui vous obligent à fournir correctement les typages pour un magasin.

## Typage de la propriété `$store` dans un composant Vue

Vuex ne fournit pas de typage pour la propriété `this.$store` par défaut. Lorsqu'il est utilisé avec TypeScript, vous devez déclarer votre propre augmentation de module.

Pour ce faire, déclarez des typages personnalisés pour les `ComponentCustomProperties` de Vue en ajoutant un fichier de déclaration dans le dossier de votre projet :

```ts
// vuex.d.ts
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // déclarez vos propres états de magasin
  interface State {
    count: number
  }

  // fournir des typages pour `this.$store`.
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
```

## Typage de la fonction de composition `useStore`.

Lorsque vous écrivez votre composant Vue dans l'API de composition, vous voudrez très probablement que `useStore` renvoie le store typé. Pour que `useStore` renvoie correctement le store  typé, vous devez :

1. Définir la `InjectionKey` typée.
2. Fournir la `InjectionKey` typée lors de l'installation d'un store dans l'application Vue.
3. Passez la `InjectionKey` typée à la méthode `useStore`.

Abordons cela étape par étape. Tout d'abord, définissez la clé en utilisant l'interface `InjectionKey` de Vue ainsi que votre propre définition du type de store :

```ts
// store.ts
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

// définissez vos typages pour l'état du magasin
export interface State {
  count: number
}

// définir la clé d'injection
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    count: 0
  }
})
```

Ensuite, transmettez la clé d'injection définie lors de l'installation du store à l'application Vue :

```ts
// main.ts
import { createApp } from 'vue'
import { store, key } from './store'

const app = createApp({ ... })

// passer la clé d'injection
app.use(store, key)

app.mount('#app')
```

Enfin, vous pouvez passer la clé à la méthode `useStore` pour récupérer le store typé.

```ts
// dans un composant Vue
import { useStore } from 'vuex'
import { key } from './store'

export default {
  setup () {
    const store = useStore(key)

    store.state.count // typé comme un `number`
  }
}
```

Vuex installe le magasin dans l'application Vue à l'aide de la fonction [Provide/Inject] (https://v3.vuejs.org/api/composition-api.html#provide-inject) de Vue, ce qui explique pourquoi la clé d'injection est un facteur important.

### Simplification de l'utilisation de `useStore`.

Devoir importer `InjectionKey` et le passer à `useStore` partout où il est utilisé peut rapidement devenir une tâche répétitive. Pour simplifier les choses, vous pouvez définir votre propre fonction composable pour récupérer un store typé :

```ts
// store.ts
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  count: number
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    count: 0
  }
})

// Définissez votre propre fonction de composition `useStore`.
export function useStore () {
  return baseUseStore(key)
}
```

Maintenant, en important votre propre fonction composable, vous pouvez récupérer le store typé **sans** avoir à fournir la clé d'injection et son typage :

```ts
// dans un composant Vue
import { useStore } from './store'

export default {
  setup () {
    const store = useStore()

    store.state.count // typé comme un `number`
  }
}
```
