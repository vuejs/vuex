# Mutations

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/ckMZp4HN" target="_blank" rel="noopener noreferrer">Try this lesson on Scrimba</a></div>

La seule façon de changer réellement d'état dans un store de Vuex est de commettre une mutation. Les mutations Vuex sont très similaires aux événements : chaque mutation possède une chaîne **type** et un **handler**. La fonction handler est l'endroit où nous effectuons les modifications d'état réelles, et elle recevra l'état comme premier argument :

```js
const store = createStore({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // mutate state
      state.count++
    }
  }
})
```

Vous ne pouvez pas appeler directement un gestionnaire de mutation. Voyez cela plutôt comme un enregistrement d'événement : "Quand une mutation de type `increment` est déclenchée, appelez ce gestionnaire". Pour invoquer un gestionnaire de mutation, vous devez appeler `store.commit` avec son type :

```js
store.commit('increment')
```

## Commit avec Payload

Vous pouvez passer un argument supplémentaire à `store.commit`, qui est appelé le **payload** pour la mutation :

```js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```

```js
store.commit('increment', 10)
```

Dans la plupart des cas, la charge utile devrait être un objet afin qu'elle puisse contenir plusieurs champs, et la mutation enregistrée sera également plus descriptive :

```js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

```js
store.commit('increment', {
  amount: 10
})
```

## Object-Style Commit

Une autre façon de valider une mutation est d'utiliser directement un objet qui a une propriété `type` :

```js
store.commit({
  type: 'increment',
  amount: 10
})
```

Lorsque l'on utilise le commit de type objet, l'objet entier sera transmis comme charge utile aux gestionnaires de mutation, de sorte que le gestionnaire reste le même :

```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

## Utilisation de constantes pour les types de mutation

Il est courant d'utiliser des constantes pour les types de mutation dans diverses implémentations de Flux. Cela permet au code de tirer parti d'outils tels que les linters, et le fait de placer toutes les constantes dans un seul fichier permet à vos collaborateurs d'avoir une vue d'ensemble des mutations possibles dans l'application entière :

```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

```js
// store.js
import { createStore } from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = createStore({
  state: { ... },
  mutations: {
    // nous pouvons utiliser la fonction de nom de propriété calculée ES2015
    // pour utiliser une constante comme nom de fonction
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

L'utilisation des constantes est en grande partie une préférence - elle peut être utile dans les grands projets avec de nombreux développeurs, mais elle est totalement facultative si vous ne les aimez pas.

## Les mutations doivent être synchrones

Une règle importante à retenir est que **les fonctions de traitement des mutations doivent être synchrones**. Pourquoi ? Prenons l'exemple suivant :

```js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Imaginons maintenant que nous débuggions l'application et que nous regardions les journaux de mutation du devtool. Pour chaque mutation enregistrée, le devtool devra capturer un instantané de l'état "avant" et "après". Cependant, le callback asynchrone dans l'exemple de mutation ci-dessus rend cela impossible : le callback n'est pas encore appelé lorsque la mutation est validée, et le devtool n'a aucun moyen de savoir quand le callback sera effectivement appelé - toute mutation d'état effectuée dans le callback est essentiellement impossible à suivre !

## Commettre des mutations dans les composants

Vous pouvez valider les mutations dans les composants avec `this.$store.commit('xxx')`, ou utiliser l'aide `mapMutations` qui fait correspondre les méthodes des composants aux appels `store.commit` (nécessite l'injection de la racine `store`) :

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // map `this.increment()` to `this.$store.commit('increment')`

      // `mapMutations` also supports payloads:
      'incrementBy' // map `this.incrementBy(amount)` to `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // map `this.add()` to `this.$store.commit('increment')`
    })
  }
}
```

### Passons à l'action

L'asynchronisme combiné à la mutation d'état peut rendre votre programme très difficile à raisonner. Par exemple, lorsque vous appelez deux méthodes ayant toutes deux des callbacks asynchrones qui mutent l'état, comment savez-vous quand elles sont appelées et quel callback a été appelé en premier ? C'est exactement la raison pour laquelle nous voulons séparer les deux concepts. Dans Vuex, **les mutations sont des transactions synchrones** :

```js
store.commit('increment')
// tout changement d'état que la mutation "incrément" peut causer
// devrait être fait à ce moment.
```

Pour gérer les opérations asynchrones, introduisons les [Actions](actions.md).
