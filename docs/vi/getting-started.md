# Bắt đầu với Vuex

**Store** chính là trung tâm của mọi ứng dụng Vuex. Hiểu đơn giản, **store** là một biến toàn cục, hoạt động như là kho chứa lưu trữ và tổ chức **state** của ứng dụng. Điểm khác biệt giữa **store** và một biến toàn cục thông thường là:

1. Vuex stores có khả năng **reactive**, được thiết kế để sử dụng chung hệ thống **reactivity system** của Vue.js. Khi Vue component sử dụng state được lấy từ store, nó sẽ có khả năng phản ứng và cập nhật tức thời với sự thay đổi của state trên store.

2. Bạn **không thể thay đổi trực tiếp** giá trị lưu trữ trên state của store. Chỉ có một cách duy nhất để thay đổi giá trị lưu trữ trên state của store, đó là **committing mutations**. Cơ chế này đảm bảo cho việc thay đổi state của store có thể theo dõi được thông qua các **mutations**, và cũng giúp cho chúng ta hiểu được hoạt động của ứng dụng một cách dễ dàng hơn trong quá trình phát triển, thông qua tính năng log mutations của **Vue devtools**

### Tạo một Store đơn giản nhất

> **GHI CHÚ:** Chúng tôi sẽ sử dụng cú pháp của ES2015 cho các mã nguồn xuyên suốt phần còn lại của tài liệu. Nếu bạn chưa có khái niệm về ES2015, [hãy nghiên cứu ở đây](https://babeljs.io/docs/learn-es2015/)!

Ngay sau khi [cài đặt](installation.md) Vuex, hãy bắt tay vào tạo ngay một store thôi nào. Khá đơn giản, chỉ việc khởi tạo một đối tượng state, và vài mutations để thay đổi dữ liệu bên trong state:

``` js
// Nhớ gọi lệnh Vue.use(Vuex) trước nhé, nếu sử dụng module system

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

Giờ thì, bạn có thể truy cập vào đối tượng state thông qua `store.state`, và tạo một sự thay đổi trên state bằng phương thức `store.commit` với tham số đầu là tên của mutation tương ứng:

``` js
store.commit('increment')

console.log(store.state.count) // -> 1
```

Nhắc lại lần nữa, lý do để bắt buộc phải sử dụng mutation thay cho việc thay đổi trực tiếp `store.state.count`, là để việc thay đổi trên state có thể theo dõi được. Quy ước đơn giản này làm cho ý định của bạn rõ ràng hơn, để bạn có thể lý giải về những thay đổi trạng thái trong ứng dụng của bạn tốt hơn khi đọc mã. Ngoài ra, điều này mang đến cho chúng tôi cơ hội triển khai các công cụ có thể ghi lại các mutations xảy ra theo thời gian thực, tạo snapshot cho state hoặc hỗ trợ việc debug hiệu quả hơn dựa vào thứ tự các mutations xảy ra.

Sử dụng store state trong một component chỉ đơn giản là trả về dữ liệu của state bên trong một computed property, bởi vì state của store cũng có khả năng reactive như một object `data` thông thường của component. Tạo một sự thay đổi, đơn giản nghĩa là commit mutations bên trong các phương thức của component.

Có thể tham khảo một ví dụ đơn giản điển hình cho một ứng dụng Vuex, đó là [bộ đếm](https://jsfiddle.net/n9jmu5v7/1269/).

Tiếp theo, chúng ta sẽ thảo luận chi tiết cặn kẽ hơn về từng yếu tố cốt lõi trong Vuex, bắt đầu với [State](state.md).
