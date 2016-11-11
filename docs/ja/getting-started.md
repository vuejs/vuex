# Vuex 入門

Vuex アプリケーションの中心にあるものは **ストア** です。"ストア" は、基本的にアプリケーションの**状態**を保持するコンテナです。単純なグローバルオブジェクトとの違いが 2つあります。

1. Vuex ストアはリアクティブです。 Vue コンポーネントがストアから状態を取り出すとき、もし、ストアの状態が変化したら、ストアは、リアクティブかつ効率的に更新を行います。

2. You cannot directly mutate the store's state. The only way to change a store's state is by explicitly **committing mutations**. This ensures every state change leaves a track-able record, and enables tooling that helps us better understand our applications.

### シンプルなストア

> **NOTE:** We will be using ES2015 syntax for code examples for the rest of the docs. If you haven't picked it up, [you should](https://babeljs.io/docs/learn-es2015/)!

After [installing](installation.md) Vuex, let's create a store. It is pretty straightforward - just provide an initial state object, and some mutations:

``` js
// Make sure to call Vue.use(Vuex) first if using a module system

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

Now, you can access the state object as `store.state`, and trigger a state change with the `store.commit` method:

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

Again, the reason we are committing a mutation instead of changing `store.state.count` directly, is because we want to explicitly track it. This simple convention makes your intention more explicit, so that you can reason about state changes in your app better when reading the code. In addition, this gives us the opportunity to implement tools that can log every mutation, take state snapshots, or even perform time travel debugging.

Using store state in a component simply involves returning the state within a computed property, because the store state is reactive. Triggering changes simply means committing mutations in component methods.

Here's an example of the [most basic Vuex counter app](https://jsfiddle.net/yyx990803/n9jmu5v7/).

Next, we will discuss each core concept in much finer details, starting with [State](state.md).

2. ストアの状態を直接変更することはできません。明示的な **ミューテーション**のディスパッチによってのみ、ストアの状態を変更します。これによって、全ての状態の変更の追跡を容易にし、ツールでのアプリケーションの動作の理解を助けます。

> **注意:** 私たちは、このドキュメントのコード例に ES2015 のシンタックスを利用しています。 もし、触れたことがなければ、[ぜひ、触れてください](https://babeljs.io/docs/learn-es2015/)! このドキュメントは、他に[大規模アプリケーションの構築](https://jp.vuejs.org/guide/application.html)に書かれたコンセプトを既に読まれていることを前提にしています。

Vuex ストアの作成は、かなり単純です。ストアオブジェクトの初期状態と、いくつかのミューテーションを準備するだけです。

``` js
import Vuex from 'vuex'

const state = {
  count: 0
}

const mutations = {
  INCREMENT (state) {
    state.count++
  }
}

export default new Vuex.Store({
  state,
  mutations
})
```

`store.state` でストアオブジェクトの状態を参照でき、また、ミューションの名前でディスパッチすることで、ミューテーションをトリガーできます。

``` js
store.dispatch('INCREMENT')

console.log(store.state.count) // -> 1
```

もし、オブジェクトスタイルのディスパッチがよければ、以下のように記述して、おこなうことができます。

``` js
// 先の例と同じ効果
store.dispatch({
  type: 'INCREMENT'
})
```

もう一度、`store.state.count` を直接変更する代わりにミューテーションをディスパッチする理由について、確認しておきましょう。このシンプルな規約は、あなたのコードの意図をさらに明確にし、コードを読んだ時にアプリケーションの状態の変更について、論理的に考えることができるようにします。加えて、私たちに全ての変更のログを取ったり、状態のスナップショットを取ったり、タイムトラベルデバッグを行うようなツールを実装する余地を与えてくれます。

今回は最も単純な例を通して、ストアが何かについて説明してきました。しかし、 Vuex はストアだけではありません。次から、[ステート](state.md)、[ミューテーション](mutations.md)、[アクション](actions.md)といった Vuex のコアコンセプトについて詳しく説明していきます。
