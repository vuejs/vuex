# 설치

### 직접 다운로드 / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

<!--email_off-->
[Unpkg.com](https://unpkg.com)은 NPM 기반 CDN 링크를 제공합니다. 위의 링크는 항상 NPM의 최신 릴리스를 가리킵니다. `https://unpkg.com/vuex@2.0.0`과 같은 URL을 통해 특정 버전/태그를 사용할 수도 있습니다.
<!--/email_off-->

Vue 뒤에 `vuex`를 추가하면 자동으로 설치됩니다:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### NPM

``` bash
npm install vuex --save
```

### Yarn

``` bash
yarn add vuex
```

모듈 시스템과 함께 사용하면 `Vue.use()`를 통해 Vuex를 명시적으로 추가해야 합니다.

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

전역 스크립트 태그를 사용할 때는 이 작업을 할 필요가 없습니다.

### Promise

Vuex는 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)를 필요로 합니다. 만약 지원 대상 브라우저가 아직 Promise를 구현하지 않았다면(예를 들어 IE), [es6-promise](https://github.com/stefanpenner/es6-promise)와 같은 polyfill 라이브러리를 사용할 수 있습니다.

CDN을 통해서 포함할 수 있습니다:

``` html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>
```

그러면 자동으로 `window.Promise`를 사용할 수 있습니다.

NPM 이나 Yarn 같은 패키지 매니저를 사용한다면, 아래 명령어로 설치할 수 있습니다:

``` bash
npm install es6-promise --save # NPM
yarn add es6-promise # Yarn
```

또한 Vuex를 사용하기 전에 아래 코드를 아무 곳에나 추가하십시오.

``` js
import 'es6-promise/auto'
```


### 개발용 빌드

최신 dev 빌드를 사용하고 싶은 경우 직접 GitHub에서 클론하고 `vuex`를 직접 빌드 해야합니다.


``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
