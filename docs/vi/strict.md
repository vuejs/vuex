# Chế độ nghiêm ngặt

Để bật "chế độ nghiêm ngặt", truyền thuộc tính `strict: true` khi khởi tạo Vuex store như dưới đây:

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

Trong chế độ nghiêm ngặt, mỗi khi Vuex state bị thay đổi mà không thông qua tác vụ commit mutation, console của trình duyệt sẽ báo lỗi. Chế độ này rất hữu ích cho việc phát triển ứng dụng, để đảm bảo rằng mọi mutation đều được lưu vết lại trong log đúng cách.

### Development vs. Production

**Đừng bật chế độ nghiêm ngặt trong môi trường production!** Chế độ nghiêm ngặt sẽ khởi chạy một bộ theo dõi sâu đến tận gốc rễ cây trạng thái để phát hiện sự thay đổi không hợp lệ trên state (ví dụ state bị thay đổi mà không thông qua tác vụ commit mutation), việc duy trì hệ thống theo dõi này trong môi trường production (vốn đã được đảm bảo việc không xảy ra lỗi sau quy trình kiểm thử đối với một dự án thông thường) khiến cho hiệu suất frontend bị tiêu hao vô ích. Vì thế nên, trong môi trường production hãy tắt chế độ nghiêm ngặt đi.

Tương tự như plugin, việc này có thể được công cụ build xử lý một cách tự động như sau:

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
