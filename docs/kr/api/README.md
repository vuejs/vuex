---
sidebar: auto
---

# API 레퍼런스

## Vuex.Store

``` js
import Vuex from 'vuex'

const store = new Vuex.Store({ ...options })
```

## Vuex.Store 생성자 옵션

### state

- 자료형: `Object | Function`

  Vuex 저장소의 루트 상태 객체 입니다. [상세](../guide/state.md)

  오브젝트를 반환하는 함수를 전달하면, 반환된 오브젝트가 로투 상태로 사용됩니다. 이것은 모듈 재사용을 위해 상태 객체를 재사용하고자 할 때 유용합니다. [상세](../guide/modules.md#모듈-재사용)

### mutations

- 자료형: `{ [type: string]: Function }`

  저장소에 변이를 등록하십시오. 핸들러 함수는 항상 첫 번째 전달인자로 `state`를 받습니다 (모듈에 정의 된 경우 모듈 로컬 상태가됩니다). 두 번째 `payload` 전달인자가 있으면 처리합니다.

  [상세](../guide/mutations.md)

### actions

- 자료형: `{ [type: string]: Function }`

  저장소에 액션을 등록하십시오. 핸들러 함수는 다음 속성을 노출하는 `context` 객체를받습니다.

    ``` js
    {
      state,      // store.state와 같습니다. 또는 모듈에 있는 경우 로컬 상태
      rootState,  // store.state와 같습니다. 모듈 안에만 존재합니다
      commit,     // store.commit와 같습니다.
      dispatch,   // store.dispatch와 같습니다.
      getters,    // store.getters와 같습니다. 또는 모듈에 있는 로컬 getters
      rootGetters // store.getters와 같습니다. 모듈 안에만 존재합니다
    }
    ```

  두 번째 `payload` 전달인자가 있으면 처리합니다.

  [상세](../guide/actions.md)

### getters

- 자료형: `{ [key: string]: Function }`

  저장소에 getter를 등록하십시오. getter 함수는 다음 전달인자를 받습니다.

    ```
    state,     // 모듈에 정의 된 경우 모듈 로컬 상태가됩니다.
    getters   // store.getters와 같습니다.
    ```

  모듈 안에서 정의할 때의 사양입니다.

    ```
    state,       // 모듈에 정의 된 경우 모듈 로컬 상태가됩니다.
    getters,     // store.getters와 같습니다.
    rootState    // 글로벌 상태 입니다
    rootGetters  // 모든 getters 입니다
    ```

  등록된 getter는 `store.getters`에 노출됩니다.

  [상세](../guide/getters.md)

### modules

- 자료형: `Object`

  저장소에 병합될 하위 모듈을 포함하는 객체 입니다.

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

  각 모듈은 루트 옵션과 비슷한 `state` 와 `mutations` 를 포함 할 수 있습니다. 모듈의 상태는 모듈의 키를 사용하여 저장소의 루트 상태에 연결됩니다. 모듈의 변이와 getter는 모듈의 로컬 상태를 루트 상태 대신 첫 번째 전달인자로 받으며 모듈 액션의 `context.state`도 로컬 상태를 가리 킵니다.

  [상세](../guide/modules.md)

### plugins

- 자료형: `Array<Function>`

  저장소에 적용 할 플러그인 함수의 배열입니다. 플러그인은 저장소를 유일한 전달인자로 받아들이고 아웃바운드 데이터 지속성, 로깅 또는 디버깅을 위한 변이를 감시하거나 (인바운드 데이터 (예: 웹 소켓 또는 관찰 가능 항목)의 디스패치 변이) 감시할 수 있습니다.

  [상세](../guide/plugins.md)

### strict

- 자료형: `Boolean`
- 기본값: `false`

  Vuex 저장소를 strict 모드로 변경합니다. strict 모드에서 변이 핸들러 외부의 Vuex 상태에 대한 임의의 변이는 오류를 발생시킵니다.

  [상세](../guide/strict.md)

## Vuex.Store 인스턴스 속성

### state

- 자료형: `Object`

  루트 상태. 읽기 전용

### getters

- 자료형: `Object`

  등록된 getters 입니다. 읽기 전용.

## Vuex.Store 인스턴스 메소드

### commit

- `commit(type: string, payload?: any, options?: Object)`
- `commit(mutation: Object, options?: Object)`

  변이를 커밋합니다. `options` 에 `root:true` 를 포함하면 [네임스페이스 모듈](../guide/modules.md#네임스페이스) 의 root 변이에 commit 을 허용합니다. [상세](../guide/mutations.md)

### dispatch

- `dispatch(type: string, payload?: any, options?: Object)`
- `dispatch(action: Object, options?: Object)`

  액션을 디스패치 합니다. `options` 에 `root:true` 를 포함하면 [네임스페이스 모듈](../guide/modules.md#네임스페이스) 의 root 액션에 디스패치를 허용합니다. 모든 트리거된 액션 핸들러를 처리하는 Promise를 반환합니다. [상세](../guide/actions.md)

### replaceState

- `replaceState(state: Object)`

  저장소의 루트 상태를 바꿉니다. 상태에 대한 상호작용/시점 변경 목적으로 만 사용하십시오.

### watch

- `watch(fn: Function, callback: Function, options?: Object): Function`

  `fn` 함수의 반환 값을 반응적으로 지켜보고 값이 변경되면 콜백을 호출합니다. `fn`는 저장소의 상태를 첫 번째 인수로 받고, getters를 두 번째 인수로 받습니다. Vue의 `vm.$watch` 메소드와 같은 옵션을 취하는 옵션 객체를 받아들입니다.

  감시를 중단하려면 반환된 핸들 함수를 호출하십시오.

### subscribe

- `subscribe(handler: Function): Function`

  저장소 변이를 구독합니다. `handler`는 모든 변이 이후 호출되고 변이 디스크립터와 변이 상태를 전달인자로 받습니다.

  ``` js
  store.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })
  ```

  구독을 중단하려면 반환된 구독 해제 함수를 호출하십시오.

  플러그인에서 가장 일반적으로 사용됩니다. [상세](../guide/plugins.md)

### subscribeAction

-  `subscribeAction(handler: Function): Function`

  > 2.5.0 에서 추가됨

  저장소 액션을 구독합니다. `handler`는 모든 디스패치 액션 이후 호출되고 액션 디스크립터와 현재 저장소 상태를 전달인자로 받습니다.

  ``` js
  store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })
  ```

  구독을 중단하려면 반환된 구독 해제 함수를 호출하십시오.

  플러그인에서 가장 일반적으로 사용됩니다. [상세](../guide/plugins.md)

### registerModule

- `registerModule(path: string | Array<string>, module: Module, options?: Object)`

  동적 모듈을 등록합니다. [상세](../guide/modules.md#동적-모듈-등록)
  
  `options`은 이전 속성을 보호하는 `preserveState: true`를 가질 수 있습니다. 이것은 서버사이드 렌더링에서 유용합니다.

### unregisterModule

- `unregisterModule(path: string | Array<string>)`

  동적 모듈을 해제 합니다. [상세](../guide/modules.md#동적-모듈-등록)

### hotUpdate

- `hotUpdate(newOptions: Object)`

  새 액션과 변이를 핫 스왑 합니다. [상세](../guide/hot-reload.md)

## 컴포넌트 바인딩 헬퍼

### mapState

- `mapState(namespace?: string, map: Array<string> | Object<string | function>): Object`

  Vuex 저장소의 하위 트리를 반환하는 컴포넌트 계산 옵션을 만듭니다. [상세](../guide/state.md#mapstate-헬퍼)
  
  처음 argument는 string 타입의 namespace가 될 수 있습니다. [상세](../guide/modules.md#헬퍼에서-네임스페이스-바인딩)

  두번째 오브젝트 argument는 함수가 될 수 있습니다. `function(state: any)`

### mapGetters

- `mapGetters(namespace?: string, map: Array<string> | Object<String>): Object`

  getter의 평가된 값을 반환하는 컴포넌트 계산 옵션을 만듭니다. [상세](../guide/getters.md#mapgetters-헬퍼)
  
  처음 argument는 string 타입의 namespace가 될 수 있습니다. [상세](../guide/modules.md#헬퍼에서-네임스페이스-바인딩)

### mapActions

- `mapActions(namespace?: string, map: Array<string> | Object<string | function>): Object`

  액션을 전달하는 컴포넌트 메소드 옵션을 만듭니다. [상세](../guide/actions.md#컴포넌트-내부에서-디스패치-액션-사용하기)
  
  처음 argument는 string 타입의 namespace가 될 수 있습니다. [상세](../guide/modules.md#헬퍼에서-네임스페이스-바인딩)

  두번째 오브젝트 argument는 함수가 될 수 있습니다. `function(dispatch: function, ...args: any[])`

### mapMutations

- `mapMutations(namespace?: string, map: Array<string> | Object<string | function>): Object`

  변이를 커밋하는 컴포넌트 메소드 옵션을 만듭니다. [상세](../guide/mutations.md#컴포넌트-안에서-변이-커밋하기)
  
  처음 argument는 string 타입의 namespace가 될 수 있습니다. [상세](../guide/modules.md#헬퍼에서-네임스페이스-바인딩)

  두번째 오브젝트 argument는 함수가 될 수 있습니다. `function(commit: function, ...args: any[])`
  
### createNamespacedHelpers

- `createNamespacedHelpers(namespace: string): Object`

  namespace가 적용된 컴포넌트 바인딩 helper를 만듭니다. 주어진 namespace가 적용된 `mapState`, `mapGetters`, `mapActions` `mapMutations`들을 가지고 있는 오브젝트를 반환합니다. [상세](../guide/modules.md#헬퍼에서-네임스페이스-바인딩)