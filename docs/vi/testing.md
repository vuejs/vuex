# Kiểm thử

Chương này sẽ đề cập đến việc kiểm thử một ứng dụng Vuex. Hai thành phần quan trọng có thể kiểm thử đó là mutation và action.

### Kiểm thử Mutation

Việc kiểm thử mutation rất dễ dàng, bởi chúng chỉ là những hàm phụ thuộc hoàn toàn vào các tham số được cung cấp. Một mẹo nhỏ là nếu ứng dụng của bạn phát triển dựa trên kiến trúc modules của ES2015 và phần module được đặt bên trong tệp `store.js`, ngoài việc default export store của bạn, bạn nên export cả module dưới dạng export có tên như dưới đây:

``` js
const state = { ... }

// export `mutations` as a named export
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Một ví dụ kiểm thử mutation sử dụng Mocha + Chai (bạn có thể sử dụng bất cứ thư viện/framework kiểm thử nào bạn muốn):

``` js
// mutations.js
export const mutations = {
  increment: state => state.count++
}
```

``` js
// mutations.spec.js
import { expect } from 'chai'
import { mutations } from './store'

// destructure assign `mutations`
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // mock state
    const state = { count: 0 }
    // apply mutation
    increment(state)
    // assert result
    expect(state.count).to.equal(1)
  })
})
```

### Kiểm thử Actions

Kiểm thử các action có thể rắc rối hơn một chút bởi vì action thường có thể sử dụng lệnh gọi API bất đồng bộ bên ngoài. Khi kiểm thử action, có một số tác vụ bên trong action chúng ta cần giả lập (mocking) - ví dụ như, tóm tắt các lệnh gọi API vào trong một service và giả lập service đó trong test của chúng ta. Nhằm giúp cho việc giả lập dễ dàng hơn, chúng ta sử dụng webpack và [inject-loader](https://github.com/plasticine/inject-loader) để bundle mã nguồn test.

Ví dụ cho việc kiểm thử một action bất đồng bộ:

``` js
// actions.js
import shop from '../api/shop'

export const getAllProducts = ({ commit }) => {
  commit('REQUEST_PRODUCTS')
  shop.getProducts(products => {
    commit('RECEIVE_PRODUCTS', products)
  })
}
```

``` js
// actions.spec.js

// use require syntax for inline loaders.
// with inject-loader, this returns a module factory
// that allows us to inject mocked dependencies.
import { expect } from 'chai'
const actionsInjector = require('inject-loader!./actions')

// create the module with our mocks
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* mocked response */ ])
      }, 100)
    }
  }
})

// helper for testing action with expected mutations
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // mock commit
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(type).to.equal(mutation.type)
      if (payload) {
        expect(payload).to.deep.equal(mutation.payload)
      }
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // call the action with mocked store and arguments
  action({ commit, state }, payload)

  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, null, {}, [
      { type: 'REQUEST_PRODUCTS' },
      { type: 'RECEIVE_PRODUCTS', payload: { /* mocked response */ } }
    ], done)
  })
})
```

If you have spies available in your testing environment (for example via [Sinon.JS](http://sinonjs.org/)), you can use them instead of the `testAction` helper:

``` js
describe('actions', () => {
  it('getAllProducts', () => {
    const commit = sinon.spy()
    const state = {}
    
    actions.getAllProducts({ commit, state })
    
    expect(commit.args).to.deep.equal([
      ['REQUEST_PRODUCTS'],
      ['RECEIVE_PRODUCTS', { /* mocked response */ }]
    ])
  })
})
```

### Testing Getters

Nên kiểm thử luôn cả những getters có chứa các tính toán phức tạp. Việc kiểm thử getters cũng đơn giản và dễ dàng như kiểm thử mutations.

Ví dụ cho việc kiểm thử một getter:

``` js
// getters.js
export const getters = {
  filteredProducts (state, { filterCategory }) {
    return state.products.filter(product => {
      return product.category === filterCategory
    })
  }
}
```

``` js
// getters.spec.js
import { expect } from 'chai'
import { getters } from './getters'

describe('getters', () => {
  it('filteredProducts', () => {
    // giả lập state
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // giả lập getter
    const filterCategory = 'fruit'

    // lưu trữ kết quả từ getter
    const result = getters.filteredProducts(state, { filterCategory })

    // kiểm thử kết quả
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### Thực thi kiểm thử

Nếu các mutation và action được viết một cách phù hợp, các bài kiểm thử sẽ không bị phụ thuộc trực tiếp vào các API của trình duyệt sau khi giả lập một cách hợp lý. Vì vậy, bạn có thể bundle các bài kiểm thử với webpack và thực thi kiểm thử trực tiếp trên Node. Một cách khác là, sử dụng `mocha-loader` hoặc Karma + `karma-webpack` để chạy kiểm thử trực tiếp trên trình duyệt.

#### Thực thi trên môi trường Node

Tạo một tệp cấu hình webpack như sau (cùng với tệp [`.babelrc`](https://babeljs.io/docs/usage/babelrc/) phù hợp):

``` js
// webpack.config.js
module.exports = {
  entry: './test.js',
  output: {
    path: __dirname,
    filename: 'test-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
```

Và sau đó

``` bash
webpack
mocha test-bundle.js
```

#### Thực thi trên trình duyệt

1. Cài đặt `mocha-loader`.
2. Thay đổi phần `entry` trong nội dung cấu hình webpack phía trên thành `'mocha-loader!babel-loader!./test.js'`.
3. Khởi động `webpack-dev-server` sử dụng cấu hình trên.
4. Truy cập vào `localhost:8080/webpack-dev-server/test-bundle`.

#### Thực thi trên trình duyệt với Karma + karma-webpack

Tham khảo cách cài đặt tại [tài liệu vue-loader](https://vue-loader.vuejs.org/en/workflow/testing.html).
