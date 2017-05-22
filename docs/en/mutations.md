# Mutations

La seule façon de vraiment modifier l'état dans un store Vuex est d'acter une mutation. Les mutations Vuex sont très similaires aux évènements : chaque mutation a un **type** sous forme de chaîne de caractères et un **gestionnaire**. La fonction de gestion est en charge de procéder aux véritables modifications de l'état, et elle reçoit l'état en premier argument :

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // muter l'état
      state.count++
    }
  }
})
```

Vous ne pouvez pas appeler directement un gestionnaire de mutation. Le parti-pris ici est proche de l'abonnement à un évènement : « Lorsqu'une mutation du type `increment` est déclenchée, appelle ce gestionnaire. » Pour invoquer un gestionnaire de mutation, il faut appeler `store.commit` avec son type :

``` js
store.commit('increment')
```

### Acter avec un argument additionnel

Vous pouvez donner un argument additionnel (« payload ») à la fonction `store.commit` lors de la mutation :

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

Dans la plupart des cas, l'argument additionnel devrait être un objet, ainsi il peut contenir plusieurs champs, et les mutations enregistrées seront également plus descriptives :

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

### Acter avec un objet

Une méthode alternative pour acter une mutation est d'utiliser directement un objet qui a une propriété `type` :

``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

Lors de l'utilisation d'un objet pour acter, c'est l'objet lui-même qui ferra office d'argument pour aux gestionnaires de mutation, le gestionnaire reste donc inchangé :

``` js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### Les mutations suivent les règles de réactivité de Vue

Puisqu'un état de store de Vuex est rendu réactif par Vue, lorsque nous mutons l'état, les composants Vue observant cet état seront automatiquement mis à jour. Cela signifie également que les mutations Vuex sont sujettes aux mêmes limitations qu'avec l'utilisation de Vue seul :

1. Initialisez de préférence le store initial de votre état avec tous les champs désirés auparavant.

2. Lorsque vous ajoutez de nouvelles propriétés à un objet, vous devriez soit :

  - Utiliser `Vue.set(obj, 'newProp', 123)`, ou

  - Remplacer cet objet par un nouvel objet. Par exemple, en utilisant [opérateur de décomposition](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Op%C3%A9rateur_de_d%C3%A9composition) (stage-2), il est possible d'écrire :

    ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### Utilisation de constante pour les noms de mutation

C'est une façon de faire régulière que d'utiliser des constantes pour les types de mutations dans diverses implémentations de Flux. Cela permet au code de bénéficier d'outils comme les linters (des outils d'aide à l'analyse syntaxique), et écrire toutes ces constantes dans un seul fichier permet à vos collaborateurs d'avoir un aperçu de quelles mutations sont possibles dans toute l'application :

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
    // nous pouvons utiliser la fonctionnalité de nom de propriété calculée
    // pour utiliser une constante en tant que nom de fonction
    [SOME_MUTATION] (state) {
      // muter l'état
    }
  }
})
```

Utiliser les constantes ou non relève de la préférence personnelle. Cela peut être bénéfique sur un gros projet avec beaucoup de développeurs, mais c'est totalement optionnel si vous n'aimez pas cette pratique.

### Les mutations doivent être synchrones

Une règle importante à retenir est que **les fonctions de gestion des mutations doivent être synchrones**. Pourquoi ? Considérons l'exemple suivant :

``` js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Maintenant imaginons que nous deboguons l'application et que nous regardons dans les logs de mutation des outils de développement (« devtools »). Pour chaque mutation enregistrée, le devtool aura besoin de capturer un instantané de l'état « avant » et un instantané « après ». Cependant, la fonction de rappel asynchrone de l'exemple ci-dessus rend l'opération impossible : la fonction de rappel n'est pas encore appelée lorsque la mutation est actée, et il n'y a aucun moyen pour le devtool de savoir quand la fonction de rappel sera véritablement appelée. Toute mutation d'état effectuée dans la fonction de rappel est essentiellement intraçable !

### Acter des mutations dans les composants

Vous pouvez acter des mutations dans les composants avec `this.$store.commit('xxx')`, ou en utilisant la fonction utilitaire `mapMutations` qui attache les méthodes du composant aux appels de `store.commit` (nécessite l'injection de `store` à la racine) :

``` js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment' // attacher `this.increment()` à `this.$store.commit('increment')`

      // `mapMutations` supporte également les paramètres additionnels :
      'incrementBy' // attacher `this.incrementBy(amount)` à `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // attacher `this.add()` à `this.$store.commit('increment')`
    })
  }
}
```

### En avant vers les actions

L'asynchronisme combiné à la mutation de l'état peut rendre votre programme très difficile à comprendre. Par exemple, lorsque vous appelez deux méthodes avec toutes les deux des foncitons de rappel asynchrones qui changent l'état, comment savez-vous quelle fonction de rappel est appelée en première ? C'est exactement la raison pour laquelle nous voulons séparer les deux concepts. Avec Vuex, **les mutations sont des transactions synchrones** :

``` js
store.commit('increment')
// n'importe quel changement d'état de « increment » par mutation
// devrait être faite de manière synchrone.
```

Pour gérer les opérations asynchrones, tournons-nous vers les [Actions](actions.md).
