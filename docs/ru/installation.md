# Установка

## Скачивание напрямую / CDN

[https://unpkg.com/vuex@4](https://unpkg.com/vuex@4)

<!--email_off-->

[Unpkg.com](https://unpkg.com) предоставляет CDN-ссылки для NPM-пакетов. Ссылка, приведённая выше, всегда указывает на самый последней релиз Vuex, доступный в NPM. Кроме того, можно указывать в ссылке конкретную версию или тег, например `https://unpkg.com/vuex@4.0.0/dist/vuex.global.js`.

<!--/email_off-->

Подключите `vuex` после Vue, и установка произойдёт автоматически:

```html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

## NPM

```bash
npm install vuex@next --save
```

## Yarn

```bash
yarn add vuex@next --save
```

## Версия для разработки

Для использования самой новой dev-сборки `vuex` — склонируйте репозиторий с GitHub вручную и запустите сборку:

```bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
yarn
yarn build
```
