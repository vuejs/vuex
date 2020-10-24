# Установка

## Скачивание напрямую / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

<!--email_off-->

[Unpkg.com](https://unpkg.com) предоставляет CDN-ссылки для NPM-пакетов. Ссылка, приведённая выше, всегда указывает на самый последней релиз Vuex, доступный в NPM. Кроме того, можно указывать в ссылке конкретную версию или тег, например `https://unpkg.com/vuex@2.0.0`.

<!--/email_off-->

Подключите `vuex` после Vue, и установка произойдёт автоматически:

```html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

## NPM

```bash
npm install vuex --save

# При использовании Vue 3.0 + Vuex 4.0:
npm install vuex@next --save
```

## Yarn

```bash
yarn add vuex

# При использовании Vue 3.0 + Vuex 4.0:
yarn add vuex@next --save
```

При использовании системы сборки необходимо явно устанавливать как плагин:

### Для Vue 2

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

### Для Vue 3

```js
import { createApp } from 'vue'
import { createStore } from 'vuex'

const app = createApp({ ... })
const store = createStore({ ... })

app.use(store)
```

При использовании глобальных тегов `<script>` в этом нет необходимости.

## Promise

Vuex использует в своей работе [Promise](https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Ispolzovanie_promisov). Если необходимо поддерживать старые браузеры, которые не реализуют Promise (например, IE) — добавьте полифил, например [es6-promise](https://github.com/stefanpenner/es6-promise).

Его можно подключить через CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>
```

После этого `window.Promise` будет доступен автоматически.

Если используете менеджер пакетов NPM или Yarn, то установите пакет следующей командой:

```bash
npm install es6-promise --save # NPM
yarn add es6-promise # Yarn
```

И добавьте строку ниже с импортом в любое место вашего кода перед использованием Vuex:

```js
import 'es6-promise/auto';
```

## Версия для разработки

Для использования самой новой dev-сборки `vuex` — склонируйте репозиторий с GitHub вручную и запустите сборку:

```bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
