# Strict 모드

strict 모드를 사용하기 위해, `strict: true`를 Vuex 저장소를 만들 때 추가하면 됩니다.

``` js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

엄격 모드에서는 Vuex 상태가 변이 핸들러 외부에서 변이 될 때 마다 오류가 발생합니다. 이렇게하면 디버깅 도구로 모든 상태 변이를 명시적으로 추적 할 수 있습니다.

### 개발 vs. 배포

**배포시 strict 모드를 켜지 마십시오!**  Strict 모드는 부적절한 변이를 감지하기 위해 상태 트리를 자세히 관찰합니다. 성능 이슈를 피하기 위해 배포 환경에서 이를 해제 하십시오.

플러그인과 마찬가지로 빌드 도구가 다음을 처리하도록 할 수 있습니다.

``` js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
