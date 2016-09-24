# Installation

### Direct Download / CDN

[https://unpkg.com/vuex@next](https://unpkg.com/vuex@next)

[Unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like `https://unpkg.com/vuex@2.0.0`.

Include `vuex` after Vue and it will install itself automatically:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### NPM

``` bash
npm install vuex@next
```

When used with a module system, you must explicitly install the router via `Vue.use()`:

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

You don't need to do this when using global script tags.

### Dev Build

You will have to clone directly from GitHub and build `vuex` yourself if
you want to use the latest dev build.

``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
