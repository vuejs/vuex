# Actions

> Vuex actions 和 Flux 中的 "action creators" 是等同的概念，但是我觉得这个定义常让人感到困惑（比如分不清 actions 和 action creators）。

Actions 是用于分发 mutations 的函数。按照惯例，Vuex actions 的第一个参数是 store 实例，附加上可选的自定义参数。

``` js
// 最简单的 action
function increment (store) {
  store.dispatch('INCREMENT')
}

// 带附加参数的 action
// 使用 ES2015 参数解构
function incrementBy ({ dispatch }, amount) {
  dispatch('INCREMENT', amount)
}
```

乍一眼看上去感觉多此一举，我们直接分发 mutations 岂不更方便？实际上并非如此，还记得 **mutations 必须同步执行**这个限制么？Actions 就不受约束！我们可以在 action 内部执行**异步**操作：

``` js
function incrementAsync ({ dispatch }) {
  setTimeout(() => {
    dispatch('INCREMENT')
  }, 1000)
}
```

来看一个更加实际的购物车示例，涉及到**调用异步 API** 和 **分发多重 mutations**：


``` js
function checkout ({ dispatch, state }, products) {
  // 把当前购物车的物品备份起来
  const savedCartItems = [...state.cart.added]
  // 发出检出请求，然后乐观地清空购物车
  dispatch(types.CHECKOUT_REQUEST)
  // 购物 API 接受一个成功回调和一个失败回调
  shop.buyProducts(
    products,
    // 成功操作
    () => dispatch(types.CHECKOUT_SUCCESS),
    // 失败操作
    () => dispatch(types.CHECKOUT_FAILURE, savedCartItems)
  )
}
```

请谨记一点，必须通过分发 mutations 来处理调用异步 API 的结果，而不是依赖返回值或者是传递回调来处理结果。基本原则就是：**Actions 除了分发 mutations 应当尽量避免其他副作用**。

### 在组件中调用 Actions

你可能发现了 action 函数必须依赖 store 实例才能执行。从技术上讲，我们可以在组件的方法内部调用 `action(this.$store)` 来触发一个 action，但这样写起来有失优雅。更好的做法是把 action 暴露到组件的方法中，便可以直接在模板中引用它。我们可以使用 `vuex.actions` 选项来这么做：

``` js
// 组件内部
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... }, // state getters
    actions: {
      incrementBy // ES6 同名对象字面量缩写
    }
  }
})
```

上述代码所做的就是把原生的 `incrementBy` action 绑定到组件的 store 实例中，暴露给组件一个 `vm.increamentBy` 实例方法。所有传递给 `vm.increamentBy` 的参数变量都会排列在 store 变量后面然后一起传递给原生的 action 函数，所以调用：

``` js
vm.incrementBy(1)
```

等价于：

``` js
incrementBy(vm.$store, 1)
```

虽然多写了一些代码，但是组件的模板中调用 action 更加省力了：

``` html
<button v-on:click="incrementBy(1)">increment by one</button>
```

还可以给 action 取别名：

``` js
// 组件内部
import { incrementBy } from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions: {
      plus: incrementBy // 取别名
    }
  }
})
```

这样 action 就会被绑定为 `vm.plus` 而不是 `vm.increamentBy` 了。

### 内联 Actions

如果一个 action 只跟一个组件相关，可以采用简写语法把它定义成一行：

``` js
const vm = new Vue({
  vuex: {
    getters: { ... },
    actions: {
      plus: ({ dispatch }) => dispatch('INCREMENT')
    }
  }
})
```

### 绑定所有 Actions

如果你想简单地把所有引入的 actions 都绑定到组件中：

``` js
import * as actions from './actions'

const vm = new Vue({
  vuex: {
    getters: { ... },
    actions // 绑定所有 actions
  }
})
```

### 管理多模块 Actions

通常在大型 App 中，action 应该按不同目的进行 分组 / 模块化 管理，例如，userActions 模块用于处理用户注册、登录、注销，而 shoppingCartActions 处理购物任务。

当想要在不同组件中仅引入必需的 action 时，模块化使之更为方便。

你还可以在 action 模块中引入其他 action 模块来实现复用。

```javascript
// errorActions.js
export const setError = ({dispatch}, error) => {
  dispatch('SET_ERROR', error)
}
export const showError = ({dispatch}) => {
  dispatch('SET_ERROR_VISIBLE', true)
}
export const hideError = ({dispatch}) => {
  dispatch('SET_ERROR_VISIBLE', false)
}
```

```javascript
// userActions.js
import {setError, showError} from './errorActions'

export const login = ({dispatch}, username, password) => {
  if (username && password) {
    doLogin(username, password).done(res => {
      dispatch('SET_USERNAME', res.username)
      dispatch('SET_LOGGED_IN', true)
      dispatch('SET_USER_INFO', res)
    }).fail(error => {
      dispatch('SET_INVALID_LOGIN')
      setError({dispatch}, error)
      showError({dispatch})
    })
  }
}

```

当从一个模块中调用另一个模块的 action 时，或者调用同一模块中的另一个 action 时，切记，action 的第一个参数是 store 实例，因此应该将调用者 action 的第一个参数传递给被调用 action。

如果你使用 ES6 的解构形式来编写 action，确保调用者 action 的第一个参数包含两个 action 中用到的所有属性和方法。举例说明，调用者 action 仅使用 *dispatch* 方法，而被调用 action 使用了 *state* 属性和 *watch* 方法，那么，*dispatch*、*state* 和 *watch* 应该都出现在传递给调用者 action 的第一个形式参数中，示例如下：

```javascript
import {callee} from './anotherActionModule'

export const caller = ({dispatch, state, watch}) => {
  dispatch('MUTATION_1')
  callee({state, watch})
}
```

或者，你也可以使用老式的函数语法：

```javascript
import {callee} from './anotherActionModule'

export const caller = (store) => {
  store.dispatch('MUTATION_1')
  callee(store)
}
```
