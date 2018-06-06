# Instalação

### Download Direto / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

<!--email_off-->
[Unpkg.com](https://unpkg.com) fornece os links de CDN baseados em NPM. O link acima sempre apontará para a última versão do NPM. Você também pode usar uma versão/tag específica por meio de URLs como `https://unpkg.com/vuex@2.0.0`.
<!--/email_off-->

Inclua o `vuex` após o Vue e ele se instalará automaticamente:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### NPM

``` bash
npm install vuex --save
```

### Yarn

``` bash
yarn add vuex
```

Quando usado com um sistema de módulos, você deve instalar o Vuex obrigatóriamente via `Vue.use()`:

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

Você não precisa fazer isso se for incluir o `vuex` via tags script.

### Promise

Vuex requer [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises). Se os seus navegadores não implementarem o _Promise_ (e.g. IE), você pode usar uma biblioteca _polyfill_, como a [es6-promise](https://github.com/stefanpenner/es6-promise).

Você pode incluí-la via CDN:

``` html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>
```

Então o `window.Promise` estará disponível automaticamente.

Se você preferir usar um gerenciador de pacotes como NPM ou Yarn, instale-o com os seguintes comandos:

``` bash
npm install es6-promise --save # NPM
yarn add es6-promise # Yarn
```

Além disso, adicione a linha abaixo em qualquer lugar no seu código antes de usar o Vuex:

``` js
import 'es6-promise/auto'
```

### Dev Build

Você terá que clonar diretamente do GitHub e fazer o _build_ do `vuex` se
quiser usar a compilação mais recente do dev.

``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
