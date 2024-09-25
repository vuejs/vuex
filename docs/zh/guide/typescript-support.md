# TypeScript 支持

Vuex 提供了类型声明，因此可以使用 TypeScript 定义 store，并且不需要任何特殊的 TypeScript 配置。请遵循 [Vue 的基本 TypeScript 配置](https://v3.cn.vuejs.org/guide/typescript-support.html)来配置项目。

但是，如果你使用 TypeScript 来编写 Vue 组件，则需要遵循一些步骤才能正确地为 store 提供类型声明。

## Vue 组件中 `$store` 属性的类型声明

Vuex 没有为 `this.$store` 属性提供开箱即用的类型声明。如果你要使用 TypeScript，首先需要声明自定义的[模块补充(module augmentation)](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)。

为此，需要在项目文件夹中添加一个声明文件来声明 Vue 的自定义类型 `ComponentCustomProperties` ：

```ts
// vuex.d.ts
import { Store } from 'vuex'

declare module 'vue' {
  // 声明自己的 store state
  interface State {
    count: number
  }

  // 为 `this.$store` 提供类型声明
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
```

## `useStore` 组合式函数类型声明

当使用组合式 API 编写 Vue 组件时，您可能希望 `useStore` 返回类型化的 store。为了 `useStore` 能正确返回类型化的 store，必须执行以下步骤：

1. 定义类型化的 `InjectionKey`。
2. 将 store 安装到 Vue 应用时提供类型化的 `InjectionKey` 。
3. 将类型化的 `InjectionKey` 传给 `useStore` 方法。

让我们逐步解决这个问题。首先，使用 Vue 的 `InjectionKey` 接口和自己的 store 类型定义来定义 key ：

```ts
// store.ts
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

// 为 store state 声明类型
export interface State {
  count: number
}

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    count: 0
  }
})
```

然后，将 store 安装到 Vue 应用时传入定义好的 injection key。

```ts
// main.ts
import { createApp } from 'vue'
import { store, key } from './store'

const app = createApp({ ... })

// 传入 injection key
app.use(store, key)

app.mount('#app')
```

最后，将上述 injection key 传入 `useStore` 方法可以获取类型化的 store。

```ts
// vue 组件
import { useStore } from 'vuex'
import { key } from './store'

export default {
  setup () {
    const store = useStore(key)

    store.state.count // 类型为 number
  }
}
```

本质上，Vuex 将store 安装到 Vue 应用中使用了 Vue 的 [Provide/Inject](https://v3.cn.vuejs.org/api/composition-api.html#provide-inject) 特性，这就是 injection key 是很重要的因素的原因。

### 简化 `useStore` 用法

引入 `InjectionKey` 并将其传入 `useStore` 使用过的任何地方，很快就会成为一项重复性的工作。为了简化问题，可以定义自己的组合式函数来检索类型化的 store ：

```ts
// store.ts
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  count: number
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    count: 0
  }
})

// 定义自己的 `useStore` 组合式函数
export function useStore () {
  return baseUseStore(key)
}
```

现在，通过引入自定义的组合式函数，不用提供 injection key 和类型声明就可以直接得到类型化的 store：

```ts
// vue 组件
import { useStore } from './store'

export default {
  setup () {
    const store = useStore()

    store.state.count // 类型为 number
  }
}
```
