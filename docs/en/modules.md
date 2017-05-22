# Modules

Parce qu'il utilise un _single state tree_, tout le state de notre application est contenu dans un seul et même gros objet. Cependant, au fur et à mesure que notre application grandit, le store peut devenir très engorgé.

Pour y remédier, Vuex nous permet de diviser notre store en **modules**. Chaque module peut contenir son propre state, mutations, actions, getters, et même d'autres modules.

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

store.state.a // -> le state du module A
store.state.b // -> le state du module B
```

### State local d'un module

Dans les mutations et getters d'un module, le premier argument reçu sera le **state local du module**.

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // state est le state du module local
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

De façon similaire, dans les actions du module, `context.state` exposera le state local, et le state racine sera disponible avec `context.rootState` :

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

Également, dans les getters du module, le state racine sera exposé en troisième argument :

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

Par défaut, les actions, mutations et accesseurs à l'intérieur d'un module son toujours enregistré sous l'**espace de nom global**. Cela permet a de multiple module d'être réactif au même type de mutation et action.

Si vous souhaitez que votre module soit auto-suffisant et réutilisable, vous pouvez le ranger sous un espace de nom avec `namespaced: true`. Quand le module est enregistré, tous ses accesseurs, actions et mutations seront automatiquement basé sur l'espace de nom du module dans lesquels ils sont rangés. Par exemple :

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

Les accesseurs et actions sous espace de nom reçoivent des `getters`, `dispatch` et `commit` localisé. En d'autres termes, vous pouvez utiliser les paramètres de module sans écrire de prefix dans le même module. Permuter entre un espace de nom ou pas n'affecte pas le code à l'intérieur du module.

#### Accéder aux propriétés globales dans les modules à espace de nom

Si vous voulez utiliser des état et accesseurs globaux, `rootState` et `rootGetters` sont passés en 3ième et 4ième arguments des fonctions accès et sont également exposés en tant que propriété de l'objet `context` passé aux fonctions d'action.

Pour propager les actions ou les mutations actées dans l'espace de nom global, passez `{ root: true }` en 3ième argument à `dispatch` et `commit`.

``` js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // Les `getters` sont localisé dans le module des accesseurs
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

Quand nous lions un module à espace de nom à un composant avec les fonctions utilitaires `mapState`, `mapGetters`, `mapActions` and `mapMutations`, cela peut être légèrement verbeux :

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

#### Limitations pour les plugins de développeurs

Vous devez faire attention ou nom d'espace imprévisible pour vos modules quand vous créez un [plugin](plugins.md) qui fournit les modules et laisser les utilisateurs les ajouter au store de Vuex. Vos modules seront également sous espace de nom si l'utilisateur du plugin l'ajoute sous un module sous espace de nom. Pour vous adaptez à la situation, vous devez recevoir la valeur de l'espace de nom via vos options de plugin :

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

L'état des modules seront disponibles dans `store.state.myModule` et `store.state.nested.myModule`.

L'enregistrement dynamique de module permet aux autres plugins Vue de bénéficier de la gestion de l'état de Vuex en attachant un module au store de l'application. Par exemple, la bibliothèque [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) intègre vue-router avec vuex en gérant l'état de la route d'application dans un module enregistré dynamiquement.

Vous pouvez aussi supprimer un module enregistré dynamiquement avec `store.unregisterModule(moduleName)`. Notez que vous ne pouvez pas supprimer des modules statiques (déclarés à la création du store) avec cette méthode.

### Module Reuse

Sometimes we may need to create multiple instances of a module, for example:

- Creating multiple stores that uses the same module;
- Register the same module multiple times in the same store.

If we use a plain object to declare the state of the module, then that state object will be shared by reference and cause cross store/module state pollution when it's mutated.

This is actually the exact same problem with `data` inside Vue components. So the solution is also the same - use a function for declaring module state (supported in 2.3.0+):

``` js
const MyReusableModule = {
  state () {
    return {
      foo: 'bar'
    }
  },
  // mutations, actions, getters...
}
```