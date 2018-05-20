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

### 개발용 빌드

최신 dev 빌드를 사용하고 싶은 경우 직접 GitHub에서 클론하고 `vuex`를 직접 빌드 해야합니다.


``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
