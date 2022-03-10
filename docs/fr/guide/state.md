# État

## Arbre à état unique

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cWw3Zhb" target="_blank" rel="noopener noreferrer">Essayez cette leçon sur le Scrimba</a></div>

Vuex utilise un **arbre d'état unique** - c'est-à-dire que cet objet unique contient tout l'état de votre application et sert de "source unique de vérité". Cela signifie également que vous n'aurez généralement qu'un seul store pour chaque application. Un arbre d'état unique facilite la localisation d'un élément d'état spécifique et nous permet de prendre facilement des instantanés de l'état actuel de l'application à des fins de débogage.

L'arbre d'état unique n'est pas en contradiction avec la modularité - dans les chapitres suivants, nous verrons comment diviser votre état et vos mutations en sous-modules.

Les données que vous stockez dans Vuex suivent les mêmes règles que les `data` dans une instance Vue, c'est-à-dire que l'objet state doit être simple. **Voir aussi:** [Vue#data](https://v3.vuejs.org/api/options-data.html#data-2).

## Obtenir l'état Vuex dans les composants Vue

Alors comment afficher l'état du store dans nos composants Vue ? Puisque les stores Vuex sont réactifs, la façon la plus simple de "récupérer" l'état du store est simplement de retourner l'état du store à partir d'une [propriété calculée](https://vuejs.org/guide/computed.html) :

```js
// créons un composant Compteur
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

Chaque fois que `store.state.count` change, la propriété calculée sera réévaluée et les mises à jour du DOM associées seront déclenchées.

Cependant, ce modèle oblige le composant à s'appuyer sur le singleton global du magasin. Lorsqu'on utilise un système de modules, il faut importer le store dans chaque composant qui utilise l'état du store, et il faut également utiliser le mocking pour tester le composant.

Vuex "injecte" le store dans tous les composants enfants à partir du composant racine via le système de plugin de Vue, et sera disponible sur eux en tant que `this.$store`. Mettons à jour notre implémentation de `Counter` :

```js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

## L'aide `mapState`.

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/c8Pz7BSK" target="_blank" rel="noopener noreferrer">Essayez cette leçon sur Scrimba</a></div>

Lorsqu'un composant doit utiliser plusieurs propriétés ou getters d'état de stockage, la déclaration de toutes ces propriétés calculées peut devenir répétitive et verbeuse. Pour faire face à ce problème, nous pouvons utiliser l'aide `mapState` qui génère des fonctions getter calculées pour nous, ce qui nous épargne quelques frappes :

```js
// dans les constructions complètes les aides sont exposées comme Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // les fonctions flèches peuvent rendre le code très succinct !
    count: state => state.count,

    // passer la chaîne de valeur "count" est identique à "state => state.count".
    countAlias: 'count',

    // pour accéder à l'état local avec `this`, une fonction normale doit être utilisée
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

Nous pouvons également passer un tableau de chaînes à `mapState` lorsque le nom d'une propriété calculée mappée est le même que celui d'un sous-arbre d'état.

```js
computed: mapState([
  // map this.count to store.state.count
  'count'
])
```

## Opérateur de diffusion d'objets

Notez que `mapState` renvoie un objet. Comment l'utiliser en combinaison avec d'autres propriétés locales calculées ? Normalement, nous devrions utiliser un utilitaire pour fusionner plusieurs objets en un seul afin de pouvoir passer l'objet final à `computed`. Cependant, avec l'opérateur [opérateur de diffusion d'objets](https://github.com/tc39/proposal-object-rest-spread), nous pouvons simplifier considérablement la syntaxe :

```js
computed: {
  localComputed () { /* ... */ },
  // mélanger le tout dans l'objet externe avec l'opérateur de propagation d'objet.
  ...mapState({
    // ...
  })
}
```

## Les composants peuvent toujours avoir un état local

Utiliser Vuex ne signifie pas que vous devez mettre **tout** l'état dans Vuex. Bien que mettre plus d'état dans Vuex rende vos mutations d'état plus explicites et déboguables, parfois cela pourrait aussi rendre le code plus verbeux et indirect. Si un élément d'état appartient strictement à un seul composant, il peut être tout à fait correct de le laisser en tant qu'état local. Vous devez évaluer les compromis et prendre des décisions qui correspondent aux besoins de développement de votre application.
