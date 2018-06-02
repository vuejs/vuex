# Установка

### Скачивание напрямую / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

<!--email_off-->

[Unpkg.com](https://unpkg.com) предоставляет CDN-ссылки на содержимое NPM-пакетов. Приведённая выше ссылка всегда будет указывать на самый свежий релиз Vuex, доступный в NPM. Кроме того, можно указать конкретную версию или тег, например `https://unpkg.com/vuex@2.0.0`.

<!--/email_off-->

Подключите `vuex` после Vue, и установка произойдёт автоматически:

```html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### NPM

```bash
npm install vuex --save
```

### Yarn

```bash
yarn add vuex
```

Если вы используете систему сборки, установите Vuex явным образом командой `Vue.use()`:

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
```

При использовании глобальных тегов `<script>` в этом нет необходимости.

### Promise

Vuex для работы необходимы [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises). Если браузеры, которые вы поддерживаете не реализуют Promise (например, IE), то вы можете использовать библиотеку-полифилл, такую как [es6-promise](https://github.com/stefanpenner/es6-promise).

Вы можете подключить её через CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>
```

Тогда `window.Promise` будет доступен автоматически.

Если вы предпочитаете использовать менеджер пакетов, такой как NPM или Yarn, то установите пакет с помощью следующей команды:

```bash
npm install es6-promise --save # NPM
yarn add es6-promise # Yarn
```

Кроме того, добавьте строку ниже в любое место вашего кода перед использованием Vuex:

```js
import 'es6-promise/auto';
```

### Версия для разработки

Если вы хотите использовать самую новую dev-сборку `vuex`, то придётся вручную склонировать репозиторий с GitHub и запустить сборку:

```bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
