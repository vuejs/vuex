# Plugins

Vuex stores chấp nhận đối tượng option `plugins` khai báo các móc nối tới mỗi mutation. Một Vuex plugin đơn giản là một hàm nhận duy nhất một tham số chính là store :

``` js
const myPlugin = store => {
  // Hàm này sẽ được gọi trong quá trình khởi tạo store
  store.subscribe((mutation, state) => {
    // Hàm này được gọi bất cứ khi nào mutation được kích hoạt.
    // Định dạng của tham số mutation là `{ type, payload }`.
  })
}
```

Và có thể được dùng như sau :

``` js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

### Committing Mutations Inside Plugins

Plugins không được phép trực tiếp thay đổi state - giống như các phần tử (components), nó chỉ nhằm kích hoạt các thay đổi bằng cách ký thác (commit) các mutations.

Bằng việc ký thác các mutations, một plugin có thể được sử dụng để đồng bộ nguồn dữ liệu vào store. Lấy ví dụ : đồng bộ một dữ liệu websocket vào store (đây chỉ là một ví dụ giả định, trên thực tế hàm `createPlugin` có thể thực hiện thêm một vài options khác cho những task phức tạp hơn) :

``` js
export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
```

``` js
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})
```

### Taking State Snapshots

Đôi khi một plugin có thể muốn nhận các "lát cắt dữ liệu" (snapshots) của state để so sánh state sau khi được thay đổi (post-mutation) với dữ liệu trước thay đổi của state đó (pre-mutation). Để làm được điều đó bạn phải thực hiện một bản sao phân tầng sâu (deep-copy) cho đối tượng state :


``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // so sánh `prevState` và `nextState`...

    // lưu lại state cho mutation kế tiếp
    prevState = nextState
  })
}
```

**Plugins nhận các state snapshots chỉ nên được dùng khi phát triển dự án.** Khi sử dụng webpack hoặc Browserify, chúng ta có thể để các công cụ xây dựng (build tools) xử lí việc đó :

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

Các plugin sẽ được sử dụng theo mặc định. Để hiểu rõ hơn cho production bạn sẽ cần [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) cho webpack hoặc [envify](https://github.com/hughsk/envify) cho Browserify để chuyển đổi giá trị của `process.env.NODE_ENV !== 'production'` sang `false` cho thành quả cuối cùng.

### Built-in Logger Plugin

> Nếu bạn đang dùng [vue-devtools](https://github.com/vuejs/vue-devtools) bạn có thể không cần đến cái này.

Vuex mang đến một logger plugin ghi lịch sử để phục vụ mục đích sửa lỗi chung (common debugging) :

``` js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

Hàm `createLogger` nhận vào các tùy chọn như sau:

``` js
const logger = createLogger({
  collapsed: false, // auto-expand logged mutations
  filter (mutation, stateBefore, stateAfter) {
    // trả về `true` nếu mutation cần được ghi log lại
    // `mutation` có định dạng là `{ type, payload }`
    return mutation.type !== "aBlacklistedMutation"
  },
  transformer (state) {
    // Chuyển đổi state trước khi ghi log lại
    // Ví dụ, khi cần sử dụng một phần cây state
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutations được ghi log lại dưới dạng mặc định là `{ type, payload }`
    // chúng ta có thể định dạng lại nó theo cách chúng ta muốn
    return mutation.type
  },
  logger: console, // hiện thực API của `console` API, mặc định là `console`
})
```

File log có thể được chứa trực tiếp bằng một thẻ `<script>`, và sẽ khai báo hàm toàn cục `createVuexLogger`.

Chú ý rằng logger plugin sử dụng các snapshots, vì vậy chỉ sử dụng khi đang phát triển dự án.
