# Cài đặt

### Tải về trực tiếp / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

<!--email_off-->
Trang web [unpkg.com](https://unpkg.com) chuyên cung cấp các url CDN dựa trên kho thư viện [NPM](https://npmjs.com). URL phía trên luôn trỏ đến phiên bản mới nhất trên NPM. Thông qua URL, bạn cũng có thể tự chọn phiên bản/tag của Vuex mà bạn muốn sử dụng, ví dụ như `https://unpkg.com/vuex@2.0.0`.
<!--/email_off-->

Chèn thư viện `vuex` ngay phía sau Vue như dưới đây, khi đó Vuex sẽ được tự động cài đặt vào Vue:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### NPM

``` bash
npm install vuex --save
```

### Yarn

``` bash
yarn add vuex
```

Khi sử dụng với module system, Vuex bắt buộc phải được cài đặt một cách tường minh với lệnh `Vue.use()`:

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

Tất nhiên bạn không cần thiết phải viết đoạn lệnh trên nếu sử dụng bằng thẻ `<script>` vì khi đó Vuex đã được cài đặt tự động.

### Promise

Vuex yêu cầu sử dụng [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises). Trong trường hợp những trình duyệt/phiên bản trình duyệt bạn muốn hướng đến không thể hỗ trợ Promise, có rất nhiều thư viện Polyfill cho phép trình duyệt sử dụng những chức năng mới như Promise nói riêng và ECMA Script 2015 nói chung, chẳng hạn như [es6-promise](https://github.com/stefanpenner/es6-promise).

Bạn có thể sử dụng trực tiếp thư viện này thông qua url CDN:

``` html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>
```

Và ngay sau đó tính năng Promise hoàn toàn có thể được sử dụng thông qua `window.Promise` một cách tự động.

Trường hợp dự án của bạn sử dụng các hệ thống quản lý thư viện như NPM hoặc Yarn, hãy cài đặt bằng lệnh sau

``` bash
npm install es6-promise --save # NPM
yarn add es6-promise # Yarn
```

Ngoài ra, hãy thêm đoạn code này vào bất cứ đâu miễn là trước khi import Vuex

``` js
import 'es6-promise/auto'
```

### Dev Build

Nếu bạn muốn sử dụng trực tiếp bản dev build mới nhất ,hãy tự tạo một bản sao của `vuex` từ Github và build bằng lần lượt các lệnh sau:

``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
