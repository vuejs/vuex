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

### プロミス

Vuex は[プロミス (Promise)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) を必要とします。ブラウザでプロミスが実装されていない(例 IE)場合は、[es6-promise](https://github.com/stefanpenner/es6-promise) のようなポリフィルライブラリを使用できます。

CDN 経由でそれを含めることができます:

``` html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>
```

`window.Promise` は自動的に有効になります。

NPM または Yarn のようなパッケージマネージャーを使用するのを希望する場合は、以下のコマンドでインストールします:

``` bash
npm install es6-promise --save # NPM
yarn add es6-promise # Yarn
```

さらに、Vuex を使用する前に、コードのどこかに次のを行を追加します:

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
