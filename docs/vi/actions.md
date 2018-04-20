# Actions

Về hình thức action cũng giống mutation, đều là những hàm xử lý gắn với một cái tên cụ thể và chỉ có thể được gọi thông qua tên tương ứng, không thể sử dụng trực tiếp. Điểm khác biệt phân biệt Action và Mutation là:

- Thay vì thực hiện trực tiếp các thay đổi lên state, action thực hiện việc đó thông qua commit các thay đổi.
- Action có thể hoạt động bất đồng bộ, nghĩa là có thể chứa các cú pháp bất đồng bộ bên trong thân hàm.

Vẫn ví dụ như các chương trước đó, hiện thực thêm một action đơn giản:

``` js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

Hàm xử lý action nhận tham số đầu tiên là một đối tượng context chứa toàn bộ các phương thức/thuộc tính của đối tượng store, để commit một mutation bạn có thể gọi hàm `context.commit`, hoặc truy cập vào state và getters thông qua `context.state` và `context.getters`. Thực tế thì đối tượng context này lại không phải là một tham chiếu khác của chính đối tượng store, chúng tôi sẽ đề cập đến điều này ở chương [Modules](modules.md) ngay sau đó.

Trong thực hành, để rút ngắn khối lượng code và tăng một chút hiệu suất lập trình, chúng ta thường sử dụng cú pháp [argument destructuring](https://github.com/lukehoban/es6features#destructuring) của ES2015 (nhất là khi cần gọi `commit` nhiều lần):

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### Thực thi Actions

Actions được thực thi thông qua phương thức `store.dispatch`:

``` js
store.dispatch('increment')
```

Thoạt nhìn qua thì việc thực thi theo cách như thế này hơi vớ vẩn: nếu chỉ đơn giản là tăng bộ đếm, tại sao lại không sử dụng luôn `store.commit('increment')` cho nhanh? Trường hợp này thì thắc mắc đấy đúng, tuy nhiên, hãy nhớ rằng **mutation bắt buộc phải hoạt động đồng bộ**, còn Action thì không. Chúng ta có thể thực thi một tác vụ **bất đồng bộ** bên trong một action, và devtool vẫn có thể truy vết mutation như bình thường:

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Action cũng hỗ trợ việc truyền payload, cũng như thực thi action theo kiểu object giống hệt mutation:

``` js
// thực thi với payload
store.dispatch('incrementAsync', {
  amount: 10
})

// thực thi với object
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

Một ví dụ thực tế hơn về sự hữu ích của việc xây dựng action là một ứng dụng thương mại điện tử, trong đó có tác vụ thực hiện thanh toán giỏ hàng (checkout), tác vụ này có chứa các yếu tố liên quan bao gồm **gọi API bất đồng bộ** and **commit nhiều action cùng lúc**:

``` js
actions: {
  checkout ({ commit, state }, products) {
    // save the items currently in the cart
    const savedCartItems = [...state.cart.added]
    // send out checkout request, and optimistically
    // clear the cart
    commit(types.CHECKOUT_REQUEST)
    // the shop API accepts a success callback and a failure callback
    shop.buyProducts(
      products,
      // handle success
      () => commit(types.CHECKOUT_SUCCESS),
      // handle failure
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

Ở action ví dụ phía trên, chúng ta thực hiện một loạt các tác vụ không đồng bộ theo thứ tự và tuần tự thay đổi state bằng các lệnh commit

### Thực thi Actions bên trong Components

Bạn có thể thực thi các actions bên trong component với `this.$store.dispatch('xxx')`, hoặc sử dụng hàm hỗ trợ `mapActions` để ánh xạ cùng lúc nhiều lệnh gọi `store.dispatch` vào danh sách các phương thức của component (yêu cầu context của component phải có `store`):

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // map `this.increment()` to `this.$store.dispatch('increment')`

      // `mapActions` also supports payloads:
      'incrementBy' // map `this.incrementBy(amount)` to `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // map `this.add()` to `this.$store.dispatch('increment')`
    })
  }
}
```

### Viết mã nguồn cho Actions

Action thường được thực thi bất đồng bộ, do đó vấn đề đặt ra là làm thế nào để biết chính xác bao giờ action kết thúc? và quan trọng hơn nữa, làm sao để tổ chức nhiều action cùng lúc để hiện thực một luồng tác vụ bất đồng bộ phức tạp?

Điều đầu tiên cần biết là, `store.dispatch` cho phép hàm xử lý Action trả về một đối tượng Promise và bản thân hàm `store.dispatch` khi được thực thi cũng trả về Promise đó:

``` js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

Giờ thì bạn có thể viết như thế này...

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

... và như thế này, trong một action khác:

``` js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

Bạn cũng có thể sử dụng cú pháp [async / await](https://tc39.github.io/ecmascript-asyncawait/) của ES2015 để viết lại các action phía trên ngắn gọn hơn nữa, như thế này:

``` js
// assuming `getData()` and `getOtherData()` return Promises

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // wait for `actionA` to finish
    commit('gotOtherData', await getOtherData())
  }
}
```

> It's possible for a `store.dispatch` to trigger multiple action handlers in different modules. In such a case the returned value will be a Promise that resolves when all triggered handlers have been resolved.
