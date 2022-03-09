# Modules

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cqKK4psq" target="_blank" rel="noopener noreferrer">Essayez cette leçon sur Scrimba</a></div>

Grâce à l'utilisation d'un seul arbre d'état, tous les états de notre application sont contenus dans un seul gros objet. Cependant, à mesure que notre application se développe, le store peut devenir très volumineux.

Pour y remédier, Vuex nous permet de diviser notre magasin en **modules**. Chaque module peut contenir son propre état, des mutations, des actions, des getters, et même des modules imbriqués - c'est fractal jusqu'au bout :

```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = createStore({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> `moduleA`'s state
store.state.b // -> `moduleB`'s state
```

## Etat local du module

Dans les mutations et getters d'un module, le premier argument reçu sera **l'état local du module**.

```js
const moduleA = {
  state: () => ({
    count: 0
  }),
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

De même, à l'intérieur des actions du module, `context.state` exposera l'état local, et l'état racine sera exposé comme `context.rootState` :

```js
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

De même, dans les getters de modules, l'état de la racine sera exposé comme troisième argument :

```js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

## Espace de noms

Par défaut, les actions et les mutations sont toujours enregistrées dans l'espace de noms **global** - cela permet à plusieurs modules de réagir au même type d'action/mutation. Les récupérateurs sont également enregistrés dans l'espace de noms global par défaut. Cependant, cela n'a actuellement aucun but fonctionnel (c'est tel quel pour éviter les changements de rupture). Vous devez faire attention à ne pas définir deux getters avec le même nom dans des modules différents, sans espace de noms, ce qui entraînerait une erreur.

Si vous voulez que vos modules soient plus autonomes ou réutilisables, vous pouvez les marquer comme namespaced avec `namespaced : true`. Lorsque le module est enregistré, tous ses getters, actions et mutations seront automatiquement espacés de noms en fonction du chemin d'accès du module. Par exemple :

```js
const store = createStore({
  modules: {
    account: {
      namespaced: true,

      // module assets
      state: () => ({ ... }), // l'état du module est déjà imbriqué et n'est pas affecté par l'option d'espace de nom
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
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // emboîter davantage l'espace de noms
        posts: {
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

Les getters et actions à espacement de noms recevront des `getters`, `dispatch` et `commit` localisés. En d'autres termes, vous pouvez utiliser les ressources du module sans écrire de préfixe dans le même module. Le fait de basculer entre namespaced ou non n'affecte pas le code à l'intérieur du module.

### Accès aux actifs globaux dans les modules à espacement de noms

Si vous voulez utiliser l'état global et les getters, `rootState` et `rootGetters` sont passés comme 3ème et 4ème arguments aux fonctions getter, et également exposés comme propriétés sur l'objet `context` passé aux fonctions d'action.

Pour distribuer des actions ou commettre des mutations dans l'espace de noms global, passez `{ root : true }` comme 3ème argument à `dispatch` et `commit`.

```js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` est localisé dans les getters du module.
      // vous pouvez utiliser rootGetters via le 4ème argument de getters
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
        rootGetters['bar/someOtherGetter'] // -> 'bar/someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // dispatch et commit sont aussi localisés pour ce module
      // ils accepteront l'option `root` pour le dispatch/commit racine.
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'
        rootGetters['bar/someGetter'] // -> 'bar/someGetter'

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

### Enregistrer une action globale dans des modules Namespaced

Si vous voulez enregistrer des actions globales dans des modules à espace de noms, vous pouvez les marquer avec `root : true` et placer la définition de l'action dans la fonction `handler`. Par exemple:

```js
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

### Lier des aides avec un espace de nom

Lorsque vous liez un module avec espace de nom à des composants avec les aides `mapState`, `mapGetters`, `mapActions` et `mapMutations`, cela peut devenir un peu verbeux :

```js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  }),
  ...mapGetters([
    'some/nested/module/someGetter', // -> this['some/nested/module/someGetter']
    'some/nested/module/someOtherGetter', // -> this['some/nested/module/someOtherGetter']
  ])
},
methods: {
  ...mapActions([
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
  ])
}
```

Dans ce cas, vous pouvez passer la chaîne de l'espace de nom du module comme premier argument aux aides afin que toutes les liaisons soient effectuées en utilisant ce module comme contexte. Ce qui précède peut être simplifié :

```js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  }),
  ...mapGetters('some/nested/module', [
    'someGetter', // -> this.someGetter
    'someOtherGetter', // -> this.someOtherGetter
  ])
},
methods: {
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}
```

De plus, vous pouvez créer des aides liées à un espace de nom en utilisant `createNamespacedHelpers`. Elle renvoie un objet contenant de nouvelles aides à la liaison de composants qui sont liées à la valeur de l'espace de noms donnée :

```js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // look up in `some/nested/module`
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // look up in `some/nested/module`
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

