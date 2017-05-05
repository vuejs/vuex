# Pour traduire la documentation de vuex

### Workflow de travail

Cette branche de travail `working` est volontairement mise en avant et doit uniquement être mise à jour dans le sens :

`vuejs/vuex:dev` --> `vuejs-fr/vuex:working`.

Nous traduisons les fichiers directement dans le dossier `en` sans les renommer. Cela permet lors de la mise à jour de la documentation via l'utilisation des commandes :

```
git fetch upstream
git merge upstream/master
```

d'obtenir des conflits **sur les pages déjà traduites** et ainsi maintenir la documentation à jour en fonction des modifications à travers **les documents déjà traduits**.

### Traduction

Pour savoir ce qui est [en cours de traduction](https://github.com/vuejs-fr/vuex/issues/1) ou [comment traduire un fichier](https://github.com/vuejs-fr/vuex/issues/2), référez vous aux issues correspondantes.

### Reverssement

Quand un fichier traduit est validé par pull request, on le met à jour dans le dossier `fr` de `vuejs-fr/vuex:dev` puis on propose une pull request au site principal :

`vuejs-fr/vuex:dev` --> `vuejs/vuex:dev`

ainsi le dossier officiel hébergeant la documentation possède bien le dossier `fr` en français et le dossier `en` en anglais.

Note : il peut être intéressant de faire une pull request par ficher validé et donc de créer une branche dérivée de `vuejs-fr/vuex:dev` pour faire la pull request (`vuejs-fr/vuex:dev` --> `vuejs-fr/vuex:only_one_changed_file_from_master` --> `vuejs/vuex:dev`)
