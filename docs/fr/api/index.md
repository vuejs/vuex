---
sidebar: auto
---

# API Reference

## Store

### createStore

- `createStore<S>(options: StoreOptions<S>): Store<S>`

  Crée un nouveau store.

  ```js
  import { createStore } from 'vuex'

  const store = createStore({ ...options })
  ```

## Options du Constructeur du Store

### state

- type: `Object | Function`

  L'objet d'état racine pour le store Vuex. [Détails](../guide/state.md)

  Si vous passez une fonction qui renvoie un objet, l'objet renvoyé est utilisé comme état racine. Ceci est utile lorsque vous souhaitez réutiliser l'objet d'état, notamment pour la réutilisation de modules. [Détails](../guide/modules.md#module-reuse)

### mutations

- type: `{ [type: string]: Function }`

  Enregistre les mutations sur le magasin. La fonction handler reçoit toujours `state` comme premier argument (ce sera l'état local du module s'il est défini dans un module), et reçoit un second argument `payload` s'il y en a un.

  [Details](../guide/mutations.md)

### actions

- type: `{ [type: string]: Function }`

  Enregistre les actions sur le store. La fonction handler reçoit un objet `context` qui expose les propriétés suivantes :

  ```js
  {
    state,      // même que `store.state`, ou l'état local si dans les modules
    rootState,  // même que `store.state`, uniquement dans les modules
    commit,     // même que `store.commit`
    dispatch,   // même que `store.dispatch`
    getters,    // même que `store.getters`, ou getters locaux si dans le modules
    rootGetters // même que `store.getters`, uniquement dans les modules
  }
  ```

  Et reçoit également un deuxième argument `payload` s'il y en a un.

  [Details](../guide/actions.md)

### getters

- type: `{ [key: string]: Function }`

  Enregistrez les getters sur le store. La fonction getter reçoit les arguments suivants :

  ```
  state, // sera l'état local du module s'il est défini dans un module.
  getters // identique à store.getters
  ```

  Specific when defined in a module

  ```
  state, // sera l'état local du module s'il est défini dans un module.
  getters, // getters locaux du module actuel
  rootState, // état global
  rootGetters // tous les getters
  ```

  Les getters enregistrés sont exposés sur `store.getters`.

  [Details](../guide/getters.md)

### modules

- type: `Object`

  Un objet contenant des sous-modules à fusionner dans le magasin, sous la forme de :

  ```js
  {
    key: {
      state,
      namespaced?,
      mutations?,
      actions?,
      getters?,
      modules?
    },
    ...
  }
  ```

  Chaque module peut contenir des options `state` et `mutations` similaires à celles de la racine. L'état d'un module sera attaché à l'état racine du magasin en utilisant la clé du module. Les mutations et getters d'un module ne recevront que l'état local du module comme premier argument au lieu de l'état racine, et le `context.state` des actions du module pointera également vers l'état local.

  [Details](../guide/modules.md)

### plugins

- type: `Array<Function>`

  Un tableau de fonctions de plugin à appliquer au magasin. Le plugin reçoit simplement le magasin comme seul argument et peut soit écouter les mutations (pour la persistance des données sortantes, la journalisation ou le débogage), soit distribuer les mutations (pour les données entrantes, par exemple les websockets ou les observables).

  [Details](../guide/plugins.md)

### strict

- type: `boolean`
- default: `false`

  Force le store de Vuex à passer en mode strict. En mode strict, toute mutation de l'état de Vuex en dehors des gestionnaires de mutation entraînera une erreur.

  [Details](../guide/strict.md)

### devtools

- type: `boolean`

  Active ou désactive le plugin devtools pour une instance Vuex particulière. Par exemple, passer `false` indique au store de Vuex de ne pas s'abonner au plugin devtools. Utile lorsque vous avez plusieurs magasins sur une seule page.

  ```js
  {
    devtools: false
  }
  ```

## Propriétés de l'instance de Store

### state

- type: `Object`

  L'état de la racine. En lecture seule.

### getters

- type: `Object`

  Expose les récupérateurs enregistrés. En lecture seule.

## Store Instance Methods

### commit

