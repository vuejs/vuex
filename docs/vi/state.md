# State

### Single State Tree - Cây trạng thái đơn

Vuex sử dụng **cây trạng thái đơn** - về bản chất, nó là một đối tượng JS lưu trữ toàn bộ state mà ứng dụng sử dụng đến, và hoạt động như là *"nguồn chân lý duy nhất"*. Đồng nghĩa với việc, mỗi ứng dụng chỉ sử dụng duy nhất một store. Một cây trạng thái đơn giúp bạn dễ dàng xác định một state cụ thể và cho phép chúng ta dễ dàng tạo một snapshot cho state hiện tại của ứng dụng, nhằm mục đích gỡ lỗi khi cần.

Cần tránh nhầm lẫn hai khái niệm **cây trạng thái đơn** và **module** - trong các chương sau chúng ta sẽ thảo luận làm thế nào để phân chia state và mutations của bạn thành các module.

### Sử dụng Vuex State bên trong Vue Component

Vậy làm thế nào để sử dụng và hiển thị state bên trong Vue component? Bởi vì Vuex store cũng có khả năng reactive, cách đơn giản nhất để nhận giá trị của state từ store đơn giản là trả về những state mà bạn cần của store từ bên trong một [computed property](https://vi.vuejs.org/guide/computed.html):

``` js
// Tạo một Component đếm
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

Bất cứ lúc nào `store.state.count` thay đổi, đều dẫn đến việc giá trị của computed property `count`được tính toán lại, và kích hoạt sự thay đổi trên DOM.

Tuy nhiên, cách làm trên dễ dẫn đến việc các component có sử dụng state của store đều bị phụ thuộc vào biến toàn cục `store`. Khi sử dụng module system, sẽ rất phiền khi bạn buộc phải import store vào mọi component có sử dụng state của store, cũng như việc mocking để kiểm thử các component.

Vuex cung cấp một cơ chế gọi là "inject" (truyền) store vào tất cả các component có trong ứng dụng thông qua option `store` (store được truyền ngay sau khi gọi `Vue.use(Vuex)`):

``` js
const app = new Vue({
  el: '#app',
  // Khai báo store với "store" option.
  // Cú pháp này sẽ truyền đối tượng store vào toàn bộ các component có trong ứng dụng.
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

Bằng cách cung cấp option `store` cho đối tượng root, store được truyền vào tất cả các component có trong ứng dụng và có thể được gọi từ bên trong các component thông qua thuộc tính `this.$store`. Component `Counter` có thể được viết lại như sau:

``` js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

### Hàm hỗ trợ `mapState`

Trong trường hợp component muốn sử dụng cùng một lúc nhiều giá trị của state hoặc getters, nếu vẫn giữ cách làm ở trên, tức khai báo hết toàn bộ computed property cho mỗi state hoặc getter cần sử dụng, sẽ khá là mệt mỏi và nhàm chán nếu cứ lặp đi lặp lại việc khai báo trả về đơn thuần như vậy. Để giải quyết vấn đề, Vuex đưa ra một hàm hỗ trợ (helper) gọi là `mapState` giúp chúng ta tạo ra các computed property một cách nhanh chóng và ít tốn công sức "cào phím":

``` js
// in full builds helpers are exposed as Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // cú pháp "hàm mũi tên" của ES2015 giúp cho code trở nên rất gọn gàng dễ đọc
    count: state => state.count,

    // Có thể sử dụng một chuỗi là tên của state muốn import thay cho hàm mũi tên
    countAlias: 'count',

    // Trường hợp muốn sử dụng state với "this" để tạo ra giá trị computed khác, bắt buộc phải sử dụng cú pháp hàm thông thường như dưới đây
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

Chúng ta cũng có thể truyền vào một mảng các chuỗi tên state vào trong `mapState` nếu tên của computed property được ánh xạ vào component giống hệt tên biến cần dùng trên cây state.

``` js
computed: mapState([
  // ánh xạ this.count vào store.state.count
  'count'
])
```

### Object Spread Operator

Hãy nhớ rằng `mapState` trả về một object. Làm thế nào để sử dụng những computed state được tạo bởi `máptate` với những computed property nội bộ của component? Normally, we'd have to use a utility to merge multiple objects into one so that we can pass the final object to `computed`. However with the [object spread operator](https://github.com/sebmarkbage/ecmascript-rest-spread) (which is a stage-4 ECMAScript proposal), we can greatly simplify the syntax:

``` js
computed: {
  localComputed () { /* ... */ },
  // mix this into the outer object with the object spread operator
  ...mapState({
    // ...
  })
}
```

### Components có thể có state nội bộ

Sử dụng Vuex, không có nghĩa là phải đặt **toàn bộ** state vào trong Vuex, làm như thế sẽ khiến cho cây state phình to một cách thừa thãi không cần thiết, và bản thân mã nguồn component cũng khó quản lý hơn. Về mặt nghiệp vụ, nên tách bạch ra state nào sẽ được dùng chung giữa các component mà đặt vào trong Vuex, và state nào chỉ cần bản thân component đó sử dụng là đủ. Cân nhắc việc tách bạch rõ ràng như vậy sẽ có lợi cho việc phát triển và bảo trì lâu dài ứng dụng.