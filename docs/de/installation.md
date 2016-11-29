# Installation

### Direkter Download / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

<!--email_off-->
[Unpkg.com](https://unpkg.com) bietet NPM-basierte CDN-Links an. Der obige Link führt immer zur aktuellsten Version auf NPM. Eine bestimmte Version kann via URL genutzt werden: `https://unpkg.com/vuex@2.0.0`.
<!--/email_off-->

Füge `vuex` nach Vue ein und es installiert sich selbst automatisch:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### NPM

``` bash
npm install vuex
```

Wenn mit einem Modulsystem genutzt, muss Vuex explizit via `Vue.use()` installiert werden:

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

Das muss nicht getan werden, wenn globale Skript-Tags genutzt werden.

### Dev Build

Die Repo muss direkt von GitHub geklont und `vuex`-Build selbst erstellt werden, wenn die aktuelle Dev-Version gewünscht ist.

``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
