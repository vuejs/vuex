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
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
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

기본적으로 모듈 내의 액션, 변이 및 getter는 여전히 **전역 네임 스페이스** 아래에 등록됩니다. 여러 모듈이 동일한 변이/액션 유형에 반응 할 수 있습니다.

만약 모듈이 독립적이거나 재사용되기를 원한다면, `namespaced: true`라고 네임스페이스에 명시하면 됩니다. 모듈이 등록될 때, 해당 모듈의 모든 getter, 액션/변이는 자동으로 등록된 모듈의 경로를 기반으로 네임스페이스가 지정됩니다. 아래는 예시입니다:

``` js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 모듈 자산
      state: { ... }, // 모듈 상태는 이미 중첩되어 있고, 네임스페이스 옵션의 영향을 받지 않음
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 중첩 모듈
      modules: {
        // 부모 모듈로부터 네임스페이스를 상속받음
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 네임스페이스를 더 중첩
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

네임스페이스의 getter와 액션은 지역화된  `getters`, `dispatch` 그리고 `commit`을 받습니다. 즉, 동일한 모듈 안에서 접두어 없이 모듈 자산을 사용할 수 있습니다. 네임스페이스 옵션 값을 바꾸어도 모듈 내부의 코드에는 영향을 미치지 않습니다.

#### 네임스페이스 모듈 내부에서 전역 자산 접근

전역 상태나 getter를 사용하고자 한다면, `rootState`와 `rootGetters`가 getter 함수의 3번째와 4번째 인자로 전달되고, 또한 action 함수에 전달된 'context' 객체의 속성으로도 노출됩니다.

전역 네임스페이스의 액션을 디스패치하거나 변이를 커밋하려면 `dispatch`와 `commit`에 3번째 인자로 `{ root: true }`를 전달하면 됩니다.

``` js
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters`는 해당 모듈의 지역화된 getters
      // getters의 4번째 인자를 통해서 rootGetters 사용 가능
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // 디스패치와 커밋도 해당 모듈의 지역화된 것
      // 전역 디스패치/커밋을 위한 `root` 옵션 설정 가능
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

#### 네임스페이스 모듈에서 전역 액션 등록

네임스페이스 모듈에서 전역 액션을 등록하려면, `root: true`를 표시하고 `handler` 함수에 액션을 정의하면 됩니다. 아래는 예시입니다:

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

#### 헬퍼에서 네임스페이스 바인딩

`mapState`, `mapGetters`, `mapActions` 그리고 `mapMutations` 헬퍼에서 네임스페이스 모듈을 컴포넌트에 바인딩 할 때 조금 장황하게 됩니다.

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

이러한 경우에는 모듈의 네임스페이스 문자열을 헬퍼의 첫 번째 인수로 전달하여 해당 모듈을 컨텍스트로 사용하여 모든 바인딩을 할 수 있습니다. 위의 예시는 아래와 같이 단순화 할 수 있습니다.

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

또한 `createNamespacedHelpers`를 사용하여 네임스페이스 헬퍼를 생성할 수 있습니다. 전달된 네임스페이스 값으로 바인딩된 새로운 컴포넌트 바인딩 헬퍼를 가진 객체를 반환합니다.

``` js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // `some/nested/module`에서 찾음
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // `some/nested/module`에서 찾음
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

#### 플러그인 개발자를 위한 주의 사항

사용자가 Vuex 저장소에 추가할 수 있는 모듈을 제공하는 [플러그인](plugins.md)를 생성한다면 해당 모듈에서 예측할 수 없는 네임스페이스를 주의해야 합니다. 플러그인 사용자가 네임스페이스 모듈 아래에 제공한 모듈을 추가하면 제공한 모듈도 동일한 네임스페이스가됩니다. 이러한 상황을 피하기 위해서 플러그인 옵션을 통해 네임스페이스 값을 전달받을 수 있어야 합니다.


``` js
// 플러그인 옵션을 통해 네임스페이스 값 전달
// 그리고 Vuex 플러그인 함수를 반환
export function createPlugin (options = {}) {
  return function (store) {
    // add namespace to plugin module's types
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

### 동적 모듈 등록

`store.registerModule` 메소드로 저장소가 생성 된 **후에** 모듈을 등록 할 수 있습니다.

``` js
store.registerModule('myModule', {
  // ...
})

// `nested/myModule` 중첩 모듈 등록
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

모듈의 상태는`store.state.myModule`와 `store.state.nested.myModule`로 노출 됩니다.

동적 모듈 등록을 사용하면 다른 Vue 플러그인도 애플리케이션의 저장소에 모듈을 연결하여 상태 관리에 Vuex를 활용할 수 있습니다. 예를 들어 [`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) 라이브러리는 동적으로 연결된 모듈에서 애플리케이션의 라우트 상태를 관리하여 vue-router와 vuex를 통합합니다.

`store.unregisterModule(moduleName)`을 사용하여 동적으로 등록 된 모듈을 제거할 수도 있습니다. 이 방법으로는 정적 모듈(저장소 생성시 선언 됨)을 제거 할 수 없습니다.

Server Side Rendered 앱에서 상태를 유지하는 것처럼 새 모듈을 등록할 때 이전 상태를 유지하고자 할 수 있습니다. `preserveState` 옵션을 사용하면 그렇게 할 수 있습니다: `store.registerModule('a', module, { preserveState: true })`

### 모듈 재사용

때로는 한 모듈에서 여러 인스턴스를 생성해야 할 수도 있습니다. 예를 들자면 다음과 같습니다:

- 동일 모듈을 사용하는 여러 저장소 생성 (예. [SSR 에서 싱글톤 상태 피하기](https://ssr.vuejs.org/en/structure.html#avoid-stateful-singletons) 에서 `runInNewContext` 옵션이 `false`나 `once`일 때)
- 동일 모듈을 동일 저장소에 여러 번 등록

일반 객체를 사용하여 모듈의 상태를 선언하면 상태 객체가 참조에 의해 공유되고 변이 될 때 교차 저장소/모듈의 상태 오염을 일으킵니다.

이것은 실제로 Vue 컴포넌트 내부의 `data`와 완전히 동일한 문제입니다. 그래서 해결책도 역시 동일합니다. 함수를 사용하여 모듈 상태를 선언합니다. (2.3.0 부터 지원함)

``` js
const MyReusableModule = {
  state () {
    return {
      foo: 'bar'
    }
  },
  // 변이, 액션, getters...
}
```
