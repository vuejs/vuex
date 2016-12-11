# 플러그인

Vuex 저장소는 각 변이에 대한 훅을 노출하는 `plugins` 옵션을 허용합니다. Vuex 플러그인은 저장소를 유일한 전달인자로 받는 함수입니다.

``` js
const myPlugin = store => {
  // 저장소가 초기화 될 때 불립니다.
  store.subscribe((mutation, state) => {
    // 매 변이시마다 불립니다.
    // 변이는 { type, payload } 포맷으로 제공됩니다.
  })
}
```

그리고 다음과 같이 사용할 수 있습니다.

``` js
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

### 플러그인 내부에서 변이 커밋하기

플러그인은 상태를 직접 변이할 수 없습니다. 컴포넌트와 마찬가지로 변이를 커밋하여 변경을 트리거 할 수 있습니다.

변이을 커밋함으로써 플러그인을 사용하여 데이터 소스를 저장소에 동기화 할 수 있습니다. 예를 들어, websocket 데이터 소스를 저장소에 동기화하려면 (이는 사실 인위적인 예제입니다. 실제로`createPlugin` 함수는 더 복잡한 작업을 위해 몇 가지 추가 옵션을 필요로 할 수 있습니다)

``` js
export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
```

``` js
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})
```

### 상태 스냅샷 가져오기

때로는 플러그인이 상태의 "스냅샷"을 얻고자 할 수 있으며, 또한 변이 이후 상태와 변이 이전 상태를 비교할 수 있습니다. 이를 달성하기 위해서는 상태 객체에 대한 깊은 복사를 수행해야합니다 :

``` js
const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // prevState와 nextState를 비교하십시오.

    // 다음 변이를 위한 상태 저장
    prevState = nextState
  })
}
```

**상태 스냅 샷을 사용하는 플러그인은 개발 중에 만 사용해야합니다.** Webpack 또는 Browserify를 사용하는 경우 빌드 도구가 이를 처리 할 수 있습니다.

``` js
const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
```

플러그인은 기본적으로 사용됩니다. 배포를 위해서는 Webpack의 [DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) 또는 [envify](https://github.com/hughsk/envify)가 필요합니다. Browserify가 `process.env.NODE_ENV !== 'production'`의 값을 최종 빌드를 위해 `false`로 변환합니다.


### 내장 로거 플러그인

> [vue-devtools](https://github.com/vuejs/vue-devtools)를 사용하고 있으면 필요 없을 수 있습니다.

Vuex에는 일반적인 디버깅을 위한 로거 플러그인이 함께 제공됩니다.

``` js
import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
```

`createLogger` 함수는 몇 가지 옵션을 가질 수 있습니다.

``` js
const logger = createLogger({
  collapsed: false, // 로그를 가지는 변이 자동 확장
  transformer (state) {
    // 로깅하기전 상태를 변이 하십시오.
    // 예를 들어 특정 하위 트리만 반환합니다.
    return state.subTree
  },
  mutationTransformer (mutation) {
    // 변이는 { type, payload }의 포맷으로 기록됩니다.
    // 원하는 포맷으로 변경할 수 있습니다.
    return mutation.type
  }
})
```

로거 파일은`<script>`태그를 통해 직접 포함될 수 있으며 `createVuexLogger` 함수를 전역적으로 노출합니다.

로거 플러그인은 상태 스냅샷을 사용하므로 개발용으로만 사용하십시오.
