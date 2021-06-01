# Composition API

`setup` フックの中でストアにアクセスするには、`useStore` 関数を呼び出します。これは、Option API を使って、コンポーネント内で `this.$store` を取得するのと同等です。

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
  }
}
```

## ステートとゲッターへのアクセス

ステートやゲッターにアクセスするためには、リアクティビティを保持するために `computed` による参照を作成する必要があります。これは、Option API を使って、算出プロパティを作成するのと同じことです。

```js
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // computed 関数のステートにアクセスします
      count: computed(() => store.state.count),

      // computed 関数のゲッターにアクセスします
      double: computed(() => store.getters.double)
    }
  }
}
```

## ミューテーションとアクションへのアクセス

ミューテーションとアクションにアクセスするには、`setup` フック内で `commit` と `dispatch` 関数を呼び出します。

```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    return {
      // ミューテーションにアクセスする
      increment: () => store.commit('increment'),

      // アクションにアクセスする
      asyncIncrement: () => store.dispatch('asyncIncrement')
    }
  }
}
```

## Composition API での実装例

Vuex と Vue の Composition API を利用したアプリケーションの例は、[Composition API example](https://github.com/vuejs/vuex/tree/4.0/examples/composition) をご覧ください。
