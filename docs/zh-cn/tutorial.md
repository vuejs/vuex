# 简易教程

让我们通过一个简单的实际例子来理解怎样使用 Vuex。这个例子里，我们要实现一个按钮，每点击它一次，计数器加一。

![End Result](tutorial/result.png)

我们会通过这个例子解释相应的概念，以及 Vuex 所要解决的问题：如何管理一个包含许多组件的大型应用。我们假定这个例子使用以下三个组件：

### `components/App.vue`

根组件，它包含了两个另外的子组件：

* `Display` 显示当前计数器的值
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

### 在没有 Vuex 的日子里

* `Increment` 与 `Display` 彼此无法感知到彼此的存在，也无法相互传递消息。是怎样的孤独。
* `App` 将必须通过事件(events)与广播(broadcasts)与其他两个组件进行协调。
* 而 `App` 作为二者之间的协调者，导致这些组件并没法被复用，被迫紧密耦合。调整应用的结构，则可能导致应用崩溃。

### Vuex 的流程

我们需要依次执行这些步骤：

![Vuex Flow](tutorial/vuex_flow.png)

仅仅为了增加计数而采取这么多步骤显然很多余。但请注意，这些概念的引入是为了构建大型应用，提高可维护性，降低调试与长期维护的难度而设计的。（译注：换言之，这是屠龙刀，拿来杀鸡只是为了让我们好懂）好，那么接下来我们就用 vuex 来进行重构吧！

### 第一步：加入 store

store 存储应用所需的数据。所有组件都从 store 中读取数据。在我们开始之前，先用 npm 安装 Vuex：

```
$ npm install --save vuex
```

建一个新文件 `vuex/store.js`

```js
import Vue from 'vue'
import Vuex from 'vuex'

// 告诉 vue “使用” vuex
Vue.use(Vuex)

// 创建一个对象来保存应用启动时的初始状态
const state = {
  // TODO: 放置初始状态
}

// 创建一个对象存储一系列我们接下来要写的 mutation 函数
const mutations = {
  // TODO: 放置我们的状态变更函数
}

// 整合初始状态和变更函数，我们就得到了我们所需的 store
// 至此，这个 store 就可以连接到我们的应用中
export default new Vuex.Store({
  state,
  mutations
})
```

我们需要修改根组件来让应用注意到 store 的存在位置。

修改 `components/App.vue`，注入 store。

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

> **提示**：如果使用 ES6 和 babel 你可以这样写：
>
>     components: {
>       Display,
>       Increment,
>     },
>     store

### 第二步：创建 action

action 是一种专门用来被 component 调用的函数。action 函数能够通过分发相应的 mutation 函数，来触发对 store 的更新。action 也可以先从 HTTP 后端或 store 中读取其他数据之后再分发更新事件。

创建一个新文件 `vuex/actions.js`，然后写入一个函数 `incrementCounter`：

```js
// action 会收到 store 作为它的第一个参数
// 既然我们只对事件的分发（dispatch 对象）感兴趣。（state 也可以作为可选项放入）
// 我们可以利用 ES6 的解构（destructuring）功能来简化对参数的导入
export const incrementCounter = function ({ dispatch, state }) {
  dispatch('INCREMENT', 1)
}
```

然后我们从 `components/Increment.vue` 组件里调用 action 函数

```html
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

回顾一下我们刚刚添加的内容背后所潜藏的一些有趣的点：

1. 我们有了一个新对象 `vuex.actions`，包含着新的 action。
2. 我们没有指定特定的 store, object, state 等等。Vuex 会自动把它们串联好。
3. 我们可以用 `this.increment()` 在任何方法中调用此 action。
4. 我们也可以通过 `@click` 参数调用它，与使用其他普通的 Vue 组件方法并无二致。
5. 我们给 action 起名叫 `incrementCounter`，但是在具体使用时，我们可以根据需要进行重新命名。

### 第三步：创建 state 和 mutation

在我们的 `vuex/actions.js` 文件里我们 dispatch 了一个叫做 `INCREMENT` 的 mutation，但是我们还没有写它所对应的具体操作。我们现在就来做这个事。

修改 `vuex/store.js`：

```js
const state = {
  // 应用启动时，count 置为0
  count: 0
}

const mutations = {
  // mutation 的第一个参数是当前的 state
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

你可能有点困惑——为什么我们需要用 getter 函数而不是直接从 state 里读取数据。这个概念更多的是一种最佳实践，在大型应用里更加适用。它有这么几种独特优势：

1. 我们可能需要使用 getter 函数返回需经过计算的值（比如总数，平均值等）。
2. 在大型应用里，很多组件之间可以复用同一个 getter 函数。
3. 如果这个值的位置改变了（比如从 `store.count` 变成了 `store.counter.value`），你只需要改一个 getter 方法，而不是一堆组件。

以上便是使用 getter 带来的好处。

### 第五步：接下来……

运行一下你的应用，它应该能正常工作了。

要更深入地理解 Vuex，你可以尝试以下挑战，对该应用进行少许修改，权当练习，嗯~

* 加一个“减一”的按钮。
* 安装 [VueJS Devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)，尝试使用它提供的 Vuex 工具来观察 mutation 是如何生效的。
* 添加一个名为 `IncrementAmount ` 的文本框组件，让用户可以输入要增加的数值。这个可能会稍有难度，因为表单在 vuex 中与原生的表现稍有不同。可以读一下[表单处理](forms.md)章节了解更多内容。
