# 액션

액션은 변이와 유사합니다. 몇가지 다른 점은,

- 상태를 변이시키는 대신 액션으로 변이에 대한 커밋을 합니다.
- 작업에는 임의의 비동기 작업이 포함될 수 있습니다.

간단한 액션을 등록합시다.

``` js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

액션 핸들러는 저장소 인스턴스의 같은 메소드들/프로퍼티 세트를 드러내는 컨텍스트 객체를 받습니다. 그래서 `context.commit`을 호출하여 변이를 커밋하거나 `context.state`와 `context.getters`를 통해 상태와 getters에 접근 할 수 있습니다. 나중에 [모듈](modules.md)에서 이 컨텍스트 객체가 저장소 인스턴스 자체가 아닌 이유를 알 수 있습니다.

실제로 (특히 `commit`를 여러 번 호출해야하는 경우)코드를 단순화하기 위해 ES2015 [전달인자 분해](https://github.com/lukehoban/es6features#destructuring)를 사용합니다.

``` js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

### 디스패치 액션

액션은 `store.dispatch` 메소드로 시작됩니다.

``` js
store.dispatch('increment')
```

처음 볼 때는 이상해 보일 수 있습니다. 카운트를 증가 시키려면 `store.commit('increment')`를 직접 호출하면 어떻습니까? 음, **상태변이는 동기적** 이어야 한다는 것을 기억하십니까? 액션은 그렇지 않습니다. 액션 내에서 **비동기** 작업을 수행 할 수 있습니다.

``` js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

액션은 동일한 페이로드 타입과 객체 스타일의 디스패치를 지원합니다.

``` js
// 페이로드와 함께 디스패치
store.dispatch('incrementAsync', {
  amount: 10
})

// 객체와 함께 디스패치
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

액션의 좀 더 실용적인 예는 **비동기 API 호출** 과 **여러 개의 변이를 커밋** 하는 장바구니 결제입니다.

``` js
actions: {
  checkout ({ commit, state }, products) {
    // 장바구니에 현재있는 항목을 저장하십시오.
    const savedCartItems = [...state.cart.added]

    // 결제 요청을 보낸 후 장바구니를 비웁니다.
    commit(types.CHECKOUT_REQUEST)

    // 상점 API는 성공 콜백 및 실패 콜백을 받습니다.
    shop.buyProducts(
      products,
      // 요청 성공 핸들러
      () => commit(types.CHECKOUT_SUCCESS),
      // 요청 실패 핸들러
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

비동기 작업의 흐름을 수행하고 커밋하여 작업의 사이드이펙트(상태 변이)을 기록합니다.

### 컴포넌트 내부에서 디스패치 액션 사용하기

`this.$store.dispatch('xxx')`를 사용하여 컴포넌트에서 액션을 디스패치하거나 컴포넌트 메소드를 `store.dispatch` 호출에 매핑하는 `mapActions` 헬퍼를 사용할 수 있습니다 (루트 `store` 주입 필요) :

``` js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment' // this.increment()을 this.$store.dispatch('increment')에 매핑
    ]),
    ...mapActions({
      add: 'increment' // this.add()을 this.$store.dispatch('increment')에 매핑
    })
  }
}
```

### 액션 구성하기

액션은 종종 비동기적 입니다. 그러면 액션이 언제 완료되는지 어떻게 알 수 있습니까? 더 중요한 것은, 복잡한 비동기 흐름을 처리하기 위해 어떻게 여러 작업을 함께 구성 할 수 있습니까?

가장 먼저 알아야 할 점은 `store.dispatch`가 트리거 된 액션 핸들러에 의해 반환된 Promise를 처리 할 수 있으며 Promise를 반환한다는 것입니다.

``` js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

이렇게 할 수 있습니다.

``` js
store.dispatch('actionA').then(() => {
  // ...
})
```

그리고 안에 또 다른 액션을 사용할 수 있습니다.

``` js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

마지막으로, JavaScript 기능인 [async/await](https://tc39.github.io/ecmascript-asyncawait/)를 사용하면 다음과 같은 작업을 구성 할 수 있습니다.

``` js
// getData() 및 getOtherData()가 Promise를 반환한다고 가정합니다.
actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // actionA가 끝나기를 기다립니다.
    commit('gotOtherData', await getOtherData())
  }
}
```

> `store.dispatch`가 다른 모듈에서 여러 액션 핸들러를 트리거하는 것이 가능합니다. 이 경우 반환 된 값은 모든 트리거 된 처리기가 완료 되었을 때 처리되는 Promise입니다.
