# Structure d'une application

Vuex ne vous restreint pas quand à la structure de code à utiliser. Il impose plutôt de respecter des principes de haut niveau :

1. L'état de l'application est centralisé dans le store.

2. La seule façon de muter l'état est d'acter des **mutations**, qui sont des transactions synchrones.

3. La logique asynchrone doit être composée et encapsulée dans des **actions**.

Tant que vous suivez ces règles, c'est à vous de structurer votre projet. Si votre fichier de store devient trop gros, commencez dès lors à séparer les actions, mutations et accesseurs dans des fichiers séparés.

Pour une application non triviale, nous aurons probablement besoin de faire appel à des modules. Voici un exemple de structure de projet :

``` bash
├── index.html
├── main.js
├── api
│   └── ... # abstraction pour faire des requêtes par API
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # là où l'on assemble nos modules et exportons le store
    ├── actions.js        # actions racine
    ├── mutations.js      # mutations racine
    └── modules
        ├── cart.js       # module de panier
        └── products.js   # module de produit
```

Vous pouvez jeter à un œil à l'[exemple de panier d'achats](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart).
