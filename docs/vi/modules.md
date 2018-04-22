# Modules

Vì state của Vuex store là một cây trạng thái đơn, toàn bộ state của ứng dụng đều được lưu trữ tập trung trong một Object lớn. Tuy nhiên, cùng với sự lớn dần của ứng dụng trong quá trình phát triển, cấu trúc của store cũng sẽ trở nên cồng kềnh khó bảo trì hơn.

Vuex cho phép giải quyết vấn đề trên bằng cách chia nhỏ cấu trúc store thành các **modules**. Bản thân mỗi module chứa các thành phần cốt lõi như store, bao gồm state, mutations, actions, getters, và cả những module con lồng nhau - it's fractal all the way down:

``` js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> `moduleA`'s state
store.state.b // -> `moduleB`'s state
```

### State nội bộ của Module

Các mutation và getter của module nhận tham số đầu tiên là **state nội bộ của module**, không phải state toàn cục của store.

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // `state` is the local module state
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

Tương tự với action của module, `context.state` trả về state nội bộ, còn state toàn cục được truy cập thông qua `context.rootState`:

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

Đối với getter, tham số thứ hai cũng là getter nội bộ của module, không phải getter toàn cục. State toàn cục nằm ở tham số thứ ba.

``` js
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

### Không gian tên

Mặc định, actions, mutations và getters bên trong các module sẽ được đăng ký dưới dạng **không gian tên toàn cục** - this allows multiple modules to react to the same mutation/action type.

Trường hợp bạn muốn module trở nên độc lập khép kín (self-contained) hoặc tái sử dụng, hãy cho phép module sở hữu một không gian tên riêng bằng cách chỉ định `namespaced: true`. Ngay khi module được đăng kí, toàn bộ các getters, actions và mutations tự động được thêm không gian tên dựa trên đường dẫn mà module được đăng kí trong store. Ví dụ như:

``` js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // module assets
      state: { ... }, // module state is already nested and not affected by namespace option
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // Module lồng nhau
      modules: {
        // Module này không được chỉ định không gian tên, nó sẽ thừa kế không gian tên từ module cha
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // không gian tên lồng nhau
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

Namespaced getters and actions will receive localized `getters`, `dispatch` and `commit`. In other words, you can use the module assets without writing prefix in the same module. Toggling between namespaced or not does not affect the code inside the module.

#### Truy cập các yếu tố toàn cục từ bên trong một Namespaced Module (Module đã được gắn không gian tên)

Nếu bạn muốn truy cập các state và getters toàn cục, `rootState` và `rootGetters` hữu dụng ở tham số thứ 3 và thứ 4 của các hàm getter, và với các hàm xử lý actions, nó cũng được thêm vào như là thuộc tính của đối tượng `context` truyền vào chúng.

Để khởi chạy các action hoặc commit các mutation thuộc không gian tên toàn cục, truyền tham số thứ ba `{ root: true }` vào trong lệnh gọi `dispatch` and `commit`.

``` js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` is localized to this module's getters
      // you can use rootGetters via 4th argument of getters
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // dispatch and commit are also localized for this module
      // they will accept `root` option for the root dispatch/commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

#### Đăng ký Action toàn cục bên trong một Namespaced Module

Nếu bạn muốn đăng ký Action toàn cục bên trong một Namespaced Module, bạn định nghĩa action là một object với thuộc tính `root: true` và hàm xử lý action có tên là `handler`. Ví dụ:

``` js
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

#### Binding Helpers with Namespace

When binding a namespaced module to components with the `mapState`, `mapGetters`, `mapActions` and `mapMutations` helpers, it can get a bit verbose:

``` js
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo',
    'some/nested/module/bar'
  ])
}
```

In such cases, you can pass the module namespace string as the first argument to the helpers so that all bindings are done using that module as the context. The above can be simplified to:

``` js
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo',
    'bar'
  ])
}
```

Furthermore, you can create namespaced helpers by using `createNamespacedHelpers`. It returns an object having new component binding helpers that are bound with the given namespace value:

``` js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // look up in `some/nested/module`
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // look up in `some/nested/module`
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

#### Lưu ý khi phát triển Plugin

You may care about unpredictable namespacing for your modules when you create a [plugin](plugins.md) that provides the modules and let users add them to a Vuex store. Your modules will be also namespaced if the plugin users add your modules under a namespaced module. To adapt this situation, you may need to receive a namespace value via your plugin option:

``` js
// get namespace value via plugin option
// and returns Vuex plugin function
export function createPlugin (options = {}) {
  return function (store) {
    // add namespace to plugin module's types
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

### Đăng ký động Module

Bạn có thể đăng ký module **ngay sau khi** store được khởi tạo với phương thức `store.registerModule`:

``` js
// register a module `myModule`
store.registerModule('myModule', {
  // ...
})

// register a nested module `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

State của module khi xuất hiện trong store sẽ là `store.state.myModule` và `store.state.nested.myModule`.

Việc đăng kí động Vuex module cho phép các plugins của Vue plugins sử dụng hệ thống quản lý trạng thái của Vuex bằng cách đăng kí một module vào trong store của ứng dụng. Ví dụ như, thư viện [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) kết nối hoạt động của vue-router với vuex thông qua một module được đăng ký động để quản lý state chứa route của ứng dụng.

Bạn cũng có thể hủy đăng kí một module đã được đăng ký động với lệnh `store.unregisterModule(moduleName)`. Lưu ý rằng, bạn **không thể** hủy đăng kí một module được đăng kí tĩnh (khai báo trong lúc khởi tạo store) bằng phương thức này.

Việc đăng kí lại một module động đã được hủy đăng kí, hoặc đăng ký một module mà phần state của module đã tồn tại trên state của Vuex store trước đó, sẽ khiến cho phần state đó bị mất đi. Để giữ lại state cũ, ví dụ như state từ ứng dụng sử dụng SSR (Server-Side Rendering), sử dụng tùy chọn `preserveState` trong quá trình đăng ký động: `store.registerModule('a', module, { preserveState: true })`

### Tái sử dụng Module

Có những trường hợp mà một khai báo module có thể có nhiều instance, ví dụ như:

- Tạo nhiều store sử dụng cùng một module (ví dụ, để tránh hiện tượng [stateful singletons trong SSR](https://ssr.vuejs.org/en/structure.html#avoid-stateful-singletons) - hiểu nôm na là nhiều singleton sử dụng chung một thực thể trạng thái, khi tùy chọn `runInNewContext` có giá trị là `false` hoặc `'once'`);
- Đăng kí một module nhiều lần trong cùng một store.

If we use a plain object to declare the state of the module, then that state object will be shared by reference and cause cross store/module state pollution when it's mutated.

Vấn đề này cũng giống như vấn đề xảy ra với `data` bên trong Vue component. Thành ra giải pháp cũng tương tự - sử dụng hàm khi khai báo state cho module (hỗ trợ ở phiên bản Vuex 2.3.0+ trở lên):

``` js
const MyReusableModule = {
  state () {
    return {
      foo: 'bar'
    }
  },
  // mutations, actions, getters...
}
```
