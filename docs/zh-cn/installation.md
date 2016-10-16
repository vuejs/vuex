# 安装

### 直接下载 / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

[Unpkg.com](https://unpkg.com) 提供了基于 NPM 的 CDN 链接。以上的链接会一直指向 NPM 上发布的最新版本。您也可以通过 `https://unpkg.com/vuex@2.0.0` 这样的方式指定特定的版本。

在 Vue 之后引入 `vuex` 会进行自动安装：

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### NPM

``` bash
npm install vuex
```

在一个模块化的打包系统中，您必须显式地通过 `Vue.use()` 来安装 Vuex：

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
