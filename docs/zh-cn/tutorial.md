# 教程

让我们通过一个简单的实际例子来理解怎样使用 vuex。这个例子里，我们要实现一个按钮，当你点击它的时候，计数器会加一。

![End Result](tutorial/result.png)

通过这个简单的例子，我们会解释相应的概念，以及 vuex 所要解决的问题：如何管理一个包含许多组件的大型应用。假设这个例子使用了以下三个组件：

### `components/App.vue`

App 根组件，它包含了以下两个组件：

* `Display` 显示计数器当前的值
* `Increment` 使计数器加一的按钮

```html
<template>
  <div>
    <Display></Display>
    <Increment></Increment>
  </div>
</template>

<script>

import Display from './Display.vue'
import Increment from './Increment.vue'

export default {
  components: {
    Display: Display,
    Increment: Increment
  }
}
</script>
```

### `components/Display.vue`

```html
<template>
  <div>
    <h3>Count is 0</h3>
  </div>
</template>

<script>
export default {
}
</script>
```

### `components/Increment.vue`

```html
<template>
  <div>
    <button>Increment +1</button>
  </div>
</template>

<script>
export default {
}
</script>
```

### Vuex 要解决的问题

* `Increment` 和 `Display` 彼此独立, 不能直接相互传递信息。
* `App` 只能通过事件和广播去整合这两个组件。
* 因为 `App` 需要整合这两个组件，它们无法被重用，形成了紧密的互相依赖。如果需要重构它，容易导致应用的 bug。

### Vuex 的流程

我们需要依次执行这些步骤：

![Vuex Flow](tutorial/vuex_flow.png)

仅仅为了增加计数采取这么多步骤似乎有点多余。但是，这些概念的引入使得我们在大型应用里可以有效提高可维护性，在长期来看也可以使得 debug 和做后续改进工作变得更容易。那么接下来我们就用 vuex 来改写我们的代码：

### 第一步：加入 store

Store 存储应用所需要的所有数据。所有组件都会从 store 中读取数据。在我们开始之前，用 npm 安装 vuex：

```
$ npm install --save vuex
```

建一个新文件 `vuex/store.js`

```js
import Vue from 'vue'
import Vuex from 'vuex'

// 告诉 vue “使用” vuex
Vue.use(Vuex)

// 创建一个 object 存储应用启动时的状态
const state = {
  // TODO: 设置启动状态
}

// 创建一个 object 存储 mutation 函数
const mutations = {
  // TODO: set up our mutations
}

// 通过 new Vuex.Store 结合初始 state 和 mutations，创建 store
// 这个 store 将和我们的 vue 应用链接起来
export default new Vuex.Store({
  state,
  mutations
})
```

我们需要修改根组件来让我们的应用和 store 建立联系。

修改 `components/App.vue`，加上 store.

```js
import Display from './Display.vue'
import Increment from './IncrementButton.vue'
import store from '../vuex/store' // import 我们刚刚创建的 store

export default {
  components: {
    Display: Display,
    Increment: Increment
  },
  store: store // 在根组件加入 store，让它的子组件和 store 连接
}
```

> **提示**： 如果使用 ES6 和 babel 你可以这样写：
>
>     components: {
>       Display,
>       Increment,
>     },
>     store

### 第二步：创建 action

Action 是被 component 所使用的函数(function)。Action 函数能够通过 dispatch 对应的 mutation 函数来触发 store 的更新。Action 也可以从后端读取数据之后再触发更新。

创建一个新文件 `vuex/actions.js`，然后写入一个函数 `incrementCounter`：


```js
// Action 会收到 store 作为它的第一个参数
// 在 store 里我们只需要 dispatch （在有些情况下需要 state）
// 我们可以利用 ES6 的解构（destructuring）语法来简化参数的使用
export const incrementCounter = function ({ dispatch, state }) {
  dispatch('INCREMENT', 1)
}
```

然后我们从 `components/Increment.vue` 组件里调用 action 函数

```
<template>
  <div>
    <button @click='increment'>Increment +1</button>
  </div>
</template>

<script>
import { incrementCounter } from '../vuex/actions'
export default {
  vuex: {
    actions: {
      increment: incrementCounter
    }
  }
}
</script>
```

回顾一下我们刚刚写的一些有趣的东西：

1. 我们有了一个新的 object `vuex.actions`，包含着一个新的 action。
2. 我们没有指定 store, object, state 等等的东西。Vuex 会把它们串联好。
3. 我们可以使用 `this.increment()` 在任何方法里调用 action。
4. 我们也可以用 `@click` 参数，像使用普通的 vue 组件方法一样使用它。
5. 我们给 action 起名叫 `incrementCounter`，但是在使用时我们可以根据需要重新命名它。

### 第三步：创建 state 和 mutation

在我们的 `vuex/actions.js` 文件里我们 dispatch 了一个叫做 `INCREMENT` 的 mutation，但是我们还没有写它所对应的具体操作。我们现在就来做这个事。

修改 `vuex/store.js`：

```js
const state = {
  // 应用启动时，count 置为0
  count: 0
}

const mutations = {
  // Mutation 的第一个参数是当前的 state
  // 你可以在函数里修改 state
  INCREMENT (state, amount) {
    state.count = state.count + amount
  }
}
```

### 第四步：在组件获取值

创建一个新的文件 `vuex/getters.js`：

```js
// 这个 getter 函数会返回 count 的值
// 在 ES6 里你可以写成：
// export const getCount = state => state.count

export function getCount (state) {
  return state.count
}
```

这个函数返回了 state 对象里我们所需要的部分—— count 的值。我们现在在组件里加入这个 getter 函数。

修改 `components/Display.vue`：

```html
<template>
  <div>
    <h3>Count is {{ counterValue }}</h3>
  </div>
</template>

<script>
import { getCount } from '../vuex/getters'
export default {
  vuex: {
    getters: {
      // 注意在这里你需要 `getCount` 函数本身而不是它的执行结果 'getCount()'
      counterValue: getCount
    }
  }
}
</script>
```

这里我们又加入了一个新的对象 `vuex.getters`。它将 `counterValue` 绑定到了 `getCount` 这个 getter 函数上。我们给它起了一个新名字来使得这个变量在你的组件里表意更明确。

你可能有点困惑——为什么我们需要用 getter 函数而不是直接从 state 里读取数据。这个概念更多的是一种最佳实践，在大型应用里更加适用。它有这么几种明显的优势：

1. 我们可能需要使用 getter 函数返回经过计算的值（比如总数，平均值等）。
2. 在大型应用里，很多组件之间可以复用同一个 getter 函数。
3. 如果这个值的位置改变了（比如从 `store.count` 变成了 `store.counter.value`），你只需要改一个 getter 方法，而不是一堆用到它的组件。

以上便是使用 getter 带来的好处。

### 第五步：接下来……

运行一下你的应用，它应该能正常工作了。

要更深入地理解 vuex，你可以做一个小练习：尝试对这个应用做一些修改。

* 加上“减一”的按钮。
* 安装 [VueJS Devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)，尝试使用它提供的 Vuex 工具来观察 mutation 对 state 的改动。
* 加上一个新的组件，让用户可以在文本框中输入要增加的数值。这个会稍有难度，因为在 vuex 架构中表单的处理有些不同。在开始前可以先读一下[表单处理](forms.md)。
