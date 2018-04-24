# Mutations

Chỉ có một cách duy nhất để thay đổi state của Vuex store, đó là **commit một mutation**. Về hình thức, mutation khá giống với sự kiện (event) trong Vue.js: mỗi mutation có một chuỗi **tên mutation** (giống với tên sự kiện) và một **handler (hàm xử lý mutation)**. Hàm xử lý mutation là nơi hiện thực mọi sự thay đổi lên state, nhận object state làm tham số thứ nhất:

``` js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // mutate state
      state.count++
    }
  }
})
```

Tương tự event, hàm xử lý mutation không thể được gọi trực tiếp: *"Khi một mutation có tên là `increment` được kích hoạt, gọi hàm xử lý tương ứng đó."* Để khởi chạy một mutation, bạn cần gọi hàm `store.commit` với tham số thứ nhất là tên của mutation:

``` js
store.commit('increment')
```

### Commit với tham số đi kèm (payload)

You can pass an additional argument to `store.commit`, which is called the **payload** for the mutation:

``` js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```
``` js
store.commit('increment', 10)
```

Bởi vì mỗi một mutation chỉ nhận tối đa hai tham số (tên mutation và payload) do đó để truyền vào cùng một lúc nhiều giá trị cho mutation, hãy đóng gói các giá trị đó vào trong một Object. Việc đóng gói và đặt tên thuộc tính cho từng giá trị rõ ràng như vậy, cũng khiến cho việc theo dõi mutation trong **vue-devtools** trở nên dễ dàng và tường minh hơn, ta có thể hiểu được giá trị truyền vào mutation là gì.

``` js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

``` js
store.commit('increment', {
  amount: 10
})
```

### Object-Style Commit

Một cách khác để commit một mutation kèm payload là sử dụng một tham số duy nhất, là một object có chứa thuộc tính `type`:

``` js
store.commit({
  type: 'increment',
  amount: 10
})
```

Khi commit bằng object theo cách này, thuộc tính `type` của object sẽ được lấy ra để gọi mutation tương ứng, và phần còn lại của object sẽ được truyền vào hàm xử lý mutation như là một payload:

``` js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### Mutations Follow Vue's Reactivity Rules

Bởi vì state của Vuex store sử dụng chung hệ thống **reactivity system** của Vue.js, khi chúng ta thay đổi state, các component có sử dụng một phần state của store cũng sẽ tự động reactive với sự thay đổi đó. Đồng nghĩa với việc, mọi hoạt động bên trong mutation cũng có những chú ý về reactivity như một object Vue thông thường (xem thêm [Reactivity in depth](https://vi.vuejs.org/v2/guide/reactivity.html)):

1. Nên khởi tạo store state với tất cả các trường sẽ được sử dụng trong ứng dụng.

2. Trường hợp muốn thêm một thuộc tính mới vào một reactive object, nên làm theo một trong hai cách sau:

  - Sử dụng `Vue.set(obj, 'newProp', 123)`, hoặc

  - Thay thế object bằng một object mới. Ví dụ, sử dụng [cú pháp "object spread"](https://github.com/sebmarkbage/ecmascript-rest-spread) của ES2015 stage-3 chúng ta có thể viết như sau:

    ``` js
    state.obj = { ...state.obj, newProp: 123 }
    ```

### Sử dụng biến hằng (constant) cho tên mutation

Sử dụng biến hằng cho tên các mutation là một mô hình phổ biến trong các triển khai mã nguồn hướng Flux. Điều này cho phép mã nguồn tận dụng lợi thế của công cụ kiểm tra như linters, và việc đặt tất cả các biến hằng trong một tệp mã nguồn cho phép cộng tác viên của bạn có thể hình dung nhanh chóng những mutations có thể có trong toàn bộ ứng dụng:

``` js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

``` js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // we can use the ES2015 computed property name feature
    // to use a constant as the function name
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

Việc sử dụng biến hằng để đặt tên mutation (cũng như action hay getter) rất hữu ích trong một dự án lớn trong đó nhiều lập trình viên cùng nhau xây dựng mã nguồn. Tất nhiên, đây chỉ là một phong cách lập trình được khuyến khích, bạn không thích hoặc dự án của bạn đủ nhỏ để không cần thiết phải hiện thực phong cách viết code này ư? Chả sao đâu.

### Mutation bắt buộc phải là một hàm đồng bộ

Một quy ước bắt buộc phải ghi nhớ là **hàm xử lý mutation bắt buộc phải là một hàm đồng bộ**. Tại sao? Hãy xem ví dụ dưới đây:

``` js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Rắc rối sẽ đến khi mã nguồn đang trong giai đoạn phát triển, và bạn cần phải xem log mutation trong devtool để gỡ lỗi. Với mọi mutation được lưu lại bên trong log, devtool cần phải capture lại hai trạng thái "trước khi mutate" và "sau khi mutate" của state. Vấn đề là cơ chế hoạt động của hàm bất đồng bộ không cho phép devtool capture chính xác như ta mong muốn: hàm callback chắc chắn sẽ không được gọi trước khi mutation được commit lên store, và cũng không có cách nào để devtool biết chắc chắn bao giờ callback mới được gọi để lấy trạng thái "sau khi mutate" - dẫn đến việc devtool không thể theo dõi sự thay đổi của state nếu nó được thực hiện trong một hàm callback!

### Committ Mutation bên trong Component

Bạn có thể commit mutation ở bên trong components bằng lệnh `this.$store.commit('xxx')`, hoặc tương tự `mapState` và `mapGetters`, hàm hỗ trợ `mapMutations` được sử dụng để ánh xạ cùng lúc nhiều lệnh gọi `store.commit` vào danh sách các phương thức của component (yêu cầu context của component phải có `store`):

``` js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // map `this.increment()` to `this.$store.commit('increment')`

      // `mapMutations` also supports payloads:
      'incrementBy' // map `this.incrementBy(amount)` to `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // map `this.add()` to `this.$store.commit('increment')`
    })
  }
}
```

### Từ Mutations đến Actions

Các tác vụ bất đồng bộ kết hợp với việc thay đổi state bằng mutation có thể dẫn đến mã nguồn trở nên khó hiểu. Ví dụ, khi bạn gọi hai phương thức trong đó đoạn mã nguồn thay đổi trạng thái đều nằm trong hàm callback chạy bất đồng bộ, vì không thể truy vết được như đã giải thích ở trên, có trời mới biết mutation nào thực sự đã thực thi đầu tiên? Lại là một lý do nữa để Vuex được thiết kế để **các mutations phải được thực thi đồng bộ**:

``` js
store.commit('increment')
// any state change that the "increment" mutation may cause
// should be done at this moment.
```

Giải pháp mà Vuex đưa ra cho các tác vụ bất đồng bộ chính là [Actions](actions.md).
