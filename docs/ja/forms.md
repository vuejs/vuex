# フォームのハンドリング

厳格モードで Vuex を使用するとき、Vuex に属するステートの一部において `v-model` を使用するためには少しトリッキーです:

``` html
<input v-model="obj.message">
```

`obj` が store からオブジェクトを返す算出プロパティ (computed property) と仮定すると、`v-model` はここでは、input でユーザーがタイプするとき、直接 `obj.message` を変異させようとします。厳格モードにおいて、ミューテーションは明示的に Vuex のミューテーションハンドラ内部で処理されていないため、エラーを投げます。

それに対処するための "Vuex way" は、`<input>` の値をバインディングし、そして `input` または `change` イベントでアクションを呼び出します:

``` html
<input :value="obj.message" @input="updateMessage">
```
``` js
// ...
methods: {
  updateMessage: function (e) {
    store.actions.updateMessage(e.target.value)
  }
}
```

`updateMessage` アクションが単に `'UPDATE_MESSAGE'` をディスパッチすると仮定すると、ここではミューテーションハンドラは以下のようになります:

``` js
// ...
mutations: {
  UPDATE_MESSAGE (state, message) {
    state.obj.message = message
  }
}
```

確かに、これはかなりシンプルな `v-model` よりも冗長ですが、これは、明示的で追跡可能なステートの変化させるためのコストです。同時に、Vuex は Vuex store 内部の全てのステートを置く必要がないということに注意してください。フォームのインタラクションの全てにおいて、ミューテーションの追跡を望まない場合は、単純にコンポーネントのローカルステートとして Vuex の外部にフォームのステートを保つことができ、これは自由に `v-model` を活用することができます。
