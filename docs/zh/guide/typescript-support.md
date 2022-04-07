# TypeScript 支持

Vuex 提供了类型声明，因此可以使用 TypeScript 定义 store，并且不需要任何特殊的 TypeScript 配置。请遵循 [Vue 的基本 TypeScript 配置](https://v3.cn.vuejs.org/guide/typescript-support.html)来配置项目。

但是，如果你使用 TypeScript 来编写 Vue 组件，则需要遵循一些步骤才能正确地为 store 提供类型声明。
## store 类型推断
使用`createStore` 方法创建一个store实例时将推断出完整的 store 类型定义，支持 commit、dispatch 方法的参数感知及类型检查。

在定义 state 对象属性时推荐使用 `class` 来进行类型声明及指定默认值;

```ts
class State {
  name = ''
  count = 1
  foo?: string
  list?: string[] = []
}
const store = createStore({
  state: new State(),
  ...
}
```

## Vue 组件中 `$store` 属性的类型声明

Vuex 没有为 `this.$store` 属性提供开箱即用的类型声明。如果你要使用 TypeScript，首先需要声明自定义的[模块补充(module augmentation)](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)。

为此，需要在项目文件夹中添加一个声明文件来声明 Vue 的自定义类型 `ComponentCustomProperties` ：

```ts
// vuex.d.ts
// 引入定义好的store实列
import { store } from './store'

declare module '@vue/runtime-core' {

  // 为 `this.$store` 提供类型声明
  interface ComponentCustomProperties {
    $store: typeof store
  }
}
```
##  使用 `inject` 组合式函数类型声明
将 store 安装到 Vue 应用时，会同时将 store 注入为应用级依赖，在未指定 `InjectionKey` 时将使用 "store" 作为默认 key, 因此我们可以在组合式 API 中使用`inject('store')`来拿到 store 实例，但是却无法感知返回的数据类型，为此我们同样可以使用上面的方式给 `inject` 方法添加一个重载类型补充：

```ts
// vuex.d.ts
// 引入定义好的store实列
import { store } from './store'

// 指定需要全局声明的依赖类型
interface InjectionMap {
  'store': typeof store
}

declare module '@vue/runtime-core' {

  // 为 `this.$store` 提供类型声明
  interface ComponentCustomProperties {
    $store: InjectionMap[S]
  }
  // 将 injectionMap 中的类型进行重载补充声明
  export function inject<S extends keyof InjectionMap>(key:S):InjectionMap[S]
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
class State {
  count: number = 0
}

export const store = createStore<State>({
  state: new State()
})

// 定义 injection key
export const key: InjectionKey<typeof store> = Symbol()
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
