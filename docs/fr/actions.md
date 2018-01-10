# Actions

Les actions sont similaires aux mutations, à la différence que :

- Au lieu de modifier l'état, les actions actent des mutations.
- Les actions peuvent contenir des opérations asynchrones.

Enregistrons une simple action :

``` js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

Les gestionnaires d'action reçoivent un objet contexte qui expose le même ensemble de méthodes et propriétés que l'instance du store, donc vous pouvez appeler `context.commit` pour acter une mutation, ou accéder à l'état et aux accesseurs via `context.state` et `context.getters`. Nous verrons pourquoi cet objet contexte n'est pas l'instance du store elle-même lorsque nous présenterons les [Modules](modules.md) plus tard.

En pratique, nous utilisons souvent la [déstructuration d'argument](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Affecter_par_d%C3%A9composition) pour simplifier quelque peu le code (particulièrement si nous avons besoin d'appeler `commit` plusieurs fois) :

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### Propager des actions

Les actions sont déclenchées par la méthode `store.dispatch` :

``` js
store.dispatch('increment')
```

Cela peut sembler idiot au premier abord : si nous avons besoin d'incrémenter le compteur, pourquoi ne pas simplement appeler `store.commit('increment')` directement ? Vous rappelez-vous que **les mutations doivent être synchrones** ? Les actions ne suivent pas cette règle. Il est possible de procéder à des opérations **asynchrones** dans une action :

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Les actions prennent également en charge les paramètres additionnels (« payload ») et les objets pour propager :

``` js
// propager avec un paramètre additionnel
store.dispatch('incrementAsync', {
  amount: 10
})

// propager avec un objet
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

Un exemple concret d'application serait une action pour vider un panier d'achats, ce qui implique **d'appeler une API asynchrone** et d'**acter de multiples mutations** :

``` js
actions: {
  checkout ({ commit, state }, products) {
    // sauvegarder les articles actuellement dans le panier
    const savedCartItems = [...state.cart.added]
    // envoyer la requête de checkout,
    // et vider le panier
    commit(types.CHECKOUT_REQUEST)
    // l'API de la boutique en ligne prend une fonction de rappel en cas de succès et une autre en cas d'échec
    shop.buyProducts(
      products,
      // gérer le succès
      () => commit(types.CHECKOUT_SUCCESS),
      // gérer l'échec
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

Notez que nous procédons à un flux d'opérations asynchrones, et enregistrons les effets de bord (mutation de l'état) de l'action en les actant.

### Propager des actions dans les composants

Vous pouvez propager des actions dans les composants avec `this.$store.dispatch('xxx')`, ou en utilisant la fonction utilitaire `mapActions` qui attache les méthodes du composant aux appels de `store.dispatch` (nécessite l'injection de `store` à la racine) :

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment' // attacher `this.increment()` à `this.$store.dispatch('increment')`

      // `mapActions` supporte également les paramètres additionnels :
      'incrementBy' // attacher `this.incrementBy(amount)` à `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // attacher `this.add()` à `this.$store.dispatch('increment')`
    })
  }
}
```

### Composer les actions

Les actions sont souvent asynchrones, donc comment savoir lorsqu'une action est terminée ? Et plus important, comment composer plusieurs actions ensemble pour manipuler des flux asynchrones plus complexes ?

La première chose à savoir est que `store.dispatch` peut gérer la Promesse (« Promise ») retournée par le gestionnaire d'action déclenché et par conséquent vous pouvez également retourner une Promesse :

``` js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

Maintenant vous pouvez faire :

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

Et également dans une autre action :

``` js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

Pour finir, si nous utilisons [`async` / `await`](https://tc39.github.io/ecmascript-asyncawait/), nous pouvons composer nos actions ainsi :

``` js
// sachant que `getData()` et `getOtherData()` retournent des Promesses.

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // attendre que `actionA` soit finie
    commit('gotOtherData', await getOtherData())
  }
}
```

> Il est possible pour un `store.dispatch` de déclencher plusieurs gestionnaires d'action dans différents modules. Dans ce genre de cas, la valeur retournée sera une Promesse qui se résout quand tous les gestionnaires déclenchés ont été résolus.
