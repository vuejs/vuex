# Mode strict

Pour activer le mode strict, passez simplement l'option `strict: true` lorsque vous créez un store Vuex :

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

En mode strict, lorsque l'état de Vuex est modifié en dehors des gestionnaires de mutation, une erreur sera lancée. Cela permet de s'assurer que toutes les mutations de l'état peuvent être explicitement tracées par les outils de debugging.

### Développement vs. production

**N'activez pas le mode strict lorsque vous déployez en production !** Le mode strict lance une observation récursive de l'état de l'arbre pour détecter des mutations inappropriées. Assurrez-vous de l'avoir désactivé en production pour éviter un coût sur les performances.

Tout comme les plugins, nous pouvons laisser nos outils de build gérer ça :

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
