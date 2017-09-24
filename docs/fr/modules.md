# Modules

Du fait de l'utilisation d'un arbre d'état unique, tout l'état de notre application est contenu dans un seul et même gros objet. Cependant, au fur et à mesure que notre application grandit, le store peut devenir très engorgé.

Pour y remédier, Vuex nous permet de diviser notre store en **modules**. Chaque module peut contenir ses propres état, mutations, actions, accesseurs. Il peut même contenir ses propres modules internes.

``` js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> l'état du `moduleA`
store.state.b // -> l'état du `moduleB`
```

### État local d'un module

Dans les mutations et accesseurs d'un module, le premier argument reçu sera **l'état local du module**.

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // `state` est l'état du module local
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

De façon similaire, dans les actions du module, `context.state` exposera l'état local, et l'état racine sera disponible avec `context.rootState` :

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

Également, dans les accesseurs du module, l'état racine sera exposé en troisième argument :

``` js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### Espace de nom

Par défaut, les actions, mutations et accesseurs à l'intérieur d'un module sont toujours enregistrés sous l'**espace de nom global**. Cela permet à de multiples modules d'être réactifs au même type de mutation et d'action.

Si vous souhaitez que votre module soit auto-suffisant et réutilisable, vous pouvez le ranger sous un espace de nom avec `namespaced: true`. Quand le module est enregistré, tous ses accesseurs, actions et mutations seront automatiquement basés sur l'espace de nom du module dans lesquels ils sont rangés. Par exemple :

```js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // propriétés du module
      state: { ... }, // l'état du module est déjà imbriqué et n'est pas affecté par l'option `namespace`
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // modules imbriqués
      modules: {
        // hérite de l'espace de nom du module parent
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // utilise un espace de nom imbriqué
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

Les accesseurs et actions sous espace de nom reçoivent des `getters`, `dispatch` et `commit` localisés. En d'autres termes, vous pouvez utiliser les paramètres de module sans écrire de prefix dans ce même module. Permuter entre un espace de nom ou non n'affecte pas le code à l'intérieur du module.

#### Accéder aux propriétés globales dans les modules à espace de nom

Si vous voulez utiliser des états et accesseurs globaux, `rootState` et `rootGetters` sont passés en 3ième et 4ième arguments des fonctions d'accès et sont également exposés en tant que propriété de l'objet `context` passé aux fonctions d'action.

Pour propager les actions ou les mutations actées dans l'espace de nom global, passez `{ root: true }` en 3ième argument à `dispatch` et `commit`.

``` js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // Les `getters` sont localisés dans le module des accesseurs
      // vous pouvez utiliser `rootGetters` via le 4ième argument des accesseurs
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // les actions et mutations sont aussi localisées pour ce module
      // elles vont accepter une option `root` pour la racine des actions et mutations.
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

#### Fonctions utilitaires liées avec espace de nom

Quand nous lions un module sous espace de nom à un composant avec les fonctions utilitaires `mapState`, `mapGetters`, `mapActions` and `mapMutations`, cela peut être légèrement verbeux :

``` js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo',
    'some/nested/module/bar'
  ])
}
```

Dans ces cas là, vous pouvez passer une chaîne de caractère représentant le nom d'espace en tant que premier argument aux fonctions utilitaires ainsi toutes les liaisons seront faites en utilisant le module comme contexte. Cela peut être simplifié comme ci-dessous :

``` js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo',
    'bar'
  ])
}
```

De plus, vous pouvez créer des fonctions utilitaires liées avec espace de nom en utilisant `createNamespacedHelpers`. Cela retourne un objet qui a les nouvelles fonctions utilitaires ratachées à la valeur d'espace de nom fournie :

``` js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // vérifie dans `some/nested/module`
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // vérifie dans `some/nested/module`
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

#### Limitations pour les plugins des développeurs

Vous devez faire attention au nom d'espace imprévisible pour vos modules quand vous créez un [plugin](plugins.md) qui fournit les modules et laisser les utilisateurs les ajouter au store de Vuex. Vos modules seront également sous espace de nom si l'utilisateur du plugin l'ajoute sous un module sous espace de nom. Pour vous adaptez à la situation, vous devez recevoir la valeur de l'espace de nom via vos options de plugin :

```js
// passer la valeur d'espace de nom via une option du plugin
// et retourner une fonction de plugin Vuex
export function createPlugin (options = {}) {
  return function (store) {
    // ajouter l'espace de nom aux types de module
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
 }
}
```

### Enregistrement dynamique de module

Vous pouvez enregistrer un module **après** que le store ait été créé avec la méthode `store.registerModule` :

``` js
// enregistrer un module `myModule`
store.registerModule('myModule', {
  // ...
})

// enregistrer un module imbriqué `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

L'état des modules est disponible dans `store.state.myModule` et `store.state.nested.myModule`.

L'enregistrement dynamique de module permet aux autres plugins Vue de bénéficier de la gestion de l'état de Vuex en attachant un module au store de l'application. Par exemple, la bibliothèque [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) intègre vue-router avec vuex en gérant l'état de la route d'application dans un module enregistré dynamiquement.

Vous pouvez aussi supprimer un module enregistré dynamiquement avec `store.unregisterModule(moduleName)`. Notez que vous ne pouvez pas supprimer des modules statiques (déclarés à la création du store) avec cette méthode.

### Ré-utiliser un module

Parfois nous devrons créer de multiples instances d'un module pour, par exemple :

- créer plusieurs stores qui utilisent le même module (par ex. pour [éviter les singletons d'état avec du SSR](https://ssr.vuejs.org/fr/structure.html#avoid-stateful-singletons) quand l'option `runInNewContext` est à `false` ou `'once'`) ou
- enregistrer le même module plusieurs fois dans le même store.

Si nous utilisons un objet pour déclarer l'état du module, alors cet objet d'état sera partagé par référence et causera de contamination inter store/module quand il sera muté.

C'est exactement le même problème qu'avec `data` dans un composant Vue. Ainsi la solution est là même, utiliser une fonction pour déclarer notre état de module (supporté par la 2.3.0+) :

``` js
const MyReusableModule = {
  state () {
    return {
      foo: 'bar'
    }
  },
  // mutations, actions, accesseurs...
}
```