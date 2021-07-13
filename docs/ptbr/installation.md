# Instalação

## Download Direto / CDN

[https://unpkg.com/vuex@4](https://unpkg.com/vuex@4)

<!--email_off-->
[Unpkg.com](https://unpkg.com) fornece os links de CDN baseados em NPM. O link acima sempre apontará para a última versão do NPM. Você também pode usar uma versão/tag específica por meio de URLs como `https://unpkg.com/vuex@4.0.0/dist/vuex.global.js`.
<!--/email_off-->

Inclua o `vuex` após o Vue e ele se instalará automaticamente:

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

## Dev Build

Você terá que clonar diretamente do GitHub e fazer a distribuição (_build_) do `vuex` se
quiser usar a compilação mais recente do dev.

```bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
yarn
yarn build
```
