# Installation

### Téléchargement direct / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

[Unpkg.com](https://unpkg.com) fournit des liens CDN basés sur NPM. Le lien ci-dessus pointera toujours sur la dernière release sur NPM. Vous pouvez aussi utiliser un tag ou une version spécifique comme `https://unpkg.com/vuex@2.0.0`.

Incluez `vuex` après Vue et l'installation sera automatique :

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### NPM

``` bash
npm install vuex
```

Lorsque vous utilisez un système de modules, vous devez explicitement installer le router via `Vue.use()`:

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

Il n'est pas nécessaire de faire ceci lorsque vous utilisez des balises de script globales.

### Environnement de dev

Vous devrez cloner directement depuis GitHub et compiler `vuex` vous-même si
vous voulez utiliser la dernière version de dev.

``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
