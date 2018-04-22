# Cấu trúc ứng dụng

Vuex không có một ràng buộc chặt chẽ nào về cách thức bạn tổ chức mã nguồn ứng dụng. Thay vào đó, nó thực thi một tập hợp các nguyên tắc cấp cao:

1. State cấp ứng dụng được tập trung vào Vuex store.

2. Cách duy nhất để thực hiện thay đổi trên state là thực hiện lệnh commit **mutation**, là các tác vụ thay đổi đồng bộ.

3. Các tác vụ bất đồng bộ nằm trong store phải được tổ chức ở **actions**.

Chỉ cần bạn tuân theo 3 quy tắc bắt buộc phía trên, việc tổ chức mã nguồn dự án như thế nào là tùy ở bạn. Có một khuyến nghị nhỏ là nếu tệp tin store của bạn trở nên quá lớn theo thời gian, bạn hoàn toàn có thể chia tách action, mutation và getters thành những tệp tin riêng lẻ.

For any non-trivial app, we will likely need to leverage modules. Here's an example project structure:

``` bash
├── index.html
├── main.js
├── api
│   └── ... # abstractions for making API requests
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # nơi tập hợp các module và export store chính của ứng dụng
    ├── actions.js        # root actions
    ├── mutations.js      # root mutations
    └── modules
        ├── cart.js       # cart module
        └── products.js   # products module
```

Hãy tham khảo [Shopping Cart Example](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart) để có một ví dụ cụ thể và rõ ràng về cách thức tổ chức một ứng dụng Vuex hiệu quả.
