# State

### Single State Tree

Vuex utilise un **single state tree** &mdash; cet unique objet contient tout le state au niveau applicatif et sert de "source unique de vérité". Cela signifie également que vous n'aurez qu'un seul store pour chaque application. Un _single state tree_ rend rapide la localisation d'une partie de state spécifique, et nous permet de facilement prendre des instantanés du state actuel de l'application à des fins de debugging.

Le _single state tree_ n'entre pas en conflit avec la modularité &mdash; dans les prochains chapitres, nous examinerons comment séparer votre state et vos mutations dans des sous-modules.

### Récupérer le state Vuex dans des composants Vue

Alors, comment affichons-nous le state du store dans nos composants Vue ? Puisque les stores Vuex sont réactifs, la façon la plus simple d'y "récupérer" le state est de simplement retourner une partie du state depuis une [computed property](http://vuejs.org/guide/computed.html) :

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

Lorsque `store.state.count` change, cela entraînera la ré-évaluation de la computed property, et déclenchera les actions DOM associées.

Cependant, ce pattern oblige le composant à compter sur le singleton global du store. Lorsqu'on utilise un système de module, il est nécessaire d'importer le store dans tous les composants qui utilisent le state du store, et il est également nécessaire de créer un mock lorsque l'on teste le composant.

Vuex fournit un méchanisme pour "injecter" le store dans tous les composants enfants du composant racine avec l'option `store` (activée par `Vue.use(Vuex)`) :

``` js
const app = new Vue({
  el: '#app',
  // fournit le store avec l'option "store".
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

En fournissant l'option `store` à l'instance racine, le store sera injecté dans tous les composants enfants de la racine et sera disponible sur ceux-ci avec `this.$store`. Mettons à jours notre implémentation de `Counter` :

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

### Le helper `mapState`

Lorsqu'un composant a besoin d'utiliser plusieurs propriétés ou getters du state du store, déclarer toutes ces computed properties peut devenir répétitif et verbeux. Afin de palier à ça, nous pouvons utiliser le helper `mapState` qui génère des fonctions getters pour nous et nous épargne quelques coups de clavier :

``` js
// dans la version standalone, les helpers sont exposés comme Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // les fonctions fléchées peuvent rendre le code très succinct !
    count: state => state.count,

    // passer la valeur littérale 'count' revient à écrire `state => state.count`
    countAlias: 'count',

    // pour accéder au state local avec `this`, une fonction normale doit être utilisée
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

Il est également possible de fournir un tableau de chaînes de caractères à `mapState` lorsque le nom de la propriété du state du store est la même que celui du composant.

``` js
computed: mapState([
  // attacher this.count à store.state.count
  'count'
])
```

### Object Spread Operator

Notez que `mapState` renvoie un objet. Comment l'utiliser en complément des autres computed properties locales ? Normalement, il faudrait utiliser un outil pour fusionner les multiples objets en un seul afin de passer cet objet final à `computed`. Cependant avec le [object spread operator](https://github.com/sebmarkbage/ecmascript-rest-spread) (qui est une proposition stage-3 ECMASCript), nous pouvons grandement simplifier la syntaxe :

``` js
computed: {
  localComputed () { /* ... */ },
  // rajouter cet objet dans l'objet `computed` avec l'object spread operator
  ...mapState({
    // ...
  })
}
```

### Les composants peuvent toujours avec un state local

Utiliser Vuex ne signifie pas que vous devez mettre **tout** votre state dans Vuex. Bien que le fait de mettre plus de state dans Vuex rende vos mutations de state plus explicites et plus debuggables, parfois il peut aussi rendre le code plus verbeux et indirect. Si une partie de state appartient directement à un seul composant, il est parfaitement sain de la laisser dans le state local. Assurez vous de prendre en compte les avantages et inconvénients d'une telle décision afin de vous adaptez le mieux aux besoins de votre application.
