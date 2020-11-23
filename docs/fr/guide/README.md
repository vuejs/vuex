# Pour commencer

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cMPa2Uk" target="_blank" rel="noopener noreferrer">Essayez cette partie sur Scrimba (EN)</a></div>

Au cœur de chaque application Vuex, il y a la **zone de stockage (« store »)**. Un « store » est tout simplement un conteneur avec l'**état (« state »)** de votre application. Il y a deux choses qui différencient un store Vuex d'un simple objet global :

1. Les stores Vuex sont réactifs. Quand les composants Vue y récupèrent l'état, ils se mettront à jour de façon réactive et efficace si l'état du store a changé.

2. Vous ne pouvez pas muter directement l'état du store. La seule façon de modifier l'état d'un store est d'**acter (« commit »)** explicitement des **mutations**. Cela assure que chaque état laisse un enregistrement traçable, et permet à des outils de nous aider à mieux appréhender nos applications.

### Le store le plus simple

:::tip NOTE
Nous allons utiliser la syntaxe ES2015 dans les exemples de code pour le reste de la documentation. Si vous ne vous êtes pas encore penché dessus, [vous devriez](https://babeljs.io/docs/learn-es2015/) !
:::

Après [avoir installé](../installation.md) Vuex, nous allons créer un store. C'est assez simple ; définissez juste un objet d'état initial et quelques mutations :

``` js
// Assurez vous d'appeler `Vue.use(Vuex)` en premier lieu si vous utilisez un système de module

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

Maintenant, vous pouvez accéder à l'objet d'état avec `store.state`, et déclencher un changement d'état avec la méthode `store.commit` :

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

Encore une fois, la raison pour laquelle nous actons une mutation au lieu de modifier `store.state.count` directement, c'est parce que nous voulons le tracer explicitement. Cette simple convention rend votre intention plus explicite, ainsi vous pouvez raisonner plus facilement les changements d'état en lisant votre code. De plus, cela nous donne l'opportunité d'implémenter des outils qui peuvent enregistrer chaque mutation, prendre des instantanés de l'état, ou même procéder à de la visualisation d'état dans le temps.

Utiliser l'état du store dans un composant implique simplement de retourner l'état dans une *propriété calculée*, car l'état du store est réactif. Déclencher des changements signifie simplement d'acter des mutations dans les méthodes du composant.

Voici un exemple de l'[application de comptage Vuex la plus basique](https://jsfiddle.net/n9jmu5v7/1269/).

Ensuite, nous allons examiner chaque concept de base plus en détails, et commençons avec l'[État](state.md).
