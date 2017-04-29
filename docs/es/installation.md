# Instalación

### Descarga Directa / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

<!--email_off-->
[Unpkg.com](https://unpkg.com) ofrece links CDN basados en NPM. El primer link siempre apuntará a la versión mas reciente desplegada en NPM. Puedes especificar una versión o tag a traves de URL: `https://unpkg.com/vuex@2.0.0`.
<!--/email_off-->

Incluye `vuex` después de Vue y se instalará automáticamente:

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

En caso de utilizar un sistema modular, deberás instalar Vuex de manera explícita por medio de `Vue.use()`:

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

Esto no será necesario si tus scripts son globales.

### Build de Desarrollo

Deberás clonar Vuex directamente de GitHub y lanzar el build tú mism@ si quieres tener acceso a la última versión en desarrollo.

``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
