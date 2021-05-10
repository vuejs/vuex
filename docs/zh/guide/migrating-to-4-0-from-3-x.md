# 从 3.x 迁移到 4.0

几乎所有的 Vuex 4 API 都与 Vuex 3 保持不变。但是，仍有一些非兼容性变更需要注意。

- [非兼容性变更](#非兼容性变更)
  - [安装过程](#安装过程)
  - [TypeScript 支持](#TypeScript-支持)
  - [Bundles 已经与 Vue 3 配套](#Bundles-已经与-Vue-3-配套)
  - [“createLogger”函数从核心模块导出](#createLogger函数从核心模块导出)
- [新特性](#新特性)
  - [全新的“useStore”组合式函数](#全新的-usestore-组合式函数)

## 非兼容性变更

### 安装过程

为了与 Vue 3 初始化过程保持一致，Vuex 的安装方式已经改变了。用户现在应该使用新引入的 `createStore` 方法来创建 store 实例。

```js
import { createStore } from 'vuex'

export const store = createStore({
  state () {
    return {
      count: 1
    }
  }
})
```

要将 Vuex 安装到 Vue 实例中，需要用 `store` 替代之前的 Vuex 传递给 `use` 方法。

```js
import { createApp } from 'vue'
import { store } from './store'
import App from './App.vue'

const app = createApp(App)

app.use(store)

app.mount('#app')
```

:::tip 提示
从技术上讲这并不是一个非兼容性变更，仍然可以使用 `new Store(...)` 语法，但是建议使用上述方式以保持与 Vue 3 和 Vue Router Next 的一致。
:::

### TypeScript 支持

为了修复 [issue #994](https://github.com/vuejs/vuex/issues/994)，Vuex 4 删除了 `this.$store` 在 Vue 组件中的全局类型声明。当使用 TypeScript 时，必须声明自己的[模块补充(module augmentation)](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)。

将下面的代码放到项目中，以允许 `this.$store` 能被正确的类型化：

```ts
// vuex-shim.d.ts

import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // 声明自己的 store state
  interface State {
    count: number
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
```

在 [TypeScript 支持](./typescript-support)章节可以了解到更多。

### Bundles 已经与 Vue 3 配套

下面的 bundles 分别与 Vue 3 的 bundles 配套：

- `vuex.global(.prod).js`
  - 通过`<script src="...">` 标签直接用在浏览器中，将 Vuex 暴露为全局变量。
  - 全局构建为 IIFE ， 而不是 UMD ，并且只能与 `<script src="...">` 一起使用。
  - 包含硬编码的 prod/dev 分支，并且生产环境版本已经压缩过。生产环境请使用 `.prod.js` 文件。
- `vuex.esm-browser(.prod).js`
  - 用于通过原生 ES 模块导入使用(在浏览器中通过 `<script type="module">` 标签使用)。
- `vuex.esm-bundler.js`
  - 用于与 `webpack`， `rollup`， `parcel` 等构建工具一起使用。
  - 通过 `process.env.NODE_ENV` 环境变量决定应该运行在生产环境还是开发环境（必须由构建工具替换）。
  - 不提供压缩后的构建版本(与打包后的其他代码一起压缩)
- `vuex.cjs.js`
  - 通过 `require` 在 Node.js 服务端渲染使用。

### “createLogger”函数从核心模块导出

在 Vuex 3 中，`createLogger` 方法从 `vuex/dist/logger` 文件中导出，但是现在该方法已经包含在核心包中了，应该直接从 `vuex` 包中引入。

```js
import { createLogger } from 'vuex'
```

## 新特性

### 全新的“useStore”组合式函数

Vuex 4 引入了一个新的 API 用于在组合式 API 中与 store 进行交互。可以在组件的 `setup` 钩子函数中使用 `useStore` 组合式函数来检索 store。

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
  }
}
```

在 [组合式 API](./composition-api) 章节可以了解到更多。
