# Instalação

### Download Direto / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

<!--email_off-->
[Unpkg.com](https://unpkg.com) te dá links CND baseados no NPM. O link acima vai sempre te entregar a última versão no NPM. Você pode também usar uma versão/tag específica via URLS como `https://unpkg.com/vuex@2.0.0`.
<!--/email_off-->

Inclua `vuex` depois do Vue e ele vai se instalar automaticamente:

``` html
<script src="/caminho/para/vue.js"></script>
<script src="/caminho/para/vuex.js"></script>
```

### NPM

``` bash
npm install vuex --save
```

### Yarn

``` bash
yarn add vuex
```

Quando usado com um sistema de módulos, você deve instalar o Vuex explicitamente via  `Vue.use()`:

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

Você não precisa fazer isso quando for usar tags de script globais.


### Build de Desenvolvimento

Você vai ter que clonar diretamente do Github e dar build `vuex` você mesmo se quiser usar a última build de desenvolvimento.


``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
