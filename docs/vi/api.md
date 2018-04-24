# API tham khảo

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store Constructor Options

- **state**

  - type: `Object | Function`

    Đối tượng tính trạng khởi đầu (root state) của Vuex store. [Xem thêm](state.md)

    Khi bạn gọi một hàm có kết quả trả về là một đối tượng,đối tượng đó được sử dụng như tính trạng khởi đầu (root state). Đặc biệt hữu dụng khi chúng ta muốn dùng lại tính trạng đó cho các module. [Xem thêm](modules.md#module-reuse)

- **mutations**

  - type: `{ [type: string]: Function }`

    Ghi các mutations vào store. Hàm xử lý luôn luôn  nhận `state` như tham số đầu tiên (sẽ là một state nội bộ của một module nếu hàm được định nghĩa bên trong một module),và nhận thêm một tham số `payload` (gói thông tin) nếu có.

    [Xem thêm](mutations.md)

- **actions**

  - type: `{ [type: string]: Function }`

    Ghi các actions vào storer. Hàm xử lý nhận đối tượng `context` khai báo các thuộc tính sau :

    ``` js
    {
      state,      // giống như `store.state`, hoặc state nội bộ nếu chứa trong module
      rootState,  // giống như `store.state`, chỉ dùng được trong một module
      commit,     // giống như `store.commit`
      dispatch,   // giống như `store.dispatch`
      getters,    // giống như `store.getters`, hoặc hàm getter nội bộ trong một module
      rootGetters // giống như `store.getters`, chỉ dùng được trong một module
    }
    ```
    
    Và cũng nhận thêm một tham số `payload` nếu có.

    [Xem thêm](actions.md)

- **getters**

  - type: `{ [key: string]: Function }`

    Ghi các getters vào store. Hàm getter nhận các thuộc tính sau : 

    ```
    state,     // sẽ là state nội bộ nếu chứa trong module
    getters    // giống như store.getters
    ```

    Đặc biệt khi khai báo trong một module

    ```
    state,       // sẽ là state nội bộ nếu chứa trong module
    getters,     // hàm getters nội bộ trong module
    rootState,   // state toàn cục (ngoài module)
    rootGetters  // tất cả hàm getters (của toàn chương trình)
    ```

    Các hàm getters được khai báo trong `store.getters`.

    [Xem thêm](getters.md)

- **modules**

  - type: `Object`

    Một đối tượng chứa các modules con để nối vào store,với các khai báo như sau:

    ``` js
    {
      key: {
        state,
        namespaced?,
        mutations?,
        actions?,
        getters?,
        modules?
      },
      ...
    }
    ```

    Mỗi module có thể chứa `state` và `mutations` như một tùy chọn gốc (root options) . Mỗi state của một module sẽ được gắn vào root state của store bằng một key. Mỗi mutations và hàm getters của một module sẽ chỉ nhận state của module (local state) đó như tham số đầu tiên thay vì state gốc (root state) của store, và các `context.state` khai báo trong các actions của module đó cũng sẽ trỏ tới các state đó (local state).

    [Xem thêm](modules.md)

- **plugins**

  - type: `Array<Function>`

    Một chuỗi các hàm plugin được áp dụng cho store. Các hàm này chỉ đơn giản là nhận các store như tham số duy nhất và cũng có thể theo dõi mutations (để duy trì xuất dữ liệu,ghi lịch sử hoạt động hoặc sửa lỗi) hoặc gỡ bỏ mutations (đối với nhận dữ liệu như websockets hoặc observables).

    [Xem thêm](plugins.md)

- **strict**

  - type: `Boolean`
  - default: `false`

    Ép vuex store vào chế độ nghiêm ngặt (strict mode). Ở chế độ này bất kỳ mutations nào diễn ra ở ngoài các hàm xử lý mutation đều sẽ ném ra một lỗi.

    [Xem thêm](strict.md)

### Vuex.Store Instance Properties

- **state**

  - type: `Object`

    State gốc (root state). Read only ( không thể sửa xóa chỉ xem được)

- **getters**

  - type: `Object`

    Khai báo các getters đã được ghi. Cũng read only.

### Vuex.Store Instance Methods

- **`commit(type: string, payload?: any, options?: Object)`**
- **`commit(mutation: Object, options?: Object)`**

  Ký thác một mutation (commit a mutation) . `options` có thể có thuộc tính `root: true` để cho phép ký thác các mutations gốc trong [namespaced modules](modules.md#namespacing). [Xem thêm](mutations.md)

- **`dispatch(type: string, payload?: any, options?: Object)`**
- **`dispatch(action: Object, options?: Object)`**

  Gỡ bỏ một action. `options` có thể có thuộc tính `root: true` để cho phép gỡ bỏ root actions trong [namespaced modules](modules.md#namespacing). Sau đó trả về một Promise phân giải tất cả hàm action handler đã được kích hoạt. [Xem thêm](actions.md)

- **`replaceState(state: Object)`**

  Thay thế root state của store. Chỉ dùng cho mục đích state hydration / time-travel.

- **`watch(fn: Function, callback: Function, options?: Object): Function`**

  Theo dõi liên tục kết quả trả về của hàm `fn`, và gọi ra hàm callback khi giá trị của kết quả đó thay đổi. `fn` nhận state của store làm tham số đầu tiên, và sau đó là getters. Chấp nhận một đối tượng options tùy chọn để chứa các options như của hàm `vm.$watch` .

  Để ngừng theo dõi, gọi tới hàm unwatch trả về.

- **`subscribe(handler: Function): Function`**

  Ghi nhận các store mutations. Hàm `handler` được gọi sau mỗi lần thay đổi (mutate) và nhận miêu tả (descriptor) của mutation và giá trị của state trước khi mutate như các tham số :

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  Để ngừng ghi store mutation,gọi tới hàm unsubcribe trả về.

  Các mutation được dùng nhiều nhất trong plugins -> [Xem thêm](plugins.md)

- **`subscribeAction(handler: Function): Function`**

  > New in 2.5.0

  Ghi nhận các store actions. Hàm `handler` được gọi mỗi khi có action được gỡ bở và nhận action descriptor và store state tại thời điểm đó như các tham số :

  ``` js
  store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })
  ```

  Để ngừng ghi, gọi tới hàm unsubcribe trả về.

  Các action được dùng nhiều nhất trong plugins -> [Xem thêm](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module, options?: Object)`**

  Ghi nhận một module động. [Xem thêm](modules.md#dynamic-module-registration)

  `options` có thể có thuộc tính `preserveState: true` để cho phép bảo toàn state trước đó. Hữu dụng với Server Side Rendering.

- **`unregisterModule(path: string | Array<string>)`**

  Hủy ghi nhận một module động[Xem thêm](modules.md#dynamic-module-registration)

- **`hotUpdate(newOptions: Object)`**

  Hot swap actions và mutations mới. [Xem thêm](hot-reload.md)

### Component Binding Helpers

- **`mapState(namespace?: string, map: Array<string> | Object<string | function>): Object`**

  Tạo một options cho các thành phần/thuộc tính đã được tính toán/xử lí sẵn và options này trả về một cây phụ (sub tree) của Vuex store.
  [Xem thêm](state.md#the-mapstate-helper)

  Tham số đầu tiên có thể được tùy ý để trở thành chuỗi không gian tên (namespace string). 
  [Xem thêm](modules.md#binding-helpers-with-namespace)
  
  Thành phần của đối tượng tham số thứ hai có thể là một hàm. `function(state: any)` 

- **`mapGetters(namespace?: string, map: Array<string> | Object<string>): Object`**

  Tạo một options cho các thành phần/thuộc tính đã được tính toán/xử lí sẵn và options này trả về giá trị đã được đánh giá của một hàm getter. [Xem thêm](getters.md#the-mapgetters-helper)

  Tham số đầu tiên có thể được tùy ý trở thành một chuỗi không gian tên. 
  [Xem thêm](modules.md#binding-helpers-with-namespace)

- **`mapActions(namespace?: string, map: Array<string> | Object<string | function>): Object`**

  Tạo options cho các hàm thành phần, những hàm mà dùng để gỡ bỏ action. 
  [Xem thêm](actions.md#dispatching-actions-in-components)

  Tham số đầu tiên có thể được tùy ý trở thành một chuỗi không gian tên.  
  [Xem thêm](modules.md#binding-helpers-with-namespace)
  
  Thành phần của đối tượng tham số thứ hai có thể là một hàm. `function(dispatch: function, ...args: any[])`

- **`mapMutations(namespace?: string, map: Array<string> | Object<string | function>): Object`**

  Tạo một options cho các hàm thành phần, những hàm mà dùng để ký thác một mutation. 
  [Xem thêm](mutations.md#committing-mutations-in-components)

  Tham số đầu tiên có thể được tùy ý trở thành một chuỗi không gian tên. 
  [Xem thêm](modules.md#binding-helpers-with-namespace)
  
  Thành phần của đối tượng tham số thứ hai có thể là một hàm. `function(commit: function, ...args: any[])`

- **`createNamespacedHelpers(namespace: string): Object`**

  Tạo một helpers để gán các thành phần đã được khai báo không gian tên (namespaced component binding). Đối tượng trả về chứa các thuộc tính `mapState`, `mapGetters`, `mapActions` và `mapMutations` được ràng buộc với không gian tên đã được khai báo. [Xem thêm](modules.md#binding-helpers-with-namespace)
