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

### Build de développement

Vous aurez besoin de cloner directement vuex depuis GitHub et le compiler vous-même si vous souhaitez utiliser le dernier build de développement.

``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
