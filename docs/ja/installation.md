# インストール

## 直接ダウンロードする / CDN

[https://unpkg.com/vuex@4](https://unpkg.com/vuex@4)

<!--email_off-->
[Unpkg.com](https://unpkg.com) で NPM ベースの CDN リンクが提供されています。上記リンクは常に NPM の最新のリリースを指します。`https://unpkg.com/vuex@4.0.0/dist/vuex.global.js` のような URL によって特定のバージョン/タグを利用することもできます。
<!--/email_off-->

Vue のあとで `vuex` を取り込むと自動的に Vuex が導入されます:

```html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

## NPM

```bash
npm install vuex@next --save
```

## Yarn

```bash
yarn add vuex@next --save
```

## 開発版ビルド

最新の開発版ビルドを利用したい場合には、 GitHub から直接クローンし `vuex` を自身でビルドする必要があります。

```bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
yarn
yarn build
```
