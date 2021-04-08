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

## Yarn

```bash
yarn add vuex@next --save
```

## Promise

Vuex requires [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises). If your supporting browsers do not implement Promise (e.g. IE), you can use a polyfill library, such as [es6-promise](https://github.com/stefanpenner/es6-promise).

You can include it via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>
```

Then `window.Promise` will be available automatically.

If you prefer using a package manager such as NPM or Yarn, install it with the following commands:

```bash
npm install es6-promise --save # NPM
yarn add es6-promise # Yarn
```

Furthermore, add the below line into anywhere in your code before using Vuex:

```js
import 'es6-promise/auto'
```

## Dev Build

You will have to clone directly from GitHub and build `vuex` yourself if you want to use the latest dev build.

```bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
yarn
yarn build
```
