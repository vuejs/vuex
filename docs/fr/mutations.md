# Mutations

La seule façon de vraiment modifier le state dans un store Vuex est de commiter une mutation. Les mutations Vuex sont très similaires aux events : chaque mutation a un **type** sous forme de chaîne de caractères et un **handler**. La fonction handler est là où nous procédons aux véritables modifications du state, et elle reçoit le state en premier argument :

``` js
const store = new Vuex.Store({
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

Vous ne pouvez pas appeler directement un handler de mutation. La façon de faire est plutôt comme un abonnement à un event : "Lorsqu'une mutation du type `increment` est déclenchée, appelle ce handler." Pour invoquer un handler de mutation, il faut appeler **store.commit** avec son type :

``` js
store.commit('increment')
```

### commiter avec un Payload

Vous pouvez donner un autre argument à **store.commit** pour la mutation, qui s'appelle **payload** :

``` js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```
``` js
store.commit('increment', 10)
```

Dans la plupart des cas, le payload devrait être un objet, ainsi il peut contenir plusieurs champs, et les mutations enregistrées seront également plus descriptives :

``` js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```
``` js
store.commit('increment', {
  amount: 10
})
```

### Object-Style Commit

Une méthode alternative pour commiter une mutation est d'utiliser directement un objet qui a une propriété `type` :

``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

Lors de l'utlisation de l'object-style commit, l'objet entier sera fourni comme payload aux handlers de mutation, donc le handler reste inchangé :

``` js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### Les mutations suivent les règles de réactivité de Vue

Puisqu'un state de store de Vuex est rendu réactif par Vue, lorsque nous mutons le state, les composants Vue observant ce state seront automatiquement mis à jour. Cela signifie également que les mutations Vuex sont sujettes aux mêmes inconvénients que lorsqu'on travaille avec Vue :

1. Initialisez de préférence le state initial de votre state avec tous les champs désirés auparavant.

2. Lorsque vous ajoutez de nouvelles propriétés à un Object, vous devriez soit :

  - Utiliser `Vue.set(obj, 'newProp', 123)`, ou -

  - Remplacer cet Object par un nouvel Object. Par exemple, en utilisant [object spread syntax](https://github.com/sebmarkbage/ecmascript-rest-spread) (stage-2), il est possible d'écrire :

    ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### Utilisation de constante pour les noms de mutation

C'est une façon de faire régulière que d'utiliser des constantes pour les types de mutations dans diverses implémentations de Flux. Cela permet au code de bénéficier d'outils comme les linters, et écrire toutes ces constantes dans un seul fichier permet à vos collaborateurs d'avoir un aperçu de quelles mutations sont possibles dans toute l'application :

``` js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

``` js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // we can use the ES2015 computed property name feature
    // to use a constant as the function name
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

Utiliser les constantes ou non relève de la préférence personnelle &mdash; cela peut être bénéfique sur un gros projet avec beaucoup de développeurs, mais c'est totalement optionnel si vous n'aimez pas cette pratique.

### Les mutations doivent être synchrones

Une règle importante à retenir est que **les fonctions handler de mutations doivent être synchrones**. Pourquoi ? Considérons l'exemple suivant :

``` js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Maintenant imaginons que nous debuggons l'application et que nous regardons dans les logs de mutation des devtools. Pour chaque mutation enregistrée, le devtool aura besoin de capturer un instantané du state "avant" et un instantané "après". Cependant, le callback asynchrone de l'exemple ci-dessus rend l'opération impossible : le callback n'est pas encore appelé lorsque la mutation est committée, et il n'y a aucun moyen pour le devtool de savoir quand le callback sera véritablement appelé &mdash; toute mutation du state effectuée dans le callback est essentiellement intraçable !

### commiter des mutations dans les composants

Vous pouvez commiter des mutations dans les composants avec `this.$store.commit('xxx')`, ou en utilisant le helper `mapMutations` qui attache les méthodes du composant aux appels de `store.commit` (nécessite l'injection de `store` à la racine) :

``` js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment' // map this.increment() to this.$store.commit('increment')
    ]),
    ...mapMutations({
      add: 'increment' // map this.add() to this.$store.commit('increment')
    })
  }
}
```

### En avant vers les actions

L'asynchronisme combiné à la mutation du state peut rendre votre programme très difficile à comprendre. Par exemple, lorsque vous appelez deux méthodes avec toutes les deux des callbacks asynchrones qui changent le state, comment savez-vous quand elles sont appelées et quel callback est appelé en premier ? C'est exactement la raison pour laquelle nous voulons séparer les deux concepts. Avec Vuex, **les mutations sont des transactions synchrones** :

``` js
store.commit('increment')
// any state change that the "increment" mutation may cause
// should be done at this moment.
```

Pour gérer les opérations asynchrones, présentons les [Actions](actions.md).
