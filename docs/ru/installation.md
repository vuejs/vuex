# Установка

### Скачивание Напрямую / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

[Unpkg.com](https://unpkg.com) предоставляет CDN-ссылки для NPM-пакетов. Приведённая выше ссылка всегда будет указывать на самый свежий релиз, доступный в NPM. Кроме того, можно указать конкретную версию или тег: `https://unpkg.com/vuex@2.0.0`.

Подключите `vuex` после Vue, и установка произойдёт автоматически:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### NPM

``` bash
npm install vuex
```

При использовании модульных систем, необходимо явным образом установить Vuex посредством`Vue.use()`:

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

При использовании глобальных тегов `<script>` в этом нет необходимости.

### Использование Версии в Разработке

Если вы хотите использовать самую новую dev-сборку, придётся вручную склонировать репозиторий с GitHub и запустить сборку:

``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
