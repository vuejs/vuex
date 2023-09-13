# Actions

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/c6ggR3cG" target="_blank" rel="noopener noreferrer">Essayez cette leçon sur Scrimba</a></div>

Les actions sont similaires aux mutations, les différences étant que :

- Au lieu de muter l'état, les actions commettent des mutations.
- Les actions peuvent contenir des opérations asynchrones arbitraires.

Enregistrons une action simple :

``` js
const store = createStore({
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

Les gestionnaires d'actions reçoivent un objet contextuel qui expose le même ensemble de méthodes et de propriétés que l'instance du store, de sorte que vous pouvez appeler `context.commit` pour valider une mutation, ou accéder à l'état et aux getters via `context.state` et `context.getters`. On peut même appeler d'autres actions avec `context.dispatch`. Nous verrons pourquoi cet objet de contexte n'est pas l'instance de magasin elle-même lorsque nous présenterons [Modules](modules.md) plus tard.

En pratique, nous utilisons souvent l'ES2015 [argument destructuring](https://github.com/lukehoban/es6features#destructuring) pour simplifier un peu le code (surtout lorsque nous devons appeler `commit` plusieurs fois) :

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

## Dispatcher les actions

Les actions sont déclenchées avec la méthode `store.dispatch` :

``` js
store.dispatch('increment')
```

Cela peut sembler idiot à première vue : si nous voulons incrémenter le compte, pourquoi ne pas appeler `store.commit('increment')` directement ? Rappelez-vous que les **mutations doivent être synchrones**. Les actions ne le sont pas. Nous pouvons effectuer des opérations **asynchrones** à l'intérieur d'une action :

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Les actions prennent en charge le même format de données utiles et la répartition de type objet :

``` js
// envoi avec un payload
store.dispatch('incrementAsync', {
  amount: 10
})

// dispatch avec un objet
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

Un exemple plus pratique d'actions du monde réel serait une action visant à vérifier un panier d'achat, qui implique **l'appel d'une API asynchrone** et **l'engagement de multiples mutations** :

``` js
actions: {
  checkout ({ commit, state }, products) {
    // enregistrer les articles actuellement dans le panier
    const savedCartItems = [...state.cart.added]
    // envoyer une demande de paiement, et de manière optimiste
    // vider le panier
    commit(types.CHECKOUT_REQUEST)
    // L'API de la boutique accepte un rappel de réussite et un rappel d'échec.
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

Notez que nous effectuons un flux d'opérations asynchrones et que nous enregistrons les effets secondaires (mutations d'état) de l'action en les validant.

## Dispatcher des actions dans des composants

Vous pouvez répartir les actions dans les composants avec `this.$store.dispatch('xxx')`, ou utiliser l'aide `mapActions` qui fait correspondre les méthodes des composants aux appels `store.dispatch` (nécessite l'injection de la racine `store`) :

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // faire correspondre `this.increment()` à `this.$store.dispatch'.('increment')`

      // `mapActions` supporte également les payloads :
      'incrémentBy' // faire correspondre `this.incrémentBy(amount)` à `this.$store.dispatch('incrémentBy', amount)`.
    ]),
    ...mapActions({
      add: 'increment' // faire correspondre `this.add()` à `this.$store.dispatch('increment')`
    })
  }
}
```

## Composer des actions

Les actions sont souvent asynchrones, alors comment savoir quand une action est terminée ? Et plus important encore, comment pouvons-nous composer plusieurs actions ensemble pour gérer des flux asynchrones plus complexes ?

La première chose à savoir est que `store.dispatch` peut gérer les Promise retournés par le gestionnaire d'action déclenché et qu'il retourne également les Promise:

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

Maintenant vous pouvez le faire :

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

Et aussi dans une autre action :

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

Enfin, si nous utilisons [async / await](https://tc39.github.io/ecmascript-asyncawait/), nous pouvons composer nos actions comme suit :

``` js
// en supposant que `getData()` et `getOtherData()` retournent des Promesses

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // attendez que l'action A se termine.
    commit('gotOtherData', await getOtherData())
  }
}
```

> Il est possible pour un `store.dispatch` de déclencher plusieurs gestionnaires d'actions dans différents modules. Dans ce cas, la valeur retournée sera une Promise qui se résout lorsque tous les gestionnaires déclenchés ont été résolus.
