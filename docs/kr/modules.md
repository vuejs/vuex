# 모듈

단일 상태 트리를 사용하기 때문에 애플리케이션의 모든 상태가 하나의 큰 객체 안에 포함됩니다. 그러나 규모가 커짐에 따라 저장소는 매우 비대해질 수 있습니다.

이를 위해 Vuex는 저장소를 **모듈** 로 나눌 수 있습니다. 각 모듈은 자체 상태, 변이, 액션, 게터 및 심지어 중첩된 모듈을 포함 할 수 있습니다.

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

store.state.a // -> moduleA'의 상태
store.state.b // -> moduleB'의 상태
```

### 지역 상태 모듈

모듈의 변이와 getter 내부에서 첫 번째 전달인자는 **모듈의 지역 상태** 가됩니다.

``` js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // state는 지역 모듈 상태 입니다
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

유사하게 모듈 내부에서 `context.state`는 지역 상태를 노출시킬 것이고 루트 상태는 `context.rootState`로 노출 될 것입니다.

``` js
const moduleA = {
  // ...
  actions: {
    incrementIfOdd ({ state, commit }) {
      if (state.count % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

또한, 모듈 getters 내부, 루트 상태는 그들의 세 번째 전달인자로 노출됩니다.

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

### 네임스페이스

모듈 내의 액션, 변이 및 getter는 여전히 **전역 네임 스페이스** 아래에 등록됩니다. 여러 모듈이 동일한 변이/액션 유형에 반응 할 수 있습니다. 이름 앞에 접두사 또는 접미사를 붙이면 이름 충돌을 피하기 위해 모듈 자신의 네임스페이스를 직접 지정할 수 있습니다. 그리고 알 수 없는 환경에서 사용될 재사용 가능한 Vuex 모듈을 작성하는 경우라면 반드시 사용해야 합니다. 예를 들어,`todos` 모듈을 만들고 싶은 경우

``` js
// types.js

// getter, 액션, 변이의 이름을 상수로 정의하고
// 모듈 이름 `todos` 접두어를 붙입니다
export const DONE_COUNT = 'todos/DONE_COUNT'
export const FETCH_ALL = 'todos/FETCH_ALL'
export const TOGGLE_DONE = 'todos/TOGGLE_DONE'
```

``` js
// modules/todos.js
import * as types from '../types'

// 접두어로 된 이름을 사용하여 getter, 액션 및 변이 정의
const todosModule = {
  state: { todos: [] },

  getters: {
    [types.DONE_COUNT] (state) {
      // ...
    }
  },

  actions: {
    [types.FETCH_ALL] (context, payload) {
      // ...
    }
  },

  mutations: {
    [types.TOGGLE_DONE] (state, payload) {
      // ...
    }
  }
}
```

### 동적 모듈 등록

`store.registerModule` 메소드로 저장소가 생성 된 **후에** 모듈을 등록 할 수 있습니다.

``` js
store.registerModule('myModule', {
  // ...
})
```

모듈의 상태는`store.state.myModule`으로 노출 됩니다.

동적 모듈 등록을 사용하면 다른 Vue 플러그인도 애플리케이션의 저장소에 모듈을 연결하여 상태 관리에 Vuex를 활용할 수 있습니다. 예를 들어 [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) 라이브러리는 동적으로 연결된 모듈에서 애플리케이션의 라우트 상태를 관리하여 vue-router와 vuex를 통합합니다.

`store.unregisterModule(moduleName)`을 사용하여 동적으로 등록 된 모듈을 제거할 수도 있습니다. 이 방법으로는 정적 모듈(저장소 생성시 선언 됨)을 제거 할 수 없습니다.
