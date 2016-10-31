# 導入方法

### 直接のDownload / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

[Unpkg.com](https://unpkg.com) で NPM ベースの CDN リンクが提供されています。上記リンクは常に NPM の最新のリリースを指します。`https://unpkg.com/vuex@2.0.0` のような URL によって特定のバージョン/タグを利用することもできます。

Vue のあとで `vuex` を取り込むと自動的に Vuex が導入されます:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### NPM

``` bash
npm install vuex
```

モジュールシステムで利用される場合、 `Vue.use()` によって Vuex を明示的に導入する必要があります:

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

グローバルなスクリプトタグを利用する場合にはこのようにする必要はありません。

### 開発版ビルド

最新の開発版ビルドを利用したい場合には、 Github から直接クローンし `vuex` を自身でビルドする必要があります。

``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
