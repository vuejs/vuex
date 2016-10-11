# Actions

Les actions sont similaires aux mutations, à la différence que :

- Au lieu de modifier le state, les actions committent des mutations.
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

Les handlers d'action reçoivent un objet contexte qui expose le même set de méthodes/propriétés que l'instance du store, donc vous pouvez appeler `context.commit` pour committer une mutation, ou accéder au state et aux getters via `context.state` et `context.getters`. Nous verrons pourquoi cet objet contexte n'est pas l'instance du store elle-même lorsque nous présenterons les [Modules](moduels.md) plus tard.

En pratique, nous utilisons souvent la [destructuration d'argument](https://github.com/lukehoban/es6features#destructuring) (*argument destructuring*) pour simplifier quelque peu le code (particulièrement si nous avons besoin d'appeler `commit` plusieurs fois) :

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### Dispatcher des actions

Les actions sont déclenchées par la méthode `store.dispatch` :

``` js
store.dispatch('increment')
```

Cela peut sembler idiot au premier abord : si nous avons besoin d'incrémenter le compteur, pourquoi ne pas simplement appeler `store.commit('increment')` directement ? Et bien, vous rappelez-vous que **les mutations doivent être synchrones** ? Les actions ne suivent pas cette règle. Il est possible de procéder à des opérations **asynchrones** dans une action :

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Les actions prennent en charge le même format de payload et *object-style dispatch* :

``` js
// dispatch with a payload
store.dispatch('incrementAsync', {
  amount: 10
})

// dispatch with an object
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

Un exemple plus pratique d'une application du monde réel serait une action pour check-out un panier d'achats, ce qui implique **d'appeler une API asynchrone** et de **comitter de multiples mutations** :

``` js
actions: {
  checkout ({ commit, state }, payload) {
    // save the items currently in the cart
    const savedCartItems = [...state.cart.added]
    // send out checkout request, and optimistically
    // clear the cart
    commit(types.CHECKOUT_REQUEST)
    // the shop API accepts a success callback and a failure callback
    shop.buyProducts(
      products,
      // handle success
      () => commit(types.CHECKOUT_SUCCESS),
      // handle failure
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

Notez que nous procédons à un flux d'opérations asynchrones, et enregistrons les effets de bord (mutation du state) de l'action en les committant.

### Dispatcher des actions dans les composants

Vous pouvez dispatcher des actions dans les composants avec `this.$store.dispatch('xxx')`, ou en utilisant le helper `mapActions` qui attache les méthodes du composant aux appels de `store.dispatch` (nécessite l'injection de `store` à la racine) :

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment' // map this.increment() to this.$store.dispatch('increment')
    ]),
    ...mapActions({
      add: 'increment' // map this.add() to this.$store.dispatch('increment')
    })
  }
}
```

### Composer les actions

Les actions sont souvent asynchrones, donc comment savoir lorsqu'une action est terminée ? Et plus important, comment composer plusieurs actions ensemble pour manipuler des flux asynchrones plus complexes ?

La première chose à savoir est que `store.dispatch` retourne la valeur retournée par le handler de l'action déclenchée, vous pouvez donc retourner une Promise :

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

Pour finir, nous pouvons utiliser de [async / await](https://tc39.github.io/ecmascript-asyncawait/), une fonctionnalité JavaScript qui sera disponible très bientôt, nous pouvons composer nos actions ainsi :

``` js
// assuming getData() and getOtherData() return Promises

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // wait for actionA to finish
    commit('gotOtherData', await getOtherData())
  }
}
```

> Il est possible pour un `store.dispatch` de déclencher plusieurs handlers d'action dans différentes modules. Dans ce genre de cas, la valeur retournée sera une Promise qui se résoud quand tous les handlers déclenchés ont été résolus.
