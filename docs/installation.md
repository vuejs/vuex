# Installation

## Direct Download / CDN

[https://unpkg.com/vuex@4](https://unpkg.com/vuex@4)

<!--email_off-->
[Unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like `https://unpkg.com/vuex@4.0.0/dist/vuex.global.js`.
<!--/email_off-->

Include `vuex` after Vue and it will install itself automatically:

```html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

## NPM

```bash
npm install vuex@next --save
```

## Vue CLI

If you have a project using [Vue CLI](https://cli.vuejs.org/) you can add Vuex as a plugin. **It will also overwrite your `App.vue`** so make sure to backup the file before running the following command inside your project:

```bash
vue add vuex
```

## Yarn

```bash
yarn add vuex@next --save
```

## Dev Build

You will have to clone directly from GitHub and build `vuex` yourself if you want to use the latest dev build.

```bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
yarn
yarn build
```
