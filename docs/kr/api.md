# API 레퍼런스

### Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

### Vuex.Store 생성자 옵션

- **state**

  - 자료형: `Object`

    Vuex 저장소의 루트 상태 객체 입니다.

    [상세](state.md)

- **mutations**

  - 자료형: `{ [type: string]: Function }`

    저장소에 변이를 등록하십시오. 핸들러 함수는 항상 첫 번째 전달인자로 `state`를 받습니다 (모듈에 정의 된 경우 모듈 로컬 상태가됩니다). 두 번째 `payload` 전달인자가 있으면 처리합니다.

    [상세](mutations.md)

- **actions**

  - 자료형: `{ [type: string]: Function }`

    저장소에 액션을 등록하십시오. 핸들러 함수는 다음 속성을 노출하는 `context` 객체를받습니다.

    ``` js
    {
      state,     // store.state와 같습니다. 또는 모듈에 있는 경우 로컬 상태
      rootState, // store.state와 같습니다. 모듈 안에만 존재합니다
      commit,    // store.commit와 같습니다.
      dispatch,  // store.dispatch와 같습니다.
      getters    // store.getters와 같습니다.
    }
    ```

    [상세](actions.md)

- **getters**

  - 자료형: `{ [key: string]: Function }`

    저장소에 getter를 등록하십시오. getter 함수는 다음 전달인자를 받습니다.

    ```
    state,     // 모듈에 정의 된 경우 모듈 로컬 상태가됩니다.
    getters,   // store.getters와 같습니다.
    rootState  // store.state와 같습니다.
    ```

    등록된 getter는 `store.getters`에 노출됩니다.

    [상세](getters.md)

- **modules**

  - 자료형: `Object`

    저장소에 병합될 하위 모듈을 포함하는 객체 입니다.

    ``` js
    {
      key: {
        state,
        mutations,
        actions?,
        getters?,
        modules?
      },
      ...
    }
    ```

    각 모듈은 루트 옵션과 비슷한 `state` 와 `mutations` 를 포함 할 수 있습니다. 모듈의 상태는 모듈의 키를 사용하여 저장소의 루트 상태에 연결됩니다. 모듈의 변이와 getter는 모듈의 로컬 상태를 루트 상태 대신 첫 번째 전달인자로 받으며 모듈 액션의 `context.state`도 로컬 상태를 가리 킵니다.

    [상세](modules.md)

- **plugins**

  - 자료형: `Array<Function>`

    저장소에 적용 할 플러그인 함수의 배열입니다. 플러그인은 저장소를 유일한 전달인자로 받아들이고 아웃바운드 데이터 지속성, 로깅 또는 디버깅을 위한 변이를 감시하거나 (인바운드 데이터 (예: 웹 소켓 또는 관찰 가능 항목)의 디스패치 변이) 감시할 수 있습니다.

    [상세](plugins.md)

- **strict**

  - 자료형: `Boolean`
  - 기본값: `false`

    Vuex 저장소를 strict 모드로 변경합니다. strict 모드에서 변이 핸들러 외부의 Vuex 상태에 대한 임의의 변이는 오류를 발생시킵니다.

    [상세](strict.md)

### Vuex.Store 인스턴스 속성

- **state**

  - 자료형: `Object`

    루트 상태. 읽기 전용

- **getters**

  - 자료형: `Object`

    등록된 getters 입니다. 읽기 전용.

### Vuex.Store 인스턴스 메소드

- **`commit(type: string, payload?: any) | commit(mutation: Object)`**

  변이를 커밋합니다. [상세](mutations.md)

- **`dispatch(type: string, payload?: any) | dispatch(action: Object)`**

  액션을 디스패치 합니다. 모든 트리거된 액션 핸들러를 처리하는 Promise를 반환합니다. [상세](actions.md)

- **`replaceState(state: Object)`**

  저장소의 루트 상태를 바꿉니다. 상태에 대한 상호작용/시점 변경 목적으로 만 사용하십시오.

- **`watch(getter: Function, cb: Function, options?: Object)`**

  getter 함수의 반환 값을 반응적으로 지켜보고 값이 변경되면 콜백을 호출합니다. getter는 저장소의 상태를 유일한 인수로받습니다. Vue의 `vm.$watch` 메소드와 같은 옵션을 취하는 옵션 객체를 받아들입니다.

  감시를 중단하려면 반환된 핸들 함수를 호출하십시오.

- **`subscribe(handler: Function)`**

  저장소 변이를 구독합니다. `handler`는 모든 변이 이후 호출되고 변이 디스크립터와 변이 상태를 전달인자로 받습니다.

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  플러그인에서 가장 일반적으로 사용됩니다. [상세](plugins.md)

- **`registerModule(path: string | Array<string>, module: Module)`**

  동적 모듈을 등록합니다. [상세](modules.md#dynamic-module-registration)

- **`unregisterModule(path: string | Array<string>)`**

  동적 모듈을 해제 합니다. [상세](modules.md#dynamic-module-registration)

- **`hotUpdate(newOptions: Object)`**

  새 액션과 변이를 핫 스왑 합니다. [상세](hot-reload.md)

### 컴포넌트 바인딩 헬퍼

- **`mapState(map: Array<string> | Object): Object`**

  Vuex 저장소의 하위 트리를 반환하는 컴포넌트 계산 옵션을 만듭니다. [상세](state.md#the-mapstate-helper)

- **`mapGetters(map: Array<string> | Object): Object`**

  getter의 평가된 값을 반환하는 컴포넌트 계산 옵션을 만듭니다. [상세](getters.md#the-mapgetters-helper)

- **`mapActions(map: Array<string> | Object): Object`**

  액션을 전달하는 컴포넌트 메소드 옵션을 만듭니다. [상세](actions.md#dispatching-actions-in-components)

- **`mapMutations(map: Array<string> | Object): Object`**

  변이를 커밋하는 컴포넌트 메소드 옵션을 만듭니다. [상세](mutations.md#commiting-mutations-in-components)
