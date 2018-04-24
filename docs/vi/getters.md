# Getters

Có những trường hợp, chúng ta cần lấy một giá trị bằng cách tính toán lại các giá trị có sẵn trong state (như cách mà computed property hoạt động, tính toán lại các giá trị trong data của component), ví dụ, lọc một danh sách trong state theo điều kiện nào đó, rồi lấy ra số lượng phần tử lọc được:

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Nếu có nhiều hơn một component cần sử dụng những thuộc tính computed kiểu này, hẳn là chúng ta sẽ không hề muốn lặp đi lặp lại computed property này nhiều lần đâu, hoặc tạo một helper object chứa những computed property này và lặp đi lặp lại việc import nó ở mỗi computed cần sử dụng - vẫn rất nhàm chán.

Vuex tiếp tục nhìn ra vấn đề này, và đề xuất giải pháp bằng một thành phần cốt lõi gọi là "getters". Hình dung nôm na thì nó là computed property nhưng không phải dành cho component, mà là store. Giống như computed property, kết quả của một getter được tính toán và lưu trữ dựa trên những state object mà nó phụ thuộc, và được tính toán lại ngay lập tức mỗi khi một trong các state object mà nó phụ thuộc thay đổi giá trị.

Mỗi một hàm getters nhận state như là tham số đầu tiên:

``` js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

### Sử dụng getter như là thuộc tính

Getters có thể được truy cập thông qua object `store.getters` như sau:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getters cũng có thể sử dụng các getters khác để tính toán thông qua tham số thứ hai:

``` js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```

``` js
store.getters.doneTodosCount // -> 1
```

Và sử dụng getters trong bất kì component nào cũng giống như state, rất dễ dàng:

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

Note that getters accessed as properties are cached as part of Vue's reactivity system.

### Sử dụng getter như là một hàm

Khi muốn truyền thêm một hoặc một vài tham số nào đó, đơn giản là hãy trả về một hàm nhận những tham số đó, và sử dụng getter như một hàm bình thường. Một ví dụ là khi chúng ta cần truy vấn hoặc lọc ra những phần tử trên danh sách thuộc state, và tham số truy vấn/lọc không cần thiết phải có mặt trong state:

```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```

``` js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

Note that getters accessed via methods will run each time you call them, and the result is not cached.

### Hàm hỗ trợ `mapGetters`

Tương tự `mapStore`, `mapGetters` cho phép chúng ta ánh xạ nhanh cùng một lúc nhiều getter vào trong computed properties của component nhanh chóng:

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

Nếu bạn muốn ánh xạ getter nhưng sử dụng dưới một cái tên khác, sử dụng cú pháp Object như dưới đây:

``` js
...mapGetters({
  // map `this.doneCount` to `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```
