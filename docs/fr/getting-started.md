# Débuter

Au cœur de chaque application Vuex, il y a le **store**. Un "store" est tout simplement un conteneur avec le **state** de votre application. Il y a deux choses qui différencient un store Vuex d'un simple objet global :

1. Les stores Vuex sont réactifs. Quand les composants Vue y récupèrent le state, ils modifieront efficacement et de façon réactive si le state du store change.

2. Vous ne pouvez pas muter directement le state du store. La seule façon de modifier le state d'un store est de **commiter** explicitement des **mutations**. Cela assure que chaque état laisse un enregistrement traçable, et permette à des outils de mieux nous aider à comprendre nos applications.

### Le store le plus simple

> **NOTE:** Nous allons utiliser la syntaxe ES2015 dans les exemples de code pour le reste de la documentation. Si vous ne vous êtes pas encore penché dessus, [vous devriez](https://babeljs.io/docs/learn-es2015/) !

Après [avoir installé](installation.md) Vuex, nous allons créer un store. C'est assez simple &mdash; définissez juste un objet state initial et quelques mutations :

``` js
// Make sure to call Vue.use(Vuex) first if using a module system

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

Maintenant, vous pouvez accéder à l'objet state avec `store.state`, et déclencher un changement de state avec la méthode `store.commit` :

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

Encore une fois, la raison pour laquelle nous committons une mutation au lieu de modifier `store.state.count` directement, c'est parce que nous voulons le tracer explicitement. Cette simple convention rend votre intention plus explicite, ainsi vous pouvez raisonner plus facilement les changements de state en lisant votre code. De plus, cela nous donne l'opportunité d'implémenter des outils qui peuvent enregistrer chaque mutation, prendre des instantanés du state, ou même procéder à du debugging dans le temps.

Utiliser le state du store dans un composant implique simplement de retourner le state dans une *computed property*, car le state du store est réactif. Déclencher des changements signifie simplement commiter des mutations dans les méthodes du composant.

Voici un exemple de la [plus basique app Vuex de compteur](https://jsfiddle.net/n9jmu5v7/341/).

Ensuite, nous allons examiner chaque concept de base plus en détails, et commençons avec le [State](state.md).
