# Structure de l'application

Vuex ne restreint pas vraiment la façon dont vous structurez votre code. Plutôt, il applique un ensemble de principes de haut niveau :

1. L'état de l'application est centralisé dans le store.

2. La seule façon de modifier l'état est de commettre des **mutations**, qui sont des transactions synchrones.

3. La logique asynchrone doit être encapsulée dans, et peut être composée avec, des **actions**.

Tant que vous suivez ces règles, c'est à vous de structurer votre projet. Si votre fichier store devient trop gros, commencez simplement à diviser les actions, les mutations et les getters dans des fichiers séparés.

Pour toute application non triviale, nous aurons probablement besoin d'utiliser des modules. Voici un exemple de structure de projet :

```bash
├── index.html
├── main.js
├── api
│   └── ... # abstractions for making API requests
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # où nous assemblons les modules et exportons le magasin
    ├── actions.js        # Le fichier racine des actions
    ├── mutations.js      # Le fichier racine des mutations
    └── modules
        ├── cart.js       # Le module cart
        └── products.js   # Lemodule products
```

À titre de référence, consultez l'[Exemple de panier d'achat](https://github.com/vuejs/vuex/tree/4.0/examples/classic/shopping-cart).
