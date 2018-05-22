# State

### Arbre d'état unique

Vuex utilise un **arbre d'état unique**, c'est-à-dire que cet unique objet contient tout l'état au niveau applicatif et sert de « source de vérité unique ». Cela signifie également que vous n'aurez qu'un seul store pour chaque application. Un arbre d'état unique rend rapide la localisation d'une partie spécifique de l'état et permet de facilement prendre des instantanés de l'état actuel de l'application à des fins de débogage.

L'arbre d'état unique n'entre pas en conflit avec la modularité. Dans les prochains chapitres, nous examinerons comment séparer votre état et vos mutations dans des sous-modules.

### Récupération d'état Vuex dans des composants Vue

Alors, comment affichons-nous l'état du store dans nos composants Vue ? Puisque les stores Vuex sont réactifs, la façon la plus simple d'y « récupérer » l'état est tout simplement de retourner une partie de l'état depuis une [une propriété calculée](https://fr.vuejs.org/guide/computed.html) :

``` js
// créons un composant Counter
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

Lorsque `store.state.count` change, cela entrainera la réévaluation de la propriété calculée, et déclenchera les actions associées au DOM.

Cependant, ce modèle oblige le composant à compter sur le singleton global du store. Lorsqu'on utilise un système de module, il est nécessaire d'importer le store dans tous les composants qui utilisent l'état du store, et il est également nécessaire de le simuler lorsque l'on teste le composant.

Vuex fournit un mécanisme pour « injecter » le store dans tous les composants enfants du composant racine avec l'option `store` (activée par `Vue.use(Vuex)`) :

``` js
const app = new Vue({
  el: '#app',
  // fournit le store avec l'option `store`.
  // cela injectera l'instance du store dans tous les composants enfants.
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

En fournissant l'option `store` à l'instance racine, le store sera injecté dans tous les composants enfants de la racine et sera disponible dans ces derniers avec `this.$store`. Mettons à jour notre implémentation de `Counter` :

``` js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

### La fonction utilitaire `mapState`

Lorsqu'un composant a besoin d'utiliser plusieurs accesseurs ou propriétés de l'état du store, déclarer toutes ces propriétés calculées peut devenir répétitif et verbeux. Afin de pallier à ça, nous pouvons utiliser la fonction utilitaire `mapState` qui génère des fonctions d'accession pour nous et nous épargne quelques coups de clavier :

``` js
// dans la version complète, des fonctions utilitaires sont exposées telles que `Vuex.mapState`
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // les fonctions fléchées peuvent rendre le code très succinct !
    count: state => state.count,

    // passer la valeur littérale 'count' revient à écrire `state => state.count`
    countAlias: 'count',

    // pour accéder à l'état local avec `this`, une fonction normale doit être utilisée
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

Il est également possible de fournir un tableau de chaines de caractères à `mapState` lorsque le nom de la propriété calculée associée est le même que le nom de l'état du store.

``` js
computed: mapState([
  // attacher `this.count` à `store.state.count`
  'count'
])
```

### Opérateur de décomposition

Notez que `mapState` renvoie un objet. Comment l'utiliser en complément des autres propriétés calculées locales ? Normalement, il faudrait utiliser un outil pour fusionner les multiples objets en un seul afin de passer cet objet final à `computed`. Cependant avec l'[opérateur de décomposition](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Op%C3%A9rateur_de_d%C3%A9composition) (qui est une proposition stage-3 ECMASCript), nous pouvons grandement simplifier la syntaxe :

``` js
computed: {
  localComputed () { /* ... */ },
  // rajouter cet objet dans l'objet `computed` avec l'opérateur de décomposition
  ...mapState({
    // ...
  })
}
```

### Les composants peuvent toujours avoir un état local

Utiliser Vuex ne signifie pas que vous devez mettre **tout** votre état dans Vuex. Bien que le fait de mettre plus d'états dans Vuex rende vos mutations d'état plus explicites et plus débogable, parfois il peut aussi rendre le code plus verbeux et indirect. Si une partie de l'état appartient directement à un seul composant, il est parfaitement sain de la laisser dans l'état local. Assurez-vous de prendre en compte les avantages et inconvénients d'une telle décision afin de vous adapter au mieux aux besoins de votre application.