### Avertissement pour les développeurs de plugins

Vous pouvez vous soucier de l'espacement des noms imprévisible pour vos modules lorsque vous créez un [plugin](plugins.md) qui fournit les modules et permet aux utilisateurs de les ajouter à un store Vuex. Vos modules seront également espacés par des noms si les utilisateurs du plugin ajoutent vos modules sous un module espacé par des noms. Pour vous adapter à cette situation, vous devrez peut-être recevoir une valeur d'espace de nom via l'option de votre plugin :

```js
// obtient la valeur de l'espace de nom via l'option du plugin
// et renvoie la fonction du plugin Vuex
export function createPlugin (options = {}) {
  return function (store) {
    // ajouter un espace de nom aux types du module du plugin
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

## Enregistrement dynamique des modules

Vous pouvez enregistrer un module **après** que le magasin ait été créé avec la méthode `store.registerModule` :

```js
import { createStore } from 'vuex'

const store = createStore({ /* options */ })

// enregistre un module `myModule`.
store.registerModule('myModule', {
  // ...
})

// register a nested module `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

Le module state sera exposé comme `store.state.myModule` et `store.state.nested.myModule`.

L'enregistrement dynamique des modules permet à d'autres plugins Vue de tirer également parti de Vuex pour la gestion de l'état en attachant un module au magasin de l'application. Par exemple, la bibliothèque [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) intègre vue-router à Vuex en gérant l'état de la route de l'application dans un module attaché dynamiquement.

Vous pouvez également supprimer un module enregistré dynamiquement avec `store.unregisterModule(moduleName)`. Notez que vous ne pouvez pas supprimer les modules statiques (déclarés à la création du magasin) avec cette méthode.

Notez que vous pouvez vérifier si le module est déjà enregistré dans le store ou non via la méthode `store.hasModule(moduleName)`. Une chose à garder à l'esprit est que les modules imbriqués doivent être transmis sous forme de tableaux pour les méthodes `registerModule` et `hasModule` et non sous forme de chaîne avec le chemin d'accès au module.

### Préservation de l'état

Il peut arriver que vous souhaitiez préserver l'état précédent lors de l'enregistrement d'un nouveau module, comme par exemple préserver l'état d'une application Server Side Rendered. Vous pouvez y parvenir avec l'option `preserveState` : `store.registerModule('a', module, { preserveState : true })`.

Lorsque vous définissez `preserveState : true`, le module est enregistré, les actions, mutations et getters sont ajoutés au magasin, mais pas l'état. On suppose que l'état de votre magasin contient déjà l'état de ce module et que vous ne voulez pas l'écraser.

## Réutilisation des modules

Parfois, nous pouvons avoir besoin de créer plusieurs instances d'un module, par exemple :

- Créer plusieurs magasins qui utilisent le même module (par exemple, pour [éviter les singletons avec état dans le SSR] (https://ssr.vuejs.org/en/structure.html#avoid-stateful-singletons) lorsque l'option `runInNewContext` est `false` ou `'once'`) ;
- Enregistrer le même module plusieurs fois dans le même store.

Si nous utilisons un objet ordinaire pour déclarer l'état du module, alors cet objet d'état sera partagé par référence et causera une pollution croisée entre le store et l'état du module lorsqu'il sera muté.

C'est en fait exactement le même problème avec `data` dans les composants Vue. La solution est donc également la même - utiliser une fonction pour déclarer l'état du module (supporté en 2.3.0+) :

```js
const MyReusableModule = {
  state: () => ({
    foo: 'bar'
  }),
  // mutations, actions, getters...
}
```
