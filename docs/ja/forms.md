# フォームのハンドリング

厳格モードで Vuex を使用するとき、Vuex に属するステートの一部において `v-model` を使用するのは少しトリッキーです:

``` html
<input v-model="obj.message">
```

`obj` がストアからオブジェクトを返す算出プロパティ (computed property) と仮定すると、`v-model` はここでは、input でユーザーがタイプするとき、直接 `obj.message` を変更させようとします。厳格モードにおいて、この変更は明示的に Vuex のミューテーションハンドラ内部で処理されていないため、エラーを投げます。

それに対処するための "Vuex way" は、`<input>` の値をバインディングし、そして `input` または `change` イベントでアクションを呼び出します:

``` html
<input :value="message" @input="updateMessage">
```
``` js
// ...
vuex: {
  getters: {
    message: state => state.obj.message
  },
  actions: {
    updateMessage: ({ dispatch }, e) => {
      dispatch('UPDATE_MESSAGE', e.target.value)
    }
  }
}
```

ミューテーションのハンドラは以下のようになります:

``` js
// ...
mutations: {
  UPDATE_MESSAGE (state, message) {
    state.obj.message = message
  }
}
```

確かに、これは単純な `v-model` よりもかなり冗長ですが、これは、ステートの変化を明示的で追跡可能にするためのコストです。同時に、 Vuex ストア内部に全てのステートを置く必要はないということに注意してください。フォームのインタラクションの全てにおいて、ミューテーションの追跡を望まない場合は、単純にコンポーネントのローカルステートとして Vuex の外部にフォームのステートを保つことができ、これは自由に `v-model` を活用することができます。

`v-model` を Vuex ストア内のステートに対して活用するための代わりのアプローチとして、コンポーネントの算出プロパティのセッターを使う方法があります。このアプローチでは lazy、number、debounce といったすべてのパラメータ属性の利点を享受することができます。

``` html
<input v-model="thisMessage">
```
``` js
// ...
vuex: {
  getters: {
    message: state => state.obj.message
  },
  actions: {
    updateMessage: ({ dispatch }, value) => {
      dispatch('UPDATE_MESSAGE', value)
    }
  }
},
computed: {
  thisMessage: {
    get () {
      return this.message
    },
    set (val) {
      this.updateMessage(val)
    }
  }
}
```

ミューテーションには変更はありません。
