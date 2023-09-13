# Qu'est-ce que Vuex ?

::: tip NOTE
Ceci est la documentation pour Vuex 4, qui fonctionne avec Vue 3. Si vous cherchez la documentation pour Vuex 3, qui fonctionne avec Vue 2, [veuillez la consulter ici](https://v3.vuex.vuejs.org/).
:::

Vuex est un **modèle de gestion d'état + bibliothèque** pour les applications Vue.js. Il sert de store (un magasin) centralisé pour tous les composants d'une application, avec des règles garantissant que l'état ne peut être modifié que de manière prévisible.

## Qu'est-ce qu'un "State Management Pattern" ?

Commençons par une simple application de compteur Vue :

```js
const Counter = {
  // state
  data () {
    return {
      count: 0
    }
  },
  // view
  template: `
    <div>{{ count }}</div>
  `,
  // actions
  methods: {
    increment () {
      this.count++
    }
  }
}

createApp(Counter).mount('#app')
```

Il s'agit d'une application autonome comprenant les éléments suivants :

- Le **state**, la source de vérité qui dirige notre application ;
- La **view**, un mappage déclaratif de **state** ;
- Les **actions**, les manières possibles dont l'état pourrait changer en réaction aux entrées de l'utilisateur dans la **vue**.

Il s'agit d'une représentation simple du concept de "flux de données à sens unique" :

<p style="text-align: center; margin: 2em">
  <img style="width:100%; max-width:450px;" src="/flow.png">
</p>

Cependant, la simplicité tombe rapidement en panne lorsque nous avons **de multiples composants qui partagent un état commun** :

- Plusieurs vues peuvent dépendre du même élément d'état.
- Les actions de différentes vues peuvent avoir besoin de modifier le même élément d'état.

Pour le premier problème, le passage de props peut être fastidieux pour les composants profondément imbriqués, et ne fonctionne tout simplement pas pour les composants frères et sœurs. Pour le deuxième problème, nous nous retrouvons souvent à recourir à des solutions telles que la recherche de références d'instance parent/enfant directes ou la tentative de mutation et de synchronisation de copies multiples de l'état par le biais d'événements. Ces deux modèles sont fragiles et conduisent rapidement à un code difficile à maintenir.

Alors pourquoi ne pas extraire l'état partagé des composants, et le gérer dans un singleton global ? Ainsi, notre arbre de composants devient une grande "vue", et n'importe quel composant peut accéder à l'état ou déclencher des actions, peu importe où il se trouve dans l'arbre !

En définissant et en séparant les concepts impliqués dans la gestion de l'état et en appliquant des règles qui maintiennent l'indépendance entre les vues et les états, nous donnons à notre code plus de structure et de maintenabilité.

C'est l'idée de base de Vuex, inspirée par [Flux](https://facebook.github.io/flux/docs/overview), [Redux](http://redux.js.org/) et [The Elm Architecture](https://guide.elm-lang.org/architecture/). À la différence des autres modèles, Vuex est également une implémentation de bibliothèque conçue spécifiquement pour Vue.js afin de tirer parti de son système de réactivité granulaire pour des mises à jour efficaces.

Si vous souhaitez apprendre Vuex de manière interactive, vous pouvez consulter ce [Cours Vuex sur Scrimba](https://scrimba.com/g/gvuex), qui propose un mélange de screencast et de terrain de jeu de code que vous pouvez interrompre et utiliser à tout moment.

![vuex](/vuex.png)

### Quand dois-je l'utiliser ?

Vuex nous aide à gérer les états partagés au prix d'un plus grand nombre de concepts et d'éléments standard. Il s'agit d'un compromis entre la productivité à court et à long terme.

Si vous n'avez jamais construit de SPA à grande échelle et que vous sautez directement dans Vuex, cela peut sembler verbeux et décourageant. C'est tout à fait normal : si votre application est simple, vous vous passerez très probablement de Vuex. Un simple [store pattern](https://v3.vuejs.org/guide/state-management.html#simple-state-management-from-scratch) est peut-être tout ce dont vous avez besoin. Mais si vous construisez un SPA de moyenne ou grande envergure, il y a de fortes chances que vous ayez rencontré des situations qui vous ont fait réfléchir à la manière de mieux gérer l'état en dehors de vos composants Vue, et Vuex sera la prochaine étape naturelle pour vous. Il y a une bonne citation de Dan Abramov, l'auteur de Redux :

> Les bibliothèques Flux sont comme des lunettes : vous saurez quand vous en aurez besoin.
