---
sidebar: auto
---

# Documentation de l'API

## Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

## Options du constructeur de `Vuex.Store`

### state

  - type : `Object | Function`

    L'objet d'état racine pour le store Vuex. [Plus de détails](../guide/state.md)

    Si vous passez une fonction qui retourne un objet, l'objet retourné est utilisé en tant qu'état racine. Ceci est utile quand vous voulez réutiliser un objet d'état surtout dans un cas de réutilisation de module. [Plus de détails](../guide/modules.md#réutiliser-un-module)

### mutations

  - type : `{ [type: string]: Function }`

    Enregistrer les mutations sur le store. La fonction gestionnaire reçoit toujours `state` comme premier argument (sera l'état local du module si défini dans un module), et reçoit le `payload` en second argument s'il y en a un.

    [Plus de détails](../guide/mutations.md)

### actions

  - type : `{ [type: string]: Function }`

    Enregistrer les actions sur le store. La fonction gestionnaire reçoit un objet `context` qui expose les propriétés suivantes :

    ``` js
    {
      state,      // identique à `store.state`, ou à l'état local si dans des modules
      rootState,  // identique à `store.state`, seulement dans des modules
      commit,     // identique à `store.commit`
      dispatch,   // identique à `store.dispatch`
      getters,    // identique à `store.getters`, ou les accesseurs locaux dans les modules
      rootGetters // identique à `store.getters`, seulement dans les modules
    }
    ```

    [Plus de détails](../guide/actions.md)

### getters

  - type : `{ [key: string]: Function }`

    Enregistrer les accesseurs sur le store. La fonction accesseur reçoit les arguments suivants :

    ```
    state,    // sera l'état local du module si défini dans un module.
    getters   // identique à `store.getters`
    ```

    Arguments spécifiques quand défini dans un module

    ```
    state,       // sera l'état local du module si défini dans un module.
    getters,     // module local getters of the current module
    rootState,   // état global
    rootGetters  // tous les accesseurs
    ```

    Les accesseurs enregistrés sont exposés sur `store.getters`.

    [Plus de détails](../guide/getters.md)

### modules

  - type : `Object`

    Un objet contenant des sous-modules qui seront regroupés dans le store, sous la forme suivante :

    ``` js
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

    Chaque module peut contenir `state` et `mutations`, tout comme les options racines. L'état d'un module sera attaché à l'état racine du store en utilisant la clé du module. Les mutations et accesseurs d'un module recevront seulement l'état local du module en premier argument au lieu de l'état racine, et le `context.state` des actions du module pointeront également vers l'état local.

    [Plus de détails](../guide/modules.md)

### plugins

  - type : `Array<Function>`

    Un tableau de fonctions plugins qui seront appliquées au store. Un plugin reçoit simplement le store comme seul argument et peut soit écouter les mutations (pour la persistance de données, les logs ou le débogage) ou propager des mutations (pour les données internes, c.-à-d. websockets ou observables).

    [Plus de détails](../guide/plugins.md)

### strict

  - type : `Boolean`
  - default: `false`

    Force le store Vuex en mode strict. En mode strict, toute mutation de l'état en dehors des gestionnaires de mutation lancera une erreur.

    [Plus de détails](../guide/strict.md)

## Propriétés d'instance de `Vuex.Store`

### state

  - type : `Object`

    L'état racine. Lecture seule.

### getters

  - type : `Object`

    Expose les accesseurs enregistrés. Lecture seule.

## Méthodes d'instance de `Vuex.Store`

### commit

-  `commit(type: string, payload?: any, options?: Object)`
-  `commit(mutation: Object, options?: Object)`

  Acter une mutation. `options` peut avoir `root: true` ce qui permet d'acter des mutations racines dans des [modules sous espace de nom](../guide/modules.md#namespacing). [Plus de détails](../guide/mutations.md)

### dispatch

-  `dispatch(type: string, payload?: any, options?: Object)`
-  `dispatch(action: Object, options?: Object)`

  Propager une action. Retourne la valeur renvoyée par le gestionnaire d'action déclenché, ou une Promesse si plusieurs gestionnaires ont été déclenchés. [Plus de détails](../guide/actions.md)

### replaceState

-  `replaceState(state: Object)`

  Remplacer l'état racine du store. Utiliser seulement pour hydrater l'état ou dans le but de voyager dans le temps.

### watch

-  `watch(getter: Function, cb: Function, options?: Object)`

  Observer de façon réactive la valeur de retour d'une fonction accesseur, et appeler la fonction de rappel lorsque la valeur change. L'accesseur reçoit l'état du store en premier argument, et les accesseurs en second argument. Accepte un objet optionnel d'options qui prend les mêmes options que la méthode `vm.$watch` de Vue.

  Pour arrêter d'observer, appeler la fonction gestionnaire retournée.

### subscribe

-  `subscribe(handler: Function)`

  S'abonner aux mutations du store. Le `handler` est appelé après chaque mutation et reçoit le descripteur de mutation et l'état post mutation comme arguments :

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  Utilisé plus communément dans les plugins. [Plus de détails](../guide/plugins.md)

### subscribeAction

-  `subscribeAction(handler: Function)`

  > Nouveau dans la 2.5.0+

  S'abonner au actions du store. Le `handler` est appelé pour chaque action propagée et reçoit chaque description d'action et l'état du store courant en arguments :

  ``` js
  store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })
  ```

  Souvent utiliser dans les plugins. [Pour plus de détails](../guide/plugins.md)

### registerModule

-  `registerModule(path: string | Array<string>, module: Module, options?: Object)`

  Enregistrer un module dynamique. [Plus de détails](../guide/modules.md#enregistrement-dynamique-de-module)

  `options` peut avoir `preserveState: true` qui lui permet de préserver l'état précédent. Utile pour du rendu côté serveur.

### unregisterModule

-  `unregisterModule(path: string | Array<string>)`

  Supprimer un module dynamique. [Plus de détails](../guide/modules.md#enregistrement-dynamique-de-module)

### hotUpdate

-  `hotUpdate(newOptions: Object)`

  Remplacement à la volée des nouvelles actions et mutations. [Plus de détails](../guide/hot-reload.md)

## Fonctions utilitaires d'attachement au composant

### mapState

-  `mapState(namespace?: string, map: Array<string> | Object): Object`

  Créer des propriétés calculées qui retournent le sous-arbre du store Vuex au composant. [Plus de détails](../guide/state.md#le-helper-mapstate)

  Le premier argument peut être de façon optionnelle une chaine d'espace de nom. [Plus de détails](../guide/modules.md#Fonctions-utilitaires-liées-avec-espace-de-nom)

### mapGetters

-  `mapGetters(namespace?: string, map: Array<string> | Object): Object`

  Créer des propriétés calculées qui retournent la valeur calculée d'un accesseur. [Plus de détails](../guide/getters.md#la-function-utilitaire-mapgetters)

  Le premier argument peut être de façon optionnelle une chaine d'espace de nom. [Plus de détails](../guide/modules.md#Fonctions-utilitaires-liées-avec-espace-de-nom)

### mapActions

-  `mapActions(namespace?: string, map: Array<string> | Object): Object`

  Créer des méthodes de composant qui propagent une action. [Plus de détails](../guide/actions.md#propager-des-actions-dans-les-composants)

  Le premier argument peut être de façon optionnelle une chaine d'espace de nom. [Plus de détails](../guide/modules.md#Fonctions-utilitaires-liées-avec-espace-de-nom)

### mapMutations

-  `mapMutations(namespace?: string, map: Array<string> | Object): Object`

  Créer des méthodes de composant qui actent une mutation. [Plus de détails](../guide/mutations.md#acter-des-mutations-dans-les-composants)

  Le premier argument peut être de façon optionnelle une chaine d'espace de nom. [Plus de détails](../guide/modules.md#Fonctions-utilitaires-liées-avec-espace-de-nom)

### createNamespacedHelpers

-  `createNamespacedHelpers(namespace: string): Object`

  Créer des fonctions utilitaires liées avec espace de nom. L'objet retourné contient `mapState`, `mapGetters`, `mapActions` et `mapMutations` qui sont liées à l'espace de nom fourni. [Plus de détails](../guide/modules.md#fonctions-utilitaires-liées-avec-espace-de-nom)
