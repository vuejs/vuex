# 테스팅

Vuex에서 단위 테스트를 하고자 하는 주요 부분은 변이와 액션입니다.

### 변이 테스팅

변이는 테스트하기 매우 간단합니다. 왜냐하면 변이는 전달인자에 완전히 의존하는 함수이기 때문입니다. 한 가지 트릭은 ES2015 모듈을 사용하고 `store.js` 파일에 변이를 넣는다면 기본 내보내기와 함께 변이를 명명된 내보내기로 내보낼 수 있다는 것입니다.

``` js
const state = { ... }

// 변이를 이름을 가지는 내보내기를 이용하여 내보냅니다.
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

Mocha + Chai를 사용하여 변이를 테스팅 하는 예(원하는 프레임워크/assertion 라이브러리를 사용할 수 있습니다.)

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

// 변이 가져오기
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // mock 상태
    const state = { count: 0 }
    // 변이 적용
    increment(state)
    // 결과 확인
    expect(state.count).to.equal(1)
  })
})
```

### 액션 테스팅

액션은 외부 API를 호출 할 수 있기 때문에 좀 더 까다로울 수 있습니다. 액션을 테스트 할 때 우리는 일반적으로 조작을 어느 정도 해야합니다. 예를 들어 API 호출을 서비스로 추상화하고 테스트 내에서 해당 서비스를 조작 할 수 있습니다. 의존성을 쉽게 모방하기 위해 Webpack과 [inject-loader](https://github.com/plasticine/inject-loader)를 사용하여 테스트 파일을 묶을 수 있습니다.

비동기 액션 테스트 예제:

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

// 인라인 로더에는 require 구문을 사용하십시오.
// inject-loader를 사용하면 조작된 의존성을
// 주입 할 수있는 모듈 팩토리가 반환됩니다.
import { expect } from 'chai'
const actionsInjector = require('inject!./actions')

// 조작된 모의 응답과 함께 모듈 생성
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* 모의 응답 */ ])
      }, 100)
    }
  }
})

// 예상되는 변이와 함께 테스팅 액션을 도와주는 헬퍼
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // 모의 커밋
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(mutation.type).to.equal(type)
      if (payload) {
        expect(mutation.payload).to.deep.equal(payload)
      }
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // 모의 저장소와 전달인자로 액션을 부릅니다.
  action({ commit, state }, payload)

  // 디스패치된 변이가 없는지 확인
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, null, {}, [
      { type: 'REQUEST_PRODUCTS' },
      { type: 'RECEIVE_PRODUCTS', payload: { /* 모의 응답 */ } }
    ], done)
  })
})
```

### Getters 테스팅

Getter에 복잡한 연산이 있는 경우 테스트하는 것이 좋습니다. Getter는 변이와 같은 이유로 테스트하는 것이 매우 간단합니다.

getter 테스팅 예제:

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
    // mock state
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // 모의 getter
    const filterCategory = 'fruit'

    // getter로 부터 결과를 받습니다
    const result = getters.filteredProducts(state, { filterCategory })

    // 결과 테스트
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### 테스트 실행

변이와 액션이 제대로 작성되면 적절한 모의 조작을 한 후 브라우저 API에 직접적인 의존성이 없어야합니다. 따라서 Webpack을 사용하여 테스트를 번들로 묶어 Node를 이용해 직접 실행할 수 있습니다. 또는, `mocha-loader` 나 Karma + `karma-webpack`을 사용하여 실제 브라우저에서 테스트를 실행할 수 있습니다.

#### Node를 이용한 실행

다음과 같이 webpack 설정을 하십시오 ([`.babelrc`](https://babeljs.io/docs/usage/babelrc/)도 함께 필요 합니다.)

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

이제,

``` bash
webpack
mocha test-bundle.js
```

#### 브라우저에서 테스팅

1. `mocha-loader`를 설치하세요.
2. Webpack 설정에서 `entry`를 `'mocha!babel!./test.js'`로 변경하세요.
3. 설정을 이용하여 `webpack-dev-server`를 실행하세요.
4. `localhost:8080/webpack-dev-server/test-bundle`로 가세요.

#### 브라우저와 Karma + karma-webpack을 이용한 테스팅

[vue-loader 문서](http://vue-loader.vuejs.org/en/workflow/testing.html)를 확인하세요.
