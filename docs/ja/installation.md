# インストール

### 直接ダウンロードする / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

<!--email_off-->
[Unpkg.com](https://unpkg.com) で NPM ベースの CDN リンクが提供されています。上記リンクは常に NPM の最新のリリースを指します。`https://unpkg.com/vuex@2.0.0` のような URL によって特定のバージョン/タグを利用することもできます。
<!--/email_off-->

Vue のあとで `vuex` を取り込むと自動的に Vuex が導入されます:

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

モジュールシステムで利用される場合、 `Vue.use()` によって Vuex を明示的に導入する必要があります:

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

グローバルなスクリプトタグを利用する場合にはこのようにする必要はありません。

### Promise

 Vuex requires [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises). If your supporting browsers do not implement Promise (e.g. IE), you can use a polyfill library, such as [es6-promise](https://github.com/stefanpenner/es6-promise).
 You can include it via CDN:

 ``` html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>
```

 Then `window.Promise` will be available automatically.

 If you prefer using a package manager such as NPM or Yarn, install it with the following commands:

 ``` bash
npm install es6-promise --save # NPM
yarn add es6-promise # Yarn
```

 Furthermore, add the below line into anywhere in your code before using Vuex:

 ``` js
import 'es6-promise/auto'
```

### 開発版ビルド

最新の開発版ビルドを利用したい場合には、 Github から直接クローンし `vuex` を自身でビルドする必要があります。

``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
