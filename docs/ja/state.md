# ステート と ゲッター

### 単一ステートツリー

Vuex は**単一ステートツリー (single state tree)**を使います。つまり、この単一なオブジェクトはアプリケーションレベルの状態が全て含まれており、"信頼できる唯一の情報源 (single source of truth)" として機能します。単一ステートツリーは状態の特定の部分を見つけること、デバッグのために現在のアプリケーションの状態のスナップショットを撮ることを容易にします。

単一ステートツリーはモジュール性とコンフリクト(競合)しません。以降の章で、アプリケーションの状態とミューテーション(変更)をサブモジュールに分割する方法について説明します。

### Vuex の状態を Vue コンポーネントに入れる

ストアにある状態を Vue コンポーネント に表示するにはどうすればよいのでしょう？　Vuex ストア はリアクティブなので、ストアから状態を"取り出す"一番シンプルな方法は、単純にいくつかのストアの状態を [算出プロパティ](https://jp.vuejs.org/guide/computed.html) で返すことです。

``` js
// Vue コンポーネントの定義
computed: {
  count: function() {
    return store.state.count
  }
}
```

`store.state.count` が変わるたび、算出プロパティの再評価が発生し、関連した DOM の更新をトリガーします。

しかし、このパターンでは、コンポーネントがグローバルストアシングルトンに依存してしまいます。これはコンポーネントのテストを行うことや、同じコンポーネントのセットを使って、複数のアプリケーションのインスタンスを実行することを困難にします。規模の大きいアプリケーションでは、ルートコンポーネントから子コンポーネントに"注入"したくなるはずです。どのように行うか以下に示します。

1. Vuex をインストールし、ルートコンポーネントとストアを繋ぎます

  ``` js
  import Vue from 'vue'
  import Vuex from 'vuex'
  import store from './store'
  import MyComponent from './MyComponent'

  // Vue コンポーネントにどうやって Vuex に関連したオプションを扱えばよいか教えるための重要な記述です
  Vue.use(Vuex)

  var app = new Vue({
    el: '#app',
    // "store" オプションで指定されたストアは、全ての子コンポーネントに注入されます
    store,
    components: {
      MyComponent
    }
  })
  ```

  ルートインスタンスに `store` オプションを渡すことで、渡されたストアをルートの全ての子コンポーネントに注入します。これは `this.$store` で各コンポーネントから参照することができますが、それを参照する必要があるケースはほとんどありません。

2. 子コンポーネントでは、`vue.getters` オプションの**ゲッター**関数で状態を取り出します

  ``` js
  // MyComponent.js
  export default {
    template: '...',
    data () { ... },
    // これはストアから状態を取り出す場所です
    vuex: {
      getters: {
        // ステートゲッター関数は、コンポーネントで `store.state.count` を `this.count` として束縛します
        count: function (state) {
          return state.count
        }
      }
    }
  }
  ```

  特殊な `vuex` オプションブロックについて説明しておきましょう。これは、コンポーネントで利用されるストアの状態が何か記述する場所です。各プロパテイ名は、唯一の引数として、全体のステートツリーを受け取るゲッター関数を指定します。そして、状態の一部を選ぶか、状態から算出される値を返します。返された値は、算出プロパティのように、プロパティ名を使ってコンポーネントにセットされます。

  ほとんどの場合で、"ゲッター( getter )" 関数は、ES2015 のアロー関数を使って、簡潔に書くことができるでしょう:

  ``` js
  vuex: {
    getters: {
      count: state => state.count
    }
  }
  ```

### ゲッターは純粋でなければならない

全ての Vuex ゲッターは[純粋関数( pure functions )](https://en.wikipedia.org/wiki/Pure_function)でなければいけません - これらは、ステートツリー全体を取って、単にその状態から別の何か値を返します。これはゲッター関数をテストしやすく、組み立てやすく、また効率的にします。これは他に**ゲッターは、`this`に依存できない**ということを意味します。

もし`this`を参照したくなったら、以下の例のように、単なるコンポーネントの算出プロパティと定義を分ける必要があり、算出プロパティで、コンポーネントの内部 state や props から派生した計算をおこないます。

```js
vuex: {
  getters: {
    currentId: state => state.currentId
  }
},
computed: {
  isCurrent () {
    return this.id === this.currentId
  }
}
```

### ゲッターは派生した状態を返すことができる

Vuex ステートゲッター( state getters )は、中身は算出プロパティです。これは、算出プロパティを活用して、リアクティビティ (かつ、効率的) な状態に派生した計算をおこなうことができることを意味します。例えば、全てのメッセージが格納された `messages` という配列を状態として持っているとします。そして、`currentThreadID` は、ユーザーが現在見ているスレッドを表現します。現在のスレッドと関係のあるメッセージのリストを絞り込んで、ユーザーに見せたい場合、以下のように記述します。

```js
vuex: {
  getters: {
    filteredMessages: state => {
      return state.messages.filter(message => {
        return message.threadID === state.currentThreadID
      })
    }
  }
}
```

Vue.js 算出プロパティは自動的にキャッシュされ、再計算は reactive dependency が変化したときのみおこなわれます。なので、全ての変更で関数が呼ばれることを心配する必要はありません。

### ゲッター( Getters )を複数のコンポーネントの間で共有する

見ての通り、`filteredMessages` ゲッターは、複数のコンポーネントで有用そうです。この場合、同じ名前でコンポーネント間で共有するのがよいアイディアです。

``` js
// getters.js
export function filteredMessages (state) {
  return state.messages.filter(message => {
    return message.threadID === state.currentThreadID
  })
}
```

``` js
// コンポーネントでは...
import { filteredMessages } from './getters'

export default {
  vuex: {
    getters: {
      filteredMessages
    }
  }
}
```

ゲッターは純粋( pure )なので、複数のコンポーネント間で共有されたゲッターは、効率的にキャッシュされます: 依存関係が変化したとき、ゲッターを利用した全てのコンポーネントのために一度だけ再評価がおこなわれます。

> Fluxを参照: 粗いかもしれませんが、 Vuex ゲッターは Redux の[`mapStateToProps`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) と比較できます。しかし、Vuex ゲッターは Vue の算出プロパティのメモ化を内部で利用しているので、`mapStateToProps` よりも効率的です。[reselect](https://github.com/reactjs/reselect) により似ているでしょう。

### コンポーネントが直接、状態を変更することはしてはいけない

**コンポーネントは決して直接 Vuex ストアの状態を直接変更してはならない**という大切なことを思い出しましょう。全ての状態変更を、明示的かつ追跡可能にしたいので、全ての Vuex ストアの状態の変更はストアのミューテーションハンドラで行われるべきです。

このルールを守る手助けをするために、[厳格モード](strict.md)では、ストアのミューテーションハンドラの外でストアの状態が変更されたら、 Vuex はエラーを投げます。

このルールがあることで、Vue コンポーネントの責務は非常に小さくなっています: コンポーネントは、読み取り専用のゲッターを通して、 Vuex ストアの状態をコンポーネントに結びつけています。そして、ステートに作用する唯一の方法は**ミューテーション**をトリガーすることです (これについては後で説明します)。コンポーネントはまだ自身の内部の状態を持ったり、作用させることができますが、もはや個々のコンポーネントの内部には、任意のデータフェッチやグローバルな状態の変更ロジックはありません。それらは今、 Vuex に関連するファイル内で集約され、扱われています。これによって、規模の大きいアプリケーションの理解と保守が容易になります。
