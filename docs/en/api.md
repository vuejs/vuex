# Documentation de l'API

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Options du constructeur de Vuex.Store

- **state**

  - type : `Object`

    L'objet état racine pour le store Vuex.

    [Détails](state.md)

- **mutations**

  - type : `{ [type : string]: Function }`

    Enregistrer les mutations sur le store. La fonction gestionnaire reçoit toujours `state` comme premier argument (sera l'état local du module si défini dans un module), et reçoit le `payload` en second argument s'il y en a un.

    [Détails](mutations.md)

- **actions**

  - type : `{ [type : string]: Function }`

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
    state,     // sera l'état local du module si défini dans un module.
    getters,   // indentique à `store.getters`
    ```

    Spécifique quand défini dans un module.

    ```


    rootState  // indentique à `store.state`

    ```

    Les getters enregistrés sont exposés sur `store.getters`.

    [Détails](getters.md)

- **modules**

  - type : `Object`

    Un objet contenant des sous-modules qui seront regroupés dans le store, de la forme suivante :

    ``` js
    {
      key: {
        state,
        mutations,
        actions?,
        getters?,
        modules?
      },
      ...
    }
    ```

    Chaque module peut contenir `state` et `mutations`, tout comme les options racine. Le state d'un module sera attaché au state racine du store en utilisant la clé du module. Les mutations et getters d'un module recevront seulement le state local du module en premier argument au lieu du state racine, et le `context.state` des actions du module pointeront également vers le state local.

    [Détails](modules.md)

- **plugins**

  - type : `Array<Function>`

    Un tableau de fonctions plugin qui seront appliqués au store. Un plugin reçoit simplement le store comme seul argument et peut soit écouter les mutations (pour la persistence de données, logging ou debugging) ou dispatcher des mutations (pour les données internes, i.e. websockets ou observables).

    [Détails](plugins.md)

- **strict**

  - type : `Boolean`
  - default: `false`

    Force le store Vuex en mode strict. En mode strict, toute mutation du state en dehors des handlers de mutation lancera une Error.

    [Détails](strict.md)

### Propriétés d'instance de Vuex.Store

- **state**

  - type : `Object`

    Le state racine. Lecture seule.

- **getters**

  - type : `Object`

    Expose les getters enregistrés. Lecture seule.

### Méthodes d'instance de Vuex.Store

- **`commit(type : string, payload?: any) | commit(mutation: Object)`**

  commiter une mutation. [Détails](mutations.md)

- **`dispatch(type : string, payload?: any) | dispatch(action: Object)`**

  Dispatcher une action. Retourne la valeur renvoyée par le handler d'action déclenché, ou une Promise si plusieurs handlers ont été déclenchés. [Détails](actions.md)

- **`replaceState(state: Object)`**

  Remplacer le state racine du store. Utiliser seulement pour hydrater le state ou voir le state dans le temps.

- **`watch(getter: Function, cb: Function, options?: Object)`**

  Observer de façon réactive la valeur de retour d'une fonction getter, et appeler le callback lorsque la valeur change. Le getter reçoit le state du store comme unique argument. Accepte un objet options optionnel qui prend les mêmes options que la méthode `vm.$watch` de Vue.

  Pour arrêter d'observer, appeler la fonction retournée.

- **`subscribe(handler: Function)`**

  S'abonner aux mutations du store. Le `handler` est appelé après chaque mutation et reçoit le descripteur de mutation et le state post-mutation comme arguments :

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

### Helpers d'attachement au composant

- **`mapState(map: Array<string> | Object): Object`**

  Créer des computed properties qui retournent le sub tree du store Vuex au composant. [Détails](state.md#le-helper-mapstate)

- **`mapGetters(map: Array<string> | Object): Object`**

  Créer des computed properties qui retournent la valeur calculée d'un getter. [Détails](getters.md#le-helper-mapgetters)

- **`mapActions(map: Array<string> | Object): Object`**

  Créer des méthodes de composant qui dispatchent une action. [Détails](actions.md#dispatcher-des-actions-dans-les-composants)

- **`mapMutations(map: Array<string> | Object): Object`**

  Créer des méthodes de composant qui committent une mutation. [Détails](mutations.md#commiter-des-mutations-dans-les-composants)
