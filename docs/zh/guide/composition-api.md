# 组合式API

可以通过调用 `useStore` 函数，来在 `setup` 钩子函数中访问 store。这与在组件中使用选项式 API 访问 `this.$store` 是等效的。

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
  }
}
```

## 访问 State 和 Getters

为了访问 state 和 getters，需要创建 `computed` 引用以保留响应性，这与在选项式 API 中创建计算属性等效。

```js
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // 在 computed 函数中访问 state
      count: computed(() => store.state.count),

      // 在computed方法中访问getter
      double: computed(() => store.getters.double)
    }
  }
}
```

## 访问 Mutations 和 Actions

访问 mutation 和 action 时，可以仅通过在 `setup` 钩子函数中提供 `commit` 和 `dispatch` 函数。

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // access a mutation
      increment: () => store.commit('increment'),

      // access an action
      asyncIncrement: () => store.dispatch('asyncIncrement')
    }
  }
}
```

## 示例

查看[组合式 API 案例](https://github.com/vuejs/vuex/tree/4.0/examples/composition)，以便了解使用 Vuex 和 Vue 的组合式API的应用案例。
