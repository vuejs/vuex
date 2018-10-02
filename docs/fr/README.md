# Vuex, qu'est-ce que c'est ?

Vuex est un **_gestionnaire d'état (« state management pattern »)_ et une bibliothèque** pour des applications Vue.js. Il sert de zone de stockage de données centralisée pour tous les composants dans une application, avec des règles pour s'assurer que l'état ne puisse subir de mutations que d'une manière prévisible. Il s'intègre également avec [l'extension officielle](https://github.com/vuejs/vue-devtools) de Vue afin de fournir des fonctionnalités avancées comme de la visualisation d'état dans le temps et des exports et imports d’instantanés (« snapshot ») d'état.

### Un « gestionnaire d'état », qu'est-ce que c'est ?

Commençons par une simple application de comptage avec Vue :

``` js
new Vue({
  // état
  data () {
    return {
      count: 0
    }
  },
  // vue
  template: `
    <div>{{ count }}</div>
  `,
  // actions
  methods: {
    increment () {
      this.count++
    }
  }
})
```

C'est une application autosuffisante avec les parties suivantes :

- L'**état**, qui est la source de vérité qui pilote votre application,
- La **vue**, qui est une réflexion déclarative de l'**état**,
- Les **actions**, qui sont les façons possibles pour l'état de changer en réaction aux actions utilisateurs depuis la **vue**.

Voici une représentation extrêmement simple du concept de « flux de donnée unidirectionnel » :

<p style="text-align: center; margin: 2em">
  <img style="width:100%;max-width:450px;" src="/flow.png">
</p>

Cependant, la simplicité s'évapore rapidement lorsque nous avons **de multiples composants qui partagent un même état global** :

- Plusieurs vues peuvent dépendre de la même partie de l'état global.
- Des actions dans différentes vues peuvent avoir besoin de muter la même partie de l'état global.

Pour le premier problème, passer des props peut être fastidieux pour les composants profondément imbriqués, et ça ne fonctionne tout simplement pas pour les composants d'un même parent. Pour le deuxième problème, on se retrouve souvent à se rabattre sur des solutions telles qu'accéder aux références d'instance du parent/enfant direct ou essayer de muter et synchroniser de multiples copies de l'état via des évènements. Ces deux modèles sont fragiles et posent rapidement des problèmes de maintenabilité du code.

Alors pourquoi ne pas extraire l'état global partagé des composants, et le gérer dans un singleton global ? De cette manière, notre arbre de composant devient une grosse « vue », et n'importe quel composant peut accéder à l'état global ou déclencher des actions, peu importe où il se trouve dans l'arbre !

De plus, en définissant et en séparant les concepts impliqués dans la gestion de l'état global et en appliquant certaines règles, on donne aussi une structure et une maintenabilité à notre code.

Voilà l'idée de base derrière Vuex, inspiré par [Flux](https://facebook.github.io/flux/docs/overview.html), [Redux](http://redux.js.org/) et [l'architecture Elm](https://guide.elm-lang.org/architecture/). À l'inverse des autres modèles, Vuex est aussi une bibliothèque d'implémentation conçue spécialement pour Vue.js afin de bénéficier de son système de réactivité granulaire pour des modifications efficaces.

![vuex](/vuex.png)

### Quand l'utiliser ?

Bien que Vuex nous aide à gérer un état global partagé, il apporte aussi le cout de nouveaux concepts et _abstraction de code_ (« boilerplate »). C'est un compromis entre la productivité à court terme et à long terme.

Si vous n'avez jamais créé une _application monopage_ à grande échelle et que vous sautez directement dans Vuex, cela peut paraitre verbeux et intimidant. C'est parfaitement normal ; si votre application est simple, vous vous en sortirez sans doute très bien sans Vuex. Un simple [canal d'évènement global](https://vuejs.org/v2/guide/state-management.html#Simple-State-Management-from-Scratch) pourrait très bien vous suffire. Mais si vous devez créer une application monopage à moyenne ou grande échelle, il y a des chances que vous vous trouviez dans des situations qui vous feront vous interroger sur une meilleure gestion de l'état global, détaché de votre composant Vue, et Vuex sera naturellement la prochaine étape pour vous. Voici une bonne citation de Dan Abramov, l'auteur de Redux :
> « Les librairies Flux, c'est comme les lunettes : vous saurez quand vous en aurez besoin. »
