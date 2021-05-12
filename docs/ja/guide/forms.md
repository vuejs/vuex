# フォームの扱い

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cqKRgEC9" target="_blank" rel="noopener noreferrer">Scrimba のレッスンを試す</a></div>

厳格モードで Vuex を使用するとき、Vuex に属する状態の一部で `v-model` を使用するのは少しトリッキーです:

``` html
<input v-model="obj.message">
```

`obj` がストアからオブジェクトを返す算出プロパティ (computed property) と仮定すると、`v-model` は input でユーザーが入力するとき、直接 `obj.message` を変更します。厳格モードでは、この変更は明示的に Vuex のミューテーションハンドラ内部で処理されていないため、エラーを投げます。

それに対処するための "Vuex way" は、`<input>` の値をバインディングし、`input` または `change` イベントでアクションを呼び出すことです:

``` html
<input :value="message" @input="updateMessage">
```
``` js
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```

ミューテーションのハンドラは以下のようになります:

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

## 双方向算出プロパティ

確かに、上記の例は単純な `v-model` と ローカルステートよりもかなり冗長で、`v-model` のいくつかの有用な機能が使えません。代わりに、セッターで双方向算出プロパティを使うアプローチがあります。

``` html
<input v-model="message">
```
``` js
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```
