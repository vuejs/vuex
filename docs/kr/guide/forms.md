# 폼 핸들링

<div class="scrimba"><a href="https://scrimba.com/p/pnyzgAP/cqKRgEC9" target="_blank" rel="noopener noreferrer">Scrimba에서이 수업을 해보십시오.</a></div>

strict 모드로 Vuex를 사용하는 경우 Vuex에 포함된 부분에 `v-model`을 사용하는 것은 약간 까다로울 수 있습니다.

``` html
<input v-model="obj.message">
```

`obj`가 저장소에서 객체를 반환하는 계산된 속성이라면, 여기에있는 `v-model`은 사용자가 입력 할 때 `obj.message`를 직접 변경하려고 합니다. strict 모드에서는 Vuex 변이 처리기 내부에서 변이가 수행되지 않으므로 오류가 발생합니다.

그것을 다루는 "Vuex 방식"은 `<input>`의 값을 바인딩하고 `input` 또는 `change` 이벤트에 대한 액션을 호출하는 것 입니다.

``` html
<input :value="message" @input="updateMessage">
```
``` js
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```

변이에 대한 핸들러 입니다.

``` js
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

### 양방향 계산된 속성

틀림없이, 위의 내용은 `v-model` + 지역 상태보다 좀더 장황 해졌고, `v-model`의 유용한 기능 중 일부를 잃어 버렸습니다. 다른 방법은 setter를 사용하여 양방향 계산된 속성을 사용하는 것입니다.

``` html
<input v-model="message">
```
``` js
// ...
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```