-  `commit(type: string, payload?: any, options?: Object)`
-  `commit(mutation: Object, options?: Object)`

  Engager une mutation. `options` peut avoir `root : true` qui permet de valider les mutations de la racine dans [namespaced modules](../guide/modules.md#namespacing). [Détails](../guide/mutations.md)

### dispatch

-  `dispatch(type: string, payload?: any, options?: Object): Promise<any>`
-  `dispatch(action: Object, options?: Object): Promise<any>`

  Dispatch une action. `options` peut avoir `root : true` qui permet de distribuer des actions racines dans les [modules à espacement de noms](../guide/modules.md#namespacing). Retourne une Promise qui résout tous les gestionnaires d'action déclenchés. [Détails](../guide/actions.md)

### replaceState

-  `replaceState(state: Object)`

  Remplace l'état racine du magasin. Utilisez ceci uniquement pour l'hydratation de l'état / le voyage dans le temps.

### watch

-  `watch(fn: Function, callback: Function, options?: Object): Function`

  Surveillez de manière réactive la valeur de retour de `fn`, et appelez le callback lorsque la valeur change. `fn` reçoit l'état du magasin comme premier argument, et les getters comme second argument. Accepte un objet optionnel d'options qui prend les mêmes options que [la méthode `vm.$watch` de Vue](https://vuejs.org/v2/api/#vm-watch).

  To stop watching, call the returned unwatch function.

### subscribe

-  `subscribe(handler: Function, options?: Object): Function`

  S'abonner aux mutations du magasin. Le `handler` est appelé après chaque mutation et reçoit le descripteur de mutation et l'état post-mutation comme arguments.

  ```js
  const unsubscribe = store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })

  // you may call unsubscribe to stop the subscription
  unsubscribe()
  ```

  Par défaut, le nouveau gestionnaire est ajouté à la fin de la chaîne, donc il sera exécuté après les autres gestionnaires qui ont été ajoutés avant. Ceci peut être modifié en ajoutant `prepend : true` à `options`, ce qui ajoutera le gestionnaire au début de la chaîne.

  ```js
  store.subscribe(handler, { prepend: true })
  ```

  La méthode `subscribe` renvoie une fonction `unsubscribe`, qui doit être appelée lorsque l'abonnement n'est plus nécessaire. Par exemple, vous pouvez vous abonner à un module Vuex et vous désabonner lorsque vous désenregistrez le module. Ou bien vous pouvez appeler `subscribe` à l'intérieur d'un composant Vue et détruire le composant plus tard. Dans ces cas, vous devez vous souvenir de désabonner l'abonnement manuellement.

  Le plus souvent utilisé dans les plugins. [Details](../guide/plugins.md)

### subscribeAction

-  `subscribeAction(handler: Function, options?: Object): Function`

  S'abonner aux actions du magasin. Le `handler` est appelé pour chaque action distribuée et reçoit le descripteur de l'action et l'état actuel du magasin comme arguments.
  La méthode `subscribe` renvoie une fonction `unsubscribe`, qui doit être appelée lorsque l'abonnement n'est plus nécessaire. Par exemple, lors du désenregistrement d'un module Vuex ou avant la destruction d'un composant Vue.

  ```js
  const unsubscribe = store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })

  // you may call unsubscribe to stop the subscription
  unsubscribe()
  ```

  Par défaut, le nouveau gestionnaire est ajouté à la fin de la chaîne, donc il sera exécuté après les autres gestionnaires qui ont été ajoutés avant. Ceci peut être modifié en ajoutant `prepend : true` à `options`, ce qui ajoutera le gestionnaire au début de la chaîne.

  ```js
  store.subscribeAction(handler, { prepend: true })
  ```

  La méthode `subscribeAction` renvoie une fonction `unsubscribe`, qui doit être appelée lorsque l'abonnement n'est plus nécessaire. Par exemple, vous pouvez vous abonner à un module Vuex et vous désabonner lorsque vous désenregistrez le module. Ou bien vous pouvez appeler la fonction `subscribeAction` à l'intérieur d'un composant Vue et détruire le composant plus tard. Dans ces cas, vous devez vous souvenir de désabonner l'abonnement manuellement.

  `subscribeAction` peut également spécifier si le gestionnaire d'abonnement doit être appelé *avant* ou *après* la distribution d'une action (le comportement par défaut est *avant*) :

  ```js
  store.subscribeAction({
    before: (action, state) => {
      console.log(`before action ${action.type}`)
    },
    after: (action, state) => {
      console.log(`after action ${action.type}`)
    }
  })
  ```

  `subscribeAction` peut également spécifier un gestionnaire `error` pour attraper une erreur lancée lorsqu'une action est distribuée. La fonction recevra un objet `error` comme troisième argument.

  ```js
  store.subscribeAction({
    error: (action, state, error) => {
      console.log(`error action ${action.type}`)
      console.error(error)
    }
  })
  ```

  La méthode `subscribeAction` est le plus souvent utilisée dans les plugins. [Détails](../guide/plugins.md)

### registerModule

-  `registerModule(path: string | Array<string>, module: Module, options?: Object)`

  Enregistrer un module dynamique. [Détails](../guide/modules.md#dynamic-module-registration)

  `options` peut avoir `preserveState : true` qui permet de préserver l'état précédent. Utile avec le Server Side Rendering.

### unregisterModule

-  `unregisterModule(path: string | Array<string>)`

  Désenregistrement d'un module dynamique. [Détails](../guide/modules.md#dynamic-module-registration)

### hasModule

- `hasModule(path: string | Array<string>): boolean`

  Vérifie si le module avec le nom donné est déjà enregistré. [Détails](../guide/modules.md#dynamic-module-registration)

### hotUpdate

-  `hotUpdate(newOptions: Object)`

  Nouvelles actions et mutations de Hot Swap. [Détails](../guide/hot-reload.md)

## Component Binding Helpers

### mapState

-  `mapState(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Créer des options de calcul de composants qui renvoient la sous-arborescence du magasin Vuex. [Détails](../guide/state.md#the-mapstate-helper)

  Le premier argument peut éventuellement être une chaîne d'espace de noms. [Détails](../guide/modules.md#binding-helpers-with-namespace)

  Les membres du second argument de l'objet peuvent être une fonction. `function(state : any)`

### mapGetters

-  `mapGetters(namespace?: string, map: Array<string> | Object<string>): Object`

  Créez des options calculées de composant qui renvoient la valeur évaluée d'un getter. [Détails](../guide/getters.md#the-mapgetters-helper)

  Le premier argument peut éventuellement être une chaîne d'espace de noms. [Détails](../guide/modules.md#binding-helpers-with-namespace)

### mapActions

-  `mapActions(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Créer des options de méthodes de composants qui répartissent une action. [Détails](../guide/actions.md#dispatching-actions-in-components)

  Le premier argument peut éventuellement être une chaîne d'espace de noms. [Détails](../guide/modules.md#binding-helpers-with-namespace)

  Les membres du deuxième argument objet peuvent être une fonction. `function(dispatch : function, ...args : any[])`

### mapMutations

-  `mapMutations(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Créer des options de méthodes de composants qui engagent une mutation. [Détails](../guide/mutations.md#committing-mutations-in-components)

  Le premier argument peut éventuellement être une chaîne d'espace de nom. [Détails](../guide/modules.md#binding-helpers-with-namespace)

  Les membres du deuxième argument objet peuvent être une fonction. `function(commit : function, ...args : any[])`

### createNamespacedHelpers

-  `createNamespacedHelpers(namespace: string): Object`

  Crée des aides à la liaison de composants dans un espace de nom. L'objet retourné contient `mapState`, `mapGetters`, `mapActions` et `mapMutations` qui sont liés à l'espace de noms donné. [Détails](../guide/modules.md#binding-helpers-with-namespace)

## Composable Functions

### useStore

- `useStore<S = any>(injectKey?: InjectionKey<Store<S>> | string): Store<S>;`

  Récupère le magasin injecté lorsqu'il est appelé dans le crochet `setup`. Lorsque vous utilisez l'API de composition, vous pouvez récupérer le magasin en appelant cette méthode.

  ```js
  import { useStore } from 'vuex'

  export default {
    setup () {
      const store = useStore()
    }
  }
  ```

  Les utilisateurs de TypeScript peuvent utiliser une clé d'injection pour récupérer un store typé. Pour que cela fonctionne, vous devez définir la clé d'injection et la transmettre avec le magasin lors de l'installation de l'instance du magasin dans l'application Vue.

  Tout d'abord, déclarez la clé d'injection en utilisant l'interface `InjectionKey` de Vue.

  ```ts
  // store.ts
  import { InjectionKey } from 'vue'
  import { createStore, Store } from 'vuex'

  export interface State {
    count: number
  }

  export const key: InjectionKey<Store<State>> = Symbol()

  export const store = createStore<State>({
    state: {
      count: 0
    }
  })
  ```

  Ensuite, passez la clé définie comme deuxième argument pour la méthode `app.use`.

  ```ts
  // main.ts
  import { createApp } from 'vue'
  import { store, key } from './store'

  const app = createApp({ ... })

  app.use(store, key)

  app.mount('#app')
  ```

  Enfin, vous pouvez passer la clé à la méthode `useStore` pour récupérer l'instance de magasin typée.

  ```ts
  // in a vue component
  import { useStore } from 'vuex'
  import { key } from './store'

  export default {
    setup () {
      const store = useStore(key)

      store.state.count // typed as number
    }
  }
  ```
