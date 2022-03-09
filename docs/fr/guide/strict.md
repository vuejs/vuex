# Mode strict

Pour activer le mode strict, il suffit de passer dans `strict : true` lors de la création d'un magasin Vuex :

```js
const store = createStore({
  // ...
  strict: true
})
```

En mode strict, chaque fois que l'état de Vuex est muté en dehors des gestionnaires de mutation, une erreur est déclenchée. Cela garantit que toutes les mutations d'état peuvent être suivies explicitement par les outils de débogage.

## Développement vs. production

**Le mode strict exécute un observateur profond synchrone sur l'arbre d'état pour détecter les mutations inappropriées, et il peut être assez coûteux lorsque vous effectuez une grande quantité de mutations de l'état. Assurez-vous de le désactiver en production pour éviter les coûts de performance.

Comme pour les plugins, nous pouvons laisser les outils de construction s'en charger :

```js
const store = createStore({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
