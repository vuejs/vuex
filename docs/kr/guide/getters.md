# Getters

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/c2Be7TB" target="_blank" rel="noopener noreferrer">Scrimba에서이 수업을 해보십시오.</a></div>

때로는 저장소 상태를 기반하는 상태를 계산해야 할 수도 있습니다.(예: 아이템 리스트를 필터링하고 계산)

``` js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

둘 이상의 컴포넌트가 이를 사용 해야하는 경우 함수를 복제하거나 공유된 헬퍼를 추출하여 여러 위치에서 가져와야합니다. 둘 다 이상적이지 않습니다.

Vuex를 사용하면 저장소에서 "getters"를 정의 할 수 있습니다. 저장소의 계산된 속성으로 생각할 수 있습니다. 계산된 속성처럼 getter의 결과는 종속성에 따라 캐쉬되고, 일부 종속성이 변경된 경우에만 다시 재계산 됩니다.

Getters는 첫 번째 전달인자로 상태를 받습니다.

``` js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

### 속성 유형 접근

getters는 `store.getters` 객체에 노출되고, 속성으로 값에 접근할 수 있습니다:

``` js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getters는 두 번째 전달인자로 다른 getter도 받게됩니다.

``` js
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```

``` js
store.getters.doneTodosCount // -> 1
```

이제 모든 컴포넌트에서 쉽게 사용할 수 있습니다.

``` js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

속성으로 접근하는 getter는 Vue의 반응성 시스템의 일부로 캐시된 것임을 유의해야 합니다.

### 메소드 유형 접근

함수를 반환하여 getter에 전달인자로 전달할 수도 있습니다. 이것은 저장소의 배열을 검색할 때 특히 유용합니다.

```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```

``` js
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

메서드를 통해 접근하는 getter는 호출 할 때마다 실행되며 결과가 캐시되지 않는다는 것을 유의해야 합니다.

### `mapGetters` 헬퍼

`mapGetters` 헬퍼는 저장소 getter를 로컬 계산된 속성에 매핑합니다.

``` js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // getter를 객체 전개 연산자(Object Spread Operator)로 계산하여 추가합니다.
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

getter를 다른 이름으로 매핑하려면 객체를 사용합니다.

``` js
...mapGetters({
  // this.doneCount를 store.getters.doneTodosCount에 매핑하십시오.
  doneCount: 'doneTodosCount'
})
```
