# Installation

### Téléchargement direct / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

<!--email_off-->
[Unpkg.com](https://unpkg.com) fournit des liens CDN basés sur npm. Le lien ci-dessus pointera toujours vers la dernière release sur npm. Vous pouvez aussi utiliser un tag ou une version spécifique via un URL comme `https://unpkg.com/vuex@2.0.0`.
<!--/email_off-->

Incluez `vuex` après Vue et l'installation sera automatique :

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### npm

``` bash
npm install vuex --save
```

### Yarn

``` bash
yarn add vuex
```

Lorsqu'il est utilisé avec un système de module, vous devez explicitement installer Vuex via `Vue.use()`:

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

Vous n'avez pas besoin de faire cela lors de l'utilisation des balises de script globales (`<script>`).

### Promesse
Vuex nécessite les [promesses](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Utiliser_les_promesses). Si vous supporter des navigateurs qui n'implémentent pas les promesses (par ex. IE), vous devez utiliser une bibliothèque polyfill, comme [es6-promise](https://github.com/stefanpenner/es6-promise).

Vous pouvez l'inclure par CDN :

``` html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>
```

Puis `window.Promise` sera disponible automatiquement.

Si vous préférez utiliser un gestionnaire de package comme npm ou Yarn, installez le avec les commandes suivantes :

``` bash
npm install es6-promise --save # NPM
yarn add es6-promise # Yarn
```

Puis, ajoutez la ligne ci-dessous partout dans votre code juste avant l'utilisation de Vuex :

``` js
import 'es6-promise/auto'
```

### Build de développement

Vous aurez besoin de cloner directement vuex depuis GitHub et le compiler vous-même si vous souhaitez utiliser le dernier build de développement.

``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
