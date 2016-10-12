# Strict Mode

Pour activer le mode strict, passez simplement l'option `strict: true` lorsque vous créez un store Vuex :

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

En mode strict, lorsque le state Vuex est modifié en dehors des handlers de mutation, une erreur sera lancée. Cela permet de s'assurer que toutes les mutations du state peuvent être explicitement tracées par les outils de debugging.

### Développement vs. Production

**N'activez pas le mode strict lorsque vous déployez en production !** Le mode strict lance une profonde observation de state tree pour détecter des mutations inappropriées &mdash; assurrez-vous de l'avoir désactivé en production pour éviter un coût sur les performances.

Tout comme les plugins, nous pouvons laisser nos outils de build gérer ça :

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
