# Làm việc với Form

Khi sử dụng Vuex trong chế độ nghiêm ngặt, việc sử dụng trực tiếp `v-model` trên một state của Vuex store sẽ gặp rắc rối như sau:

``` html
<input v-model="obj.message">
```

Giả sử như `obj` là một computed property vốn được ánh xạ từ state hoặc getters của Vuex store, cơ chế hoạt động của directive `v-model` sẽ trực tiếp thực hiện thay đổi lên `obj.message` khi người dùng nhập giá trị vào `<input>`. Vì sự thay đổi không được thực hiện thông qua việc commit mutation, điều này hoàn toàn sai với nguyên tắc của Vuex, nên trong chế độ nghiêm ngặt, Vuex sẽ báo lỗi.

Để giải quyết vấn đề trên, chúng ta chấp nhận thay thế directive `v-model` bằng một cách thức hơi "thủ công" hơn một chút, binding property vào giá trị của `<input>` và gọi action khi sự kiện `input` hoặc `change` được kích hoạt:

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

Và đây là hàm xử lý mutation:

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### Computed Property "hai chiều"

Phải thừa nhận là cách thức implement như trên thực sự rườm rà hơn là `v-model` + state nội bộ, hơn thế nữa lại còn không tận dụng được nhiều tính năng hữu ích khác của directive `v-model`. Một cách tiếp cận khác là sử dụng "Computed property hai chiều", nghĩa là khai báo computed property tường minh cả getter lẫn setter - getter lấy dữ liệu từ state về, setter sẽ commit mutation lên store khi có sự thay đổi. Cách này thì lại có nhược điểm là nếu sử dụng `v-model` cho nhiều state của Vuex store thì lại không thể dùng `mapState`, nên cân nhắc một chút về hiệu suất code:

``` html
<input v-model="message">
```
``` js
// ...
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
