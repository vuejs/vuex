# Structure d'une application

Vuex ne vous restreint pas vraiment dans la façon dont vous voulez structurer votre code. Il impose plutôt un set de principes de haut niveau :

1. Le state d'application est centralisé dans le store.

2. La seule façon de muer le state est de committer des **mutations**, qui sont des transactions synchrones.

3. La logique asynchrone doit être composée et encapsulée dans des **actions**.

Tant que vous suivez ces règles, c'est à vous de structurer votre projet. Si votre fichier de store devient trop gros, commencez simplement par séparer les actions, mutations et getters dans des fichiers séparés.

Pour une application non-triviale, nous aurons probablement besoin de faire appel à des modules. Voici un exemple de structure de projet :

``` bash
├── index.html
├── main.js
├── api
│   └── ... # abstractions for making API requests
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # Là où l'on assemble nos modules et exportons le store
    ├── actions.js        # Actions racine
    ├── mutations.js      # Mutations racine
    └── modules
        ├── cart.js       # cart module
        └── products.js   # products module
```

Vous pouvez jeter à un œil à [l'exemple Shopping Cart](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart).
