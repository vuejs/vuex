# Documentation de l'API

### `Vuex.Store`

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Options du constructeur de `Vuex.Store`

- **state**

  - type : `Object`

    L'objet d'état racine pour le store Vuex.

    [Détails](state.md)

- **mutations**

  - type : `{ [type: string]: Function }`

    Enregistrer les mutations sur le store. La fonction gestionnaire reçoit toujours `state` comme premier argument (sera l'état local du module si défini dans un module), et reçoit le `payload` en second argument s'il y en a un.

    [Détails](mutations.md)

- **actions**

  - type : `{ [type: string]: Function }`

    Enregistrer les actions sur le store. La fonction gestionnaire reçoit un objet `context` qui expose les propriétés suivantes :

    ``` js
    {
      state,     // identique à `store.state`, ou à l'état local si dans des modules
      rootState, // identique à `store.state`, seulement dans des modules
      commit,    // identique à `store.commit`
      dispatch,  // identique à `store.dispatch`
      getters    // identique à `store.getters`
    }
    ```

    [Détails](actions.md)

- **getters**

  - type : `{ [key: string]: Function }`

    Enregistrer les accesseurs sur le store. La fonction accesseur reçoit les arguments suivants :

    ```
    state,    // sera l'état local du module si défini dans un module.
    getters   // indentique à `store.getters`
    ```

    Arguments spécifiques quand défini dans un module

    ```
    state,       // sera l'état local du module si défini dans un module.
    getters,     // module local getters of the current module
    rootState,   // état global
    rootGetters  // tous les accesseurs
    ```

    Les accesseurs enregistrés sont exposés sur `store.getters`.

    [Détails](getters.md)

- **modules**

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

    Chaque module peut contenir `state` et `mutations`, tout comme les options racine. L'état d'un module sera attaché à l'état racine du store en utilisant la clé du module. Les mutations et accesseurs d'un module recevront seulement l'état local du module en premier argument au lieu de l'état racine, et le `context.state` des actions du module pointeront également vers l'état local.

    [Détails](modules.md)

- **plugins**

  - type : `Array<Function>`

    Un tableau de fonctions plugins qui seront appliquées au store. Un plugin reçoit simplement le store comme seul argument et peut soit écouter les mutations (pour la persistence de données, les logs ou le débogage) ou propager des mutations (pour les données internes, c.-à-d. websockets ou observables).

    [Détails](plugins.md)

- **strict**

  - type : `Boolean`
  - default: `false`

    Force le store Vuex en mode strict. En mode strict, toute mutation de l'état en dehors des gestionnaires de mutation lancera une erreur.

    [Détails](strict.md)

### Propriétés d'instance de `Vuex.Store`

- **state**

  - type : `Object`

    L'état racine. Lecture seule.

- **getters**

  - type : `Object`

    Expose les accesseurs enregistrés. Lecture seule.

### Méthodes d'instance de `Vuex.Store`

- **`commit(type: string, payload?: any, options?: Object) | commit(mutation: Object, options?: Object)`**

  Acter une mutation. `options` peut avoir `root: true` ce qui permet d'acter des mutations racines dans des [modules sous espace de nom](modules.md#namespacing). [Détails](mutations.md)

- **`dispatch(type : string, payload?: any, options?: Object) | dispatch(action: Object, options?: Object)`**

  Propager une action. Retourne la valeur renvoyée par le gestionnaire d'action déclenché, ou une Promesse si plusieurs gestionnaires ont été déclenchés. [Détails](actions.md)

- **`replaceState(state: Object)`**

  Remplacer l'état racine du store. Utiliser seulement pour hydrater l'état ou dans le but de voyager dans le temps.

- **`watch(getter: Function, cb: Function, options?: Object)`**

  Observer de façon réactive la valeur de retour d'une fonction accesseur, et appeler la fonction de rappel lorsque la valeur change. L'accesseur reçoit l'état du store comme unique argument. Accepte un objet optionnel d'options qui prend les mêmes options que la méthode `vm.$watch` de Vue.

  Pour arrêter d'observer, appeler la fonction gestionnaire retournée.

- **`subscribe(handler: Function)`**

  S'abonner aux mutations du store. Le `handler` est appelé après chaque mutation et reçoit le descripteur de mutation et l'état post-mutation comme arguments :

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  Utilisé plus communément dans les plugins. [Détails](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module)`**

  Enregistrer un module dynamique. [Détails](modules.md#enregistrement-dynamique-de-module)

- **`unregisterModule(path: string | Array<string>)`**

  Supprimer un module dynamique. [Détails](modules.md#enregistrement-dynamique-de-module)

- **`hotUpdate(newOptions: Object)`**

  Remplacement à la volée des nouvelles actions et mutations. [Détails](hot-reload.md)

### Fonctions utilitaires d'attachement au composant

- **`mapState(namespace?: string, map: Array<string> | Object): Object`**

  Créer des propriétés calculées qui retournent le sous arbre du store Vuex au composant. [Détails](state.md#le-helper-mapstate)

  Le premier argument peut être de façon optionnel une chaîne d'espace de nom. [Details](modules.md#Fonctions-utilitaires-liées-avec-espace-de-nom)

- **`mapGetters(namespace?: string, map: Array<string> | Object): Object`**

  Créer des propriétés calculées qui retournent la valeur calculée d'un accesseur. [Détails](getters.md#la-function-utilitaire-mapgetters)

  Le premier argument peut être de façon optionnel une chaîne d'espace de nom. [Details](modules.md#Fonctions-utilitaires-liées-avec-espace-de-nom)

- **`mapActions(namespace?: string, map: Array<string> | Object): Object`**

  Créer des méthodes de composant qui propagent une action. [Détails](actions.md#propager-des-actions-dans-les-composants)

  Le premier argument peut être de façon optionnel une chaîne d'espace de nom. [Details](modules.md#Fonctions-utilitaires-liées-avec-espace-de-nom)

- **`mapMutations(namespace?: string, map: Array<string> | Object): Object`**

  Créer des méthodes de composant qui actent une mutation. [Détails](mutations.md#acter-des-mutations-dans-les-composants)

  Le premier argument peut être de façon optionnel une chaîne d'espace de nom. [Details](modules.md#Fonctions-utilitaires-liées-avec-espace-de-nom)
