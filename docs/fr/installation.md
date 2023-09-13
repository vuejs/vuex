# Installation

## Téléchargement direct / CDN

[https://unpkg.com/vuex@4](https://unpkg.com/vuex@4)

<!--email_off-->
[Unpkg.com](https://unpkg.com) fournit des liens CDN basés sur NPM. Le lien ci-dessus pointera toujours vers la dernière version sur NPM. Vous pouvez également utiliser une version/tag spécifique via des URLs comme `https://unpkg.com/vuex@4.0.0/dist/vuex.global.js`.
<!--/email_off-->

Include `vuex` after Vue and it will install itself automatically:

```html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

## NPM

```bash
npm install vuex@next --save
```

## Yarn

```bash
yarn add vuex@next --save
```

## Dev Build

Vous devrez cloner directement depuis GitHub et construire `vuex` vous-même si vous voulez utiliser la dernière version de développement.

```bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
yarn
yarn build
```
