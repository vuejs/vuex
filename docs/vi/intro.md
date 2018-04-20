# Vuex là gì?

Vuex là một thư viện **quản lý trạng thái tập trung (State Management Pattern)** cho ứng dụng Vue.js. Vuex hoạt động như là một trung tâm lưu trữ trạng thái (*state*) cho toàn bộ các component của ứng dụng Vue.js, trên nguyên tắc *"trạng thái chỉ có thể được thay đổi theo cách có thể dự đoán trước"* (ở đây chính là *mutation*). Vuex có thể tích hợp tự động với [devtools extension](https://github.com/vuejs/vue-devtools) (extension phát triển bởi Vue, chạy trên trình duyệt cho phép hỗ trợ debug ứng dụng Vue.js), cung cấp các tính năng cao cấp như **time-travel debugging** và **state snapshot export / import**.

### "State Management Pattern" là gì?

Mỗi một ứng dụng Vue, dù là đơn giản nhất chỉ có một **đối tượng Vue**, hay đồ sộ hơn với một cây phân cấp gồm hàng trăm component, bản chất đều tạo thành từ ba yếu tố cốt lõi bao gồm:

- **state**, tức *cây trạng thái*, là nguồn dữ liệu duy nhất (*source of truth*) cung cấp dữ liệu cho toàn bộ ứng dụng;
- **view**, chỉ đơn giản lấy dữ liệu có từ **state** và hiển thị lên UI để tương tác với người dùng;
- **actions**, là những hàm có nhiệm vụ thay đổi dữ liệu bên trong **state** dựa trên tương tác của người dùng với **view**.

> Nhiều tài liệu khi nhắc đến "state" đều dịch thuần Việt là *cây trạng thái*, mặc dù có thể dịch được và dịch như thế hoàn toàn đúng về bản chất, tuy nhiên vì là một trong năm thành phần cốt lõi (State, Getters, Mutations, Actions và Modules) của Vuex, nên mình sẽ giữ nguyên bản từ "state" như trong tiếng Anh và sử dụng nó xuyên suốt tài liệu này, để có được sự thống nhất trong tư duy của lập trình viên từ việc lên mô hình ứng dụng cho đến hiện thực trên code. Bốn thành phần cốt lõi của Vuex cũng tương tự.

Đoạn code sơ đồ dưới đây cho chúng ta một cái nhìn tổng quan và dễ hiểu về *luồng dữ liệu một chiều* trong Vue.js

``` js
new Vue({
  // state
  data () {
    return {
      count: 0
    }
  },
  // view
  template: `
    <div v-on:click="increment">{{ count }}</div>
  `,
  // actions
  methods: {
    increment () {
      this.count++
    }
  }
})
```



<p style="text-align: center; margin: 2em">
  <img style="width:100%;max-width:450px;" src="./images/flow.png">
</p>

Vấn đề ở đây là, khi ứng dụng được thiết kế bao gồm **nhiều component chia sẻ state dùng chung**, có thể là:

1. Nhiều view phụ thuộc vào một phần dữ liệu của state, ví dụ như 2 UI khác nhau của ứng dụng cùng truy cập và hiển thị dữ liệu cài đặt.
2. Nhiều action đến từ các view khác nhau cần thay đổi dữ liệu trên state theo cùng một cách.

Sự đơn giản của luồng dữ liệu một chiều trở thành thảm họa trong việc quản lý state, khi mà mọi thứ trở nên rối rắm hơn rất nhiều. 

- Với vấn đề thứ nhất, việc truyền cùng một dữ liệu qua rất nhiều lớp component thông qua **props** sẽ vô cùng tẻ nhạt buồn chán vì phải lặp đi lặp lại cùng một khai báo **prop** nhiều lần, và cũng không thể sử dụng cách đấy cho các component độc lập về cấu trúc view. Ngay cả khi VueJS `2.2.0+` đưa ra hai option `provide` và `inject` để giải quyết vấn đề trên, nghiệp vụ của component cha trong cấu trúc cây component cũng trở nên nhập nhằng khi phải gánh vác state lẫn actions cho cả mấy đời component con cháu vốn chẳng liên quan đến bản thân component cha.
- Với vấn đề thứ hai, phương pháp đơn giản thường được sử dụng là truy xuất trực tiếp vào đối tượng component cha (thông qua `vm.$parent`) hoặc các component con (thông qua thuộc tính `ref` trên template); hoặc cố gắng thay đổi và đồng bộ các state vốn rời rạc nhau (do nằm riêng rẽ trên từng component) thông qua **events**. Sự nhập nhằng trong nghiệp vụ của các component ở trường hợp này cũng tương tự vấn đề thứ nhất, cả hai vấn đề đều dẫn đến hậu quả là *code dần dần trở nên khó bảo trì và phát triển hơn*

Lấy ví dụ một ứng dụng quản lý bài viết cho phép comment trên từng bài viết, tập hợp nội dung và comment được quản lý trên data (state) của `<post-list>`, khi đó nội dung từng post và action `comment` chỉ có thể thông qua **props** và **events** của `<post-item>`. Rõ ràng, về nghiệp vụ `<post-list>` chỉ nên lưu trữ và hiển thị danh sách bài viết, tại sao lại ôm đồm luôn cả action `comment` cho từng bài viết vốn chỉ nên xuất hiện ở `<post-item>` nhỉ?

Vấn đề chúng ta nêu trên chính là bài toán mà kết quả là sự ra đời của **Vuex**. Chúng ta hoàn toàn có thể đưa các state lẫn các action được các component dùng chung, chia sẻ ra một hệ thống quản lý duy nhất và toàn cục. Khi đó, các component trong ứng dụng, dù nằm ở vị trí nào trong cây component đồ sộ phức tạp, cũng có thể truy xuất state hoặc gọi action trong hệ thống ấy một cách rất dễ dàng.

Vuex được lấy cảm hứng từ [Flux](https://facebook.github.io/flux/docs/overview.html), [Redux](http://redux.js.org/) và [The Elm Architecture](https://guide.elm-lang.org/architecture/). Tuy nhiên không như các kiến trúc khác, Vuex được thiết kế riêng cho Vue.js, tận dụng sức mạnh của **reativity system** của Vue.js, tăng hiệu quả trong việc cập nhật dữ liệu.

![vuex](./images/vuex.png)

### Khi nào bạn nên sử dụng Vuex?

Vuex thực sự rất hữu ích cho những dự án lớn đòi hỏi việc quản lý state chung chặt chẽ. Tuy nhiên, cũng vì thế mà Vuex khá lớn và sở hữu nhiều tính năng cốt lõi, do đó sử dụng Vuex để xây dựng những ứng dụng nhỏ và đơn giản như đoạn code ví dụ phía trên, hoàn toàn không cần thiết (nếu không muốn nói đến việc hiệu năng của ứng dụng lẫn độ đơn giản của code sẽ tồi hơn là không sử dụng Vuex)

Trong trường hợp đó, [global event bus](https://vuejs.org/v2/guide/components.html#Non-Parent-Child-Communication) có thể là những gì bạn cần cho ứng dụng. But if you are building a medium-to-large-scale SPA, chances are you have run into situations that make you think about how to better handle state outside of your Vue components, and Vuex will be the natural next step for you. There's a good quote from Dan Abramov, the author of Redux:

> Flux libraries are like glasses: you’ll know when you need them.
